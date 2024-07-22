import { useAction } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";

export const useSpeechToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  const getSpeechToken = useAction(api.speech.getToken);

  useEffect(() => {
    getSpeechToken().then((response) => {
      setToken(response.token);
      setRegion(response.region);
    });
  }, [getSpeechToken]);

  return { token, region };
};
