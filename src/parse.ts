import { FunctionDeclaration, Project, SyntaxKind } from "ts-morph";
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

const project = new Project({ tsConfigFilePath });

const entrypoints: Entrypoints = new Map();

for (const sourceFile of project.getSourceFiles()) {
  const functions = sourceFile.getFunctions();

  for (const func of functions) {
    const signature = func.getSignature();
    const annotations = signature.getJsDocTags();
    const entrypointTag = annotations.find(
      (tag) => tag.getName() == "entrypoint"
    );

    if (entrypointTag) {
      const { text } = entrypointTag.getText()[0]; // Represents text in /** @entrypoint text */.

      // No traced functions are anonymous.
      entrypoints.set(text, [{ name: func.getName()!, level: 0 }]);

      traceFunctions(entrypoints, text, func);
    }
  }
}

function isTraced(func: FunctionDeclaration) {
  const signature = func.getSignature();
  const annotations = signature.getJsDocTags();
  return annotations.find((tag) => tag.getName() == "trace");
}

function traceFunctions(
  entrypoints: Entrypoints,
  entrypoint: string,
  func: FunctionDeclaration,
  level: number = 0
) {
  for (const call of func.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const identNode = call.getFirstDescendantOrThrow();
    const ident = identNode.asKindOrThrow(SyntaxKind.Identifier);

    for (const definition of ident.getDefinitions()) {
      const calledFunc = definition
        .getDeclarationNode()!
        .asKindOrThrow(SyntaxKind.FunctionDeclaration);

      if (isTraced(calledFunc)) {
        // Entrypoint is guaranteed to exist.
        const tracedCalls = entrypoints.get(entrypoint)!;

        tracedCalls.push({ name: calledFunc.getName()!, level });

        // Recurse until the function stops calling other functions.
        traceFunctions(entrypoints, entrypoint, calledFunc, level + 1);
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
