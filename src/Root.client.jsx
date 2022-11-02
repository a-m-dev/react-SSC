import React, { useState } from "react";
import { useServerResponse } from "./Cache.client";
import { LocationContext } from "./LocationContext.client";

export default function Root({ initialCache }) {
  const [val, setVal] = useState(0);

  return (
    <div>
      <h1>Hi There from react app CLIENT 12345!</h1>
      <br />
      <button onClick={() => setVal(val + 1)}>{val}, update me!</button>
      <Content />
    </div>
  );
}

function Content() {
  const [location, setLocation] = useState({
    selectedId: null,
    isEditing: false,
    searchText: "",
  });

  const response = useServerResponse(location);
  console.log({ response });
  return (
    <LocationContext.Provider value={[location, setLocation]}>
      {response.value}
    </LocationContext.Provider>
  );
}
