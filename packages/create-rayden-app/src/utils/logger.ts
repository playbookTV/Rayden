import pc from "picocolors";

export const logger = {
  info: (msg: string) => console.log(pc.blue("info"), msg),
  success: (msg: string) => console.log(pc.green("success"), msg),
  warn: (msg: string) => console.log(pc.yellow("warn"), msg),
  error: (msg: string) => console.log(pc.red("error"), msg),
  step: (msg: string) => console.log(pc.cyan("->"), msg),
};
