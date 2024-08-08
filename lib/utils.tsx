import { CSSProp } from "styled-components";

declare module "react" {
  interface Attributes {
    css?: CSSProp;
  }
}

import { parse } from "ansicolor";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const ansiToSpans = (text: string) => {
  return parse(text).spans.map((span, i) => (
    <span key={i} css={span.css}>
      {span.text}
    </span>
  ));
};

export const throttle = (mainFunction: Function, delay: number) => {
  let timerFlag: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    if (timerFlag === null) {
      mainFunction(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
};
