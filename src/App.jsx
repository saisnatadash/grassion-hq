import React, { useState } from "react";
import Login from "./Login";
import GrassionHQ from "./GrassionHQ";

export default function App() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem("ghq_auth") === "1");
  if (!auth) return <Login onAuth={() => setAuth(true)} />;
  return <GrassionHQ />;
}
