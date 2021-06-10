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

// Synonymous for now, potentially changeable in the future.
export type Printable = Entrypoints;

export interface Printer {
  print(graph: Into<Printable>): any;
}

export interface Into<T> {
  into(): T;
}
