import { Command } from 'commander';

import dotenv from 'dotenv';
import { getParserForTsProject, ParseFunction } from './parse';
import { MermaidPrinter, TextPrinter } from './printer';
import { Printer } from './types';

function selectPrinter(type: string): Printer {
  switch (type) {
    case 'text':
      return new TextPrinter();
    case 'mermaid':
      return new MermaidPrinter();
    default:
      return new TextPrinter();
  }
}

export async function run(
  config: string,
  printer: Printer = new TextPrinter()
) {
  const parser: ParseFunction = getParserForTsProject(config);
  const result = await Promise.resolve(parser());
  return printer.print(result);
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
  const printerType = program.opts()['use'] || 'text';
  const Printer = selectPrinter(printerType);
  const tsConfigFilePath = projectConfig || process.env.TS_PROJECT_CONFIG;

  console.log(run(tsConfigFilePath, Printer));
}
