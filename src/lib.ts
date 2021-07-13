#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import { getParserForTsProject } from './parse';
import { MermaidPrinter, TextPrinter } from './printer';
import { Printer } from './types';
import { loadTomlSettings } from './settings';

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

export async function run(pathToTsConfig: string, printerType: string) {
  const parser = getParserForTsProject(pathToTsConfig);
  const result = await Promise.resolve(parser());
  const printer = selectPrinter(printerType);
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
  program.option('-c, --config <path>', 'path to a configuration file');
  program.parse();

  const cliPathToTsConfig: string | undefined = program.opts()['project'];
  const cliPrinterType: string | undefined = program.opts()['use'];
  const pathToStaticTraceConfig: string | undefined = program.opts()['config'];

  const settings = loadTomlSettings(pathToStaticTraceConfig);

  const pathToTsConfig =
    cliPathToTsConfig ??
    settings?.project?.path ??
    process.env.TS_PROJECT_CONFIG;

  const printerType = cliPrinterType ?? settings?.printer?.type ?? 'text';

  if (!pathToTsConfig) {
    throw new Error('Provide a valid path to tsconfig.json!');
  }

  run(pathToTsConfig, printerType).then((output) => {
    console.log(output);
  });
}
