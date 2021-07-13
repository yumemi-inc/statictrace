# statictrace

[日本語](README.JP.md)

## Requirements

Node.js 14.15.0 or later.

## Usage

Currently you can only use this tool by building it from source.

```
pnpm install
pnpm run build
```

With `ts-node`:

```
`pnpx ts-node src/lib.ts -p /absolute/path/to/tsconfig.json`
```

### Use as CLI

```
pnpm run build
pnpm run parse -- -p /absolute/path/to/tsconfig.json
```

You can omit the `-p` option by creating an `.env` file with a `TS_PROJECT_CONFIG` variable.

**Other options**

- `u, --use <printer>` (optional): choose one of default printer types (`text` or `mermaid`).

**Examples**

- Output the result printed as mermaid graphs to a markdown file: `pnpm run parse -- -u mermaid > graphs.md`

```
TS_PROJECT_CONFIG=/absolute/path/to/tsconfig.json
```

### Use API programmatically

```js
const { run } = require('./build/lib');
const output = run('/absolute/path/to/tsconfig.json');
// ...do something with output
```

#### `run(pathToTsConfig: string, printerType: "text" | "mermaid"): any`

Load all project files and build a graph of all function calls marked with `@entrypoint` or `@trace` tags. You should pass a printer type as a second argument. A printer is an interface that represents anything that can print (display the static analysis result in one way or another). Currently you cannot provide your own implementations but can choose one of the default ones.
