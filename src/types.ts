import {
  FunctionDeclaration,
  MethodDeclaration,
  ConstructorDeclaration,
} from "ts-morph";

export type Entrypoint = string;
export type TracedCall = { name: string; level: number };
export type Entrypoints = Map<Entrypoint, Array<TracedCall>>;
export type CallableDeclaration =
  | FunctionDeclaration
  | MethodDeclaration
  | ConstructorDeclaration;
