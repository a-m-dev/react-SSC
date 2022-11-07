import React, { Suspense } from "react";
import AppContextProvider from "../contexts/AppContext.client";
import { ErrorBoundary } from "react-error-boundary";
import "../styles/index.scss";

export default function Root({ initialCache }) {
  return (
    <Suspense fallback={null}>
      <ErrorBoundary FallbackComponent={Error}>
        <AppContextProvider />
      </ErrorBoundary>
    </Suspense>
  );
}

function Error({ error }) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre>{error.stack}</pre>
    </div>
  );
}
