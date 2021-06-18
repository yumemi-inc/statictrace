# statictrace

## Requirements

Node.js 14.15.0 以上が動作する環境。

## Usage

現在は、ソースからビルドする以外の使用方法がありません。

```
pnpm install
pnpm run build
```

### Use as CLI

```
pnpm run build
pnpm run parse -- -p /absolute/path/to/tsconfig.json
```

`ts-node`の場合:

```
`pnpx ts-node src/lib.ts -p /absolute/path/to/tsconfig.json`
```

`.env`ファイルを作成し、`TS_PROJECT_CONFIG`環境変数を定義することで、`-p`オプションは省略できます。

**その他のオプション**

- `u, --use <printer>` (optional): デフォルトの中からプリンターを選択する (`text`または`mermaid`).

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

全てのプロジェクトのファイルをロードし、`@entrypoint`か`@trace`でマークされている全ての関数のコールのグラフを作る。`Printer`は、グラフをプリント（なんらかの方法で表示できる）ことを表すインターフェースで、そのインターフェースを implement したものならなんでもオプショナルな引数として渡すことができます。何も渡さなかった場合は、解析の結果を`TextPrinter`が文字列として戻します。

```ts
interface Printer {
  print(graph: Into<Printable>): any;
}
```
