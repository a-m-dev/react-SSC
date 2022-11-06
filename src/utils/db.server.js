import { Pool } from "react-pg";
import credentials from "../../credentials";

const cred = {
  ...credentials,
  host: "host.docker.internal" || "192.168.1.66",
};

console.log({ cred });

export const db = new Pool(cred);
