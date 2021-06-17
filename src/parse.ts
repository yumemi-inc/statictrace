import { Project, SyntaxKind, Node } from "ts-morph";
import {
  getDefinitionNode,
  getEntrypointTag,
  getEntrypointText,
  isTraced,
} from "./helpers";
import { Environment } from "./struct";
import {
  Entrypoints,
  CallableDeclaration,
  Printer,
  Printable,
  Into,
} from "./types";

const MAX_CALL_DEPTH = 50;

class EntrypointGraph extends Map implements Into<Printable> {
  into() {
    return this;
  }
}

function traceEntrypoints(
  entrypoints: Entrypoints,
  functions: Array<CallableDeclaration>
) {
  for (const func of functions) {
    const entrypointTag = getEntrypointTag(func);

    if (entrypointTag) {
      const text = getEntrypointText(entrypointTag); // Represents text in /** @entrypoint text */.

      // Skip (nested) entrypoints that were found (& cached) in previously traversed functions.
      if (!entrypoints.has(text)) {
        let environment = new Environment(func);
        entrypoints.set(text, [environment]);

        traceFunctionRecursive(entrypoints, text, environment);
      }
    }
  }
}

function traceFunctionRecursive(
  entrypoints: Entrypoints,
  root: string,
  parent: Environment
) {
  if (parent.level() >= MAX_CALL_DEPTH) {
    throw new Error(`Exceeded maximum call depth (${MAX_CALL_DEPTH})`);
  }

  for (const call of parent
    .decl()
    .getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const firstChild = call.getFirstChild();

    if (firstChild) {
      // getLastChildByKindOrThrow works well in cases of deep property access (see AST).
      const identifier = Node.isPropertyAccessExpression(firstChild)
        ? firstChild.getLastChildByKindOrThrow(SyntaxKind.Identifier)
        : firstChild.asKindOrThrow(SyntaxKind.Identifier);

      const callee = getDefinitionNode(identifier);

      if (callee && isTraced(callee)) {
        // Entrypoint is guaranteed to exist.
        const tracedCalls = entrypoints.get(root)!;
        const environment = new Environment(callee, parent);

        tracedCalls.push(environment);

        // Prevent infinite (including indirect) recursion.
        if (environment.hasAncestor(environment.name())) continue;

        traceFunctionRecursive(entrypoints, root, environment);
      }
    }
  }
}

export class Parser {
  project: Project;
  entrypointGraph: EntrypointGraph;

  constructor(tsConfigFilePath: string) {
    this.project = new Project({
      tsConfigFilePath,
      libFolderPath: "./node_modules/typescript",
    });
    this.entrypointGraph = new EntrypointGraph();
  }

  parse() {
    for (const sourceFile of this.project.getSourceFiles()) {
      const functions = sourceFile.getFunctions();
      const classes = sourceFile.getClasses();

      traceEntrypoints(this.entrypointGraph, functions);

      for (const clazz of classes) {
        traceEntrypoints(this.entrypointGraph, clazz.getConstructors());
        traceEntrypoints(this.entrypointGraph, clazz.getMethods());
      }
    }
  }

  print(printer: Printer) {
    return printer.print(this.entrypointGraph);
  }
}
