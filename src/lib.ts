import { Command } from "commander";

import dotenv from "dotenv";
import { Parser } from "./parse";

dotenv.config();

const program = new Command();
program.option("-p, --project <path>", "path to a tsconfig.json file");
program.parse();

const projectConfig = program.opts()["project"];
const tsConfigFilePath = projectConfig || process.env.TS_PROJECT_CONFIG;

const parser = new Parser(tsConfigFilePath);

parser.parse();
parser.print();
