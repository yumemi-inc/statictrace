import type {
  FunctionDeclaration,
  MethodDeclaration,
  ConstructorDeclaration
} from 'ts-morph';
import type { Environment } from './struct';

export type Entrypoint = string;
export type Entrypoints = Map<Entrypoint, Array<Environment>>;
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
