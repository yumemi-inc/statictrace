import { Command } from "commander";

import dotenv from "dotenv";
import { Parser } from "./parse";

dotenv.config();

function run(config: string) {
  const parser = new Parser(config);
  parser.parse();
  return parser.print();
}

// True if run as a CLI application direcly
if (require.main === module) {
  const program = new Command();
  program.option("-p, --project <path>", "path to a tsconfig.json file");
  program.parse();

  const projectConfig = program.opts()["project"];
  const tsConfigFilePath = projectConfig || process.env.TS_PROJECT_CONFIG;

  const output = run(tsConfigFilePath);
  console.log(output);
}
