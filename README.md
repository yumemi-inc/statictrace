# statictrace

## How to Use

Node.js 14 以上が動作する環境

`pnpm` がまだインストールされていない場合は npm i -g pnpm する

`pnpm i` (npm ci)

`pnpm run watch` で TypeScript のソースコードを build/ へビルド

`pnpm run parse -- -p <path to tsconfig.json>` で TS プロジェクトのソースを解析
または `pnpx ts-node src/XXX.ts -p <path to tsconfig.json>`

## .env

parse コマンドに-p オプションとして毎回同じパスを指定しなくてもいいように .env ファイルが使えます

```
TS_PROJECT_CONFIG=/absolute_path/to/your/tsconfig.json
```
