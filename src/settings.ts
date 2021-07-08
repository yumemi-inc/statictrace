import TOML from '@iarna/toml';
import fs from 'fs';
import path from 'path';

export interface ProjectSettings {
  path?: string;
}

export interface PrinterSettings {
  type?: string;
}

export interface Settings {
  project?: ProjectSettings;
  printer?: PrinterSettings;
}

export function loadTomlSettings(
  pathToTsConfig: string = 'statictrace.toml'
): Settings | null {
  const absolutePathToConfig = path.join(process.cwd(), pathToTsConfig);

  if (!fs.existsSync(absolutePathToConfig)) {
    return null;
  }

  const file = fs.readFileSync(absolutePathToConfig, { encoding: 'utf-8' });
  return TOML.parse(file) as unknown as Settings;
}
