import { createFromReadableStream } from "react-server-dom-webpack/client";

export function navigate({ response, startNavigating, setAppState }) {
  const cacheKey = response.headers.get("X-Location");
  const nextLocation = JSON.parse(cacheKey);
  // const seededResponse = createFromReadableStream(response.body);
  startNavigating(() => {
    // refresh(cacheKey, seededResponse);
    setAppState(nextLocation);
  });
}
