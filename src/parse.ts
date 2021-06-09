import {
  FunctionDeclaration,
  MethodDeclaration,
  Project,
  SyntaxKind,
  Node,
} from "ts-morph";
import {
  constructorClassName,
  getCallableName,
  getDefinitionNode,
  getEntrypointTag,
  getEntrypointText,
} from "./helpers";
import { Entrypoints, CallableDeclaration } from "./types";

const MAX_CALL_DEPTH = 50;

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
        entrypoints.set(text, [
          {
            name: getCallableName(func),
            level: 0,
          },
        ]);

        traceFunctionRecursive(entrypoints, text, func);
      }
    }
  }
}

function traceFunctionRecursive(
  entrypoints: Entrypoints,
  entrypoint: string,
  func: CallableDeclaration,
  level: number = 1
) {
  if (level >= MAX_CALL_DEPTH) {
    throw new Error(`Exceeded maximum call depth (${MAX_CALL_DEPTH})`);
  }

  for (const call of func.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const firstChild = call.getFirstChild();

    if (firstChild) {
      // getLastChildByKindOrThrow works well in cases of deep property access (see AST).
      const identifier = Node.isPropertyAccessExpression(firstChild)
        ? firstChild.getLastChildByKindOrThrow(SyntaxKind.Identifier)
        : firstChild.asKindOrThrow(SyntaxKind.Identifier);

      // Should not throw if the file is type-checked.
      const callee = getDefinitionNode(identifier);

      if (callee && isTraced(callee)) {
        // Entrypoint is guaranteed to exist.
        const tracedCalls = entrypoints.get(entrypoint)!;

        tracedCalls.push({ name: callee.getName()!, level });

        // Check if this is a nested entrypoint.
        const selfEntrypoint = getEntrypointTag(callee);
        const enclosingFnName = getCallableName(func);

        // Prevent infinite recursion.
        if (callee.getName()! == enclosingFnName) continue;

        if (selfEntrypoint) {
          const entrypointText = getEntrypointText(selfEntrypoint);

          // Prevent indirect infinite recursion (= entrypoint is already initialized)
          if (entrypoints.has(entrypointText)) continue;

          entrypoints.set(entrypointText, [
            {
              name: callee.getName()!,
              level: 0,
            },
          ]);

          traceFunctionRecursive(entrypoints, entrypointText, callee);

          // Adjust levels and save traversal result so we don't have to traverse this nested entrypoint again.
          tracedCalls.push(
            ...entrypoints.get(entrypointText)!.map((ep) => {
              return { ...ep, level: ep.level + level + 1 };
            })
          );
        } else {
          // Recurse until the function stops calling other functions.
          traceFunctionRecursive(entrypoints, entrypoint, callee, level + 1);
        }
      }
    }
  }
}

function isTraced(func: FunctionDeclaration | MethodDeclaration) {
  const signature = func.getSignature();
  const annotations = signature.getJsDocTags();
  return annotations.find((tag) => tag.getName() == "trace");
}

export class Parser {
  project: Project;
  entrypoints: Entrypoints;

  constructor(tsConfigFilePath: string) {
    this.project = new Project({
      tsConfigFilePath,
      libFolderPath: "./node_modules/typescript",
    });
    this.entrypoints = new Map();
  }

  parse() {
    for (const sourceFile of this.project.getSourceFiles()) {
      const functions = sourceFile.getFunctions();
      const classes = sourceFile.getClasses();

      traceEntrypoints(this.entrypoints, functions);

      for (const clazz of classes) {
        traceEntrypoints(this.entrypoints, clazz.getConstructors());
        traceEntrypoints(this.entrypoints, clazz.getMethods());
      }
    }
  }

  print() {
    for (const [ep, tracedCalls] of this.entrypoints.entries()) {
      console.log("=======================");
      console.log("Entrypoint: ", ep, "\n");
      for (const call of tracedCalls) {
        console.log("\t".repeat(call.level), call.name);
      }
      console.log("\n");
    }
  }
}
