import { Command } from "commander";

import dotenv from "dotenv";
import { Parser } from "./parse";
import { TextPrinter } from "./printer";
import { Printer } from "./types";

export function run(config: string, printer: Printer = new TextPrinter()) {
  const parser = new Parser(config);
  parser.parse();
  return parser.print(printer);
}

// True if run as a CLI application direcly
if (require.main === module) {
  dotenv.config();

  const program = new Command();
  program.option("-p, --project <path>", "path to a tsconfig.json file");
  program.parse();

  const projectConfig = program.opts()["project"];
  const tsConfigFilePath = projectConfig || process.env.TS_PROJECT_CONFIG;

  console.log(run(tsConfigFilePath));
}
