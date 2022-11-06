import {
  useEffect,
  useState,
  // unstable_getCacheForType,
  unstable_useCacheRefresh,
} from "react";
import { createFromFetch } from "react-server-dom-webpack/client";

function createResponseCache() {
  return new Map();
}

export function useRefresh() {
  const refreshCache = unstable_useCacheRefresh();
  return function refresh(key, seededResponse) {
    refreshCache(createResponseCache, new Map([[key, seededResponse]]));
  };
}

export async function getServerResponse(location) {
  const key = JSON.stringify(location);
  // const cache = unstable_getCacheForType(createResponseCache);
  // let response = cache.get(key);

  // if (response) return response;

  let response = await createFromFetch(
    fetch("/react?location=" + encodeURIComponent(key))
  );

  // cache.set(key, response);

  return response;
}

export function _useServerResponse(appState) {
  const [tree, setTree] = useState(null);

  useEffect(() => {
    getServerResponse(appState).then((res) => {
      // console.log({ res });
      setTree(res);
    });
  }, [appState]);

  return { tree };
}
