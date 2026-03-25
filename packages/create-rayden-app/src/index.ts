import { cli } from "./cli.js";

cli().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
