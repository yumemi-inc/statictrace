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

```
TS_PROJECT_CONFIG=/absolute/path/to/tsconfig.json
```

### Use API programmatically

```js
const { run } = require('./build/lib');
const output = run('/absolute/path/to/tsconfig.json');
// ...do something with output
```

#### `run(pathToTsConfig: string, printer?: Printer): any`

Load all project files and build a graph of all function calls marked with `@entrypoint` or `@trace` tags. You can optionally pass a `Printer` as a second argument. A `Printer` is an interface that represents anything that can print (display in one way or another) the result of parsing. You can use anything that implements this interface. If you don't provide a second argument, a default `TextPrinter` returns the result as a string.

```ts
interface Printer {
  print(graph: Into<Printable>): any;
}
```
