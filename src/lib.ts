import { Command } from 'commander';
import TOML from '@iarna/toml';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getParserForTsProject } from './parse';
import { MermaidPrinter, TextPrinter } from './printer';
import { Printer } from './types';

const defaultSettings = {};

function loadTomlSettings(tsConfigFilePath: string) {
  const normalizedPathToTsConfig = tsConfigFilePath.startsWith('/')
    ? tsConfigFilePath
    : path.join(process.cwd(), tsConfigFilePath);
  const projectDir = path.dirname(normalizedPathToTsConfig);
  const pathToSettings = path.join(projectDir, 'settings.toml');

  if (!fs.existsSync(pathToSettings)) {
    return defaultSettings;
  }

  const file = fs.readFileSync(pathToSettings, { encoding: 'utf-8' });
  return TOML.parse(file);
}

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
  const parser = getParserForTsProject(config);
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

  const settings = loadTomlSettings(tsConfigFilePath);

  run(tsConfigFilePath, Printer).then((output) => {
    console.log(output);
  });
}
