import { Command } from 'commander';

import dotenv from 'dotenv';
import { Parser } from './parse';
import { MermaidPrinter, TextPrinter } from './printer';
import { Printer } from './types';
import fs from 'fs';

export function run(config: string, printer: Printer = new MermaidPrinter()) {
  const parser = new Parser(config);
  parser.parse();
  return parser.print(printer);
}

// True if run as a CLI application direcly
if (require.main === module) {
  dotenv.config();

  const program = new Command();
  program.option('-p, --project <path>', 'path to a tsconfig.json file');
  program.option(
    '-u, --use <printer>',
    'use one of default printers (text, mermaid)'
  );
  program.parse();

  const projectConfig = program.opts()['project'];
  const tsConfigFilePath = projectConfig || process.env.TS_PROJECT_CONFIG;

  const result = run(tsConfigFilePath);

  fs.writeFileSync('graphs.md', result);

  // console.log();
}
