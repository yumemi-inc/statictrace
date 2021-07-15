# statictrace

## Requirements

Node.js 14.15.0 以上が動作する環境。

## Installation

### Install

`npm install @yumemi-inc/statictrace`

`statictrace`はプロジェクトごとにインストールできるし、グローバルなパッケージとしてもインストールできます。

### Build from source

```
pnpm install
pnpm run build
```

### `ts-node`

```
`pnpx ts-node src/lib.ts -p /absolute/path/to/tsconfig.json`
```

### Use as CLI

```
statictrace -- -p /absolute/path/to/tsconfig.json
```

`.env`ファイルを作成し、`TS_PROJECT_CONFIG`環境変数を定義することで、`-p`オプションは省略できます。

```
TS_PROJECT_CONFIG=/absolute/path/to/tsconfig.json
```

**その他のオプション**

- `u, --use <printer>` (optional): デフォルトの中からプリンターを選択する (`text`または`mermaid`).

### 使い方

`statictrace`は、開発者が特殊なコメントでヒントした箇所からコードの静的な分析をはじめる。例えば以下のように登録フローを分析するために、フローがはじまることを表すヒント (`@entrypoint フローの名前`) を関数に JSDoc 形式で追加します。

```ts
/**
 * @entrypoint Registration
 */
function startRegistration() {
  processRegistration();
  finishRegistration();
  untracedFunction();
  cleanupSomething();
}
```

これだけでは何もアウトプットされないが、`statictrace` は `startRegistration()` の中で呼ばれる関数やメソッドをすべて把握します。開発者がテストやドキュメントの目的で、呼び出しの有無・順番・親子関係を記録したい場合は、気になる関数とメソッドだけ別の特殊なヒントでマークできる。そのヒントは `@trace`。

```ts
/** @trace */
function processRegistration() {
  someRegistrationProcedure();
}
```

これで `statictrace` を実行すると以下のアウトプットが得られる：

```
Entrypoint: Registration
startRegistration
        processRegistration
                someRegistrationProcedure
```

このアウトプットをスナップショットのように使って、好みのテストライブラリでリファクタリング前と後の差分でフローが変わっていないことを保証できる。または [`mermaid`](https://mermaid-js.github.io/mermaid/#/) として結果をアウトプットできる（以下に画像がある）。

### 例

- デバッガーのスタックトレースのようにインデントされたテキストとしてアウトプットする：

```sh
$ statictrace

=======================
Entrypoint: SomeEntrypoint
begin
        funcA
                funcC
        beingNestedEntrypoint
                funcA
                        funcC
                funcB
        funcB
```

- mermaid グラフとしてマークダウンファイルにアウトプットする: `statictrace -u mermaid > graphs.md`

この場合のグラフが以下のように表示されます：
![mermaid](./assets/mermaid.png)

### Use API programmatically

```js
const { run } = require('./build/lib');
const output = run('/absolute/path/to/tsconfig.json', 'text');
// ...do something with output
```

#### `run(pathToTsConfig: string, printerType: "text" | "mermaid"): any`

全てのプロジェクトのファイルをロードし、`@entrypoint`か`@trace`でマークされている全ての関数のコールのグラフを作る。第二の引数としてプリンタータイプを指定する。プリンターというのは静的分析の結果をなんらかの形で表示できるインターフェースを指します。現在、独自の実装は不可能で、デフォルトのタイプから選択する必要がある。
