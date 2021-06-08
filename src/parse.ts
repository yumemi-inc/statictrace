import {
  ConstructorDeclaration,
  FunctionDeclaration,
  Identifier,
  MethodDeclaration,
  Project,
  SyntaxKind,
  Node,
} from "ts-morph";
import { Command } from "commander";

import dotenv from "dotenv";

dotenv.config();

type Entrypoint = string;
type TracedCall = { name: string; level: number };
type Entrypoints = Map<Entrypoint, Array<TracedCall>>;

const program = new Command();
program.option("-p, --project <path>", "path to a tsconfig.json file");
program.parse();

const projectConfig = program.opts()["project"];
const tsConfigFilePath = projectConfig || process.env.TS_PROJECT_CONFIG;

const project = new Project({
  tsConfigFilePath,
  libFolderPath: "./node_modules/typescript",
});

const entrypoints: Entrypoints = new Map();

for (const sourceFile of project.getSourceFiles()) {
  const functions = sourceFile.getFunctions();
  const classes = sourceFile.getClasses();

  traceEntrypoints(functions);

  for (const clazz of classes) {
    traceEntrypoints(clazz.getConstructors());
    traceEntrypoints(clazz.getMethods());
  }
}

function traceEntrypoints(
  functions:
    | FunctionDeclaration[]
    | MethodDeclaration[]
    | ConstructorDeclaration[]
) {
  for (const func of functions) {
    const signature = func.getSignature();
    const annotations = signature.getJsDocTags();
    const entrypointTag = annotations.find(
      (tag) => tag.getName() == "entrypoint"
    );

    if (entrypointTag) {
      const { text } = entrypointTag.getText()[0]; // Represents text in /** @entrypoint text */.

      // No traced functions are anonymous.
      entrypoints.set(text, [
        {
          name: Node.isConstructorDeclaration(func)
            ? "constructor"
            : func.getName()!,
          level: 0,
        },
      ]);

      traceFunctionRecursive(entrypoints, text, func);
    }
  }
}

function isTraced(func: FunctionDeclaration | MethodDeclaration) {
  const signature = func.getSignature();
  const annotations = signature.getJsDocTags();
  return annotations.find((tag) => tag.getName() == "trace");
}

function traceFunctionRecursive(
  entrypoints: Entrypoints,
  entrypoint: string,
  func: FunctionDeclaration | MethodDeclaration | ConstructorDeclaration,
  level: number = 0
) {
  function getDefinitionsFromIdentifier(identifier: Identifier | undefined) {
    try {
      return identifier?.getDefinitions() ?? [];
    } catch (e) {
      console.error(
        "An internal error occurred at getDefinitionsFromIdentifier: entrypoint = %s, func = %s",
        entrypoint,
        Node.isConstructorDeclaration(func) ? "constructor" : func.getKindName()
      );
      return [];
    }
  }

  for (const call of func.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const ident =
      call.getFirstChildByKind(SyntaxKind.Identifier) ||
      call
        .getFirstChildByKind(SyntaxKind.PropertyAccessExpression)
        ?.getFirstChildByKindOrThrow(SyntaxKind.Identifier);

    for (const definition of getDefinitionsFromIdentifier(ident)) {
      const declNode = definition.getDeclarationNode()!;
      const calledFunc =
        declNode.asKind(SyntaxKind.FunctionDeclaration) ||
        declNode.asKind(SyntaxKind.MethodDeclaration);

      if (calledFunc && isTraced(calledFunc)) {
        // Entrypoint is guaranteed to exist.
        const tracedCalls = entrypoints.get(entrypoint)!;

        tracedCalls.push({ name: calledFunc.getName()!, level });

        // Recurse until the function stops calling other functions.
        traceFunctionRecursive(entrypoints, entrypoint, calledFunc, level + 1);
      }
    }
  }
}

for (const [ep, tracedCalls] of entrypoints.entries()) {
  console.log("Entrypoint: ", ep, "\n");
  for (const call of tracedCalls) {
    console.log("\t".repeat(call.level), call.name);
  }
}
