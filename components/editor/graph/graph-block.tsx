import "desmos";

import { InlineContentSchema, StyleSchema } from "@blocknote/core";
import { ReactCustomBlockRenderProps } from "@blocknote/react";
import Script from "next/script";
import { FC, useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/spinner";

import { GraphBlockConfig } from ".";
import { graphStateJSONSchema } from "./schemas";
import { GraphState } from "./types";

export const GraphBlock: FC<
  ReactCustomBlockRenderProps<
    GraphBlockConfig,
    InlineContentSchema,
    StyleSchema
  >
> = ({ block, editor }) => {
  const result = graphStateJSONSchema.safeParse(block.props.state);

  const graphRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [graphState, setGraphState] = useState<GraphState | null>(
    result.error ? null : result.data,
  );

  const updateEditor = () => {
    editor.updateBlock(block.id, {
      props: {
        ...block.props,
        state: JSON.stringify(graphState),
      },
    });
  };

  // can only initialize GraphingCalculator after graphRef is mounted
  useEffect(() => {
    if (!ready || !graphRef.current) return;

    const calculator = Desmos.GraphingCalculator(graphRef.current);

    if (graphState) calculator.setState(graphState);

    calculator.observeEvent("change", () => {
      setGraphState(calculator.getState() as GraphState);
    });

    // on subsequent callbacks, a duplicate graph is appended to the graphRef
    // this is a workaround to remove the duplicate graphs
    while (graphRef.current.children.length > 1)
      graphRef.current.removeChild(graphRef.current.lastChild as ChildNode);
  }, [ready, graphRef, graphState]);

  return (
    <>
      <Script
        src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
      />
      <div
        ref={graphRef}
        // update when Desmos input loses focus,
        // otherwise interactive element will lose focus while user is still typing
        onBlur={updateEditor}
        className="w-full h-96 flex items-center justify-center"
      >
        {!ready && <Spinner />}
      </div>
    </>
  );
};
