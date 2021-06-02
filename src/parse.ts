import { FunctionDeclaration, Project, SyntaxKind } from "ts-morph";
import path from "path";

type Entrypoint = string;
type TracedCall = { name: string; level: number };
type Entrypoints = Map<Entrypoint, Array<TracedCall>>;

const project = new Project({
  tsConfigFilePath: path.resolve(process.cwd(), "fixtures/tsconfig.json"),
});

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
      const { text } = entrypointTag.getText()[0];
      entrypoints.set(text, [{ name: func.getName()!, level: 0 }]);

      traceFunctions(entrypoints, text, func);
    }
  }
}

function isTraced(func: FunctionDeclaration) {
  const signature = func.getSignature();
  const annotations = signature.getJsDocTags();
  return annotations.some((tag) => tag.getName() == "trace");
}

function traceFunctions(
  entrypoints: Entrypoints,
  entrypoint: string,
  func: FunctionDeclaration,
  level: number = 0
) {
  for (const call of func.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const identNode = call.getFirstDescendantOrThrow();
    const ident = identNode?.asKindOrThrow(SyntaxKind.Identifier);

    for (const def of ident.getDefinitions()) {
      const f = def
        .getDeclarationNode()!
        .asKindOrThrow(SyntaxKind.FunctionDeclaration);

      if (isTraced(f)) {
        const fns = entrypoints.get(entrypoint)!;
        fns?.push({ name: f.getName()!, level });
      }

      traceFunctions(entrypoints, entrypoint, f, level + 1);
    }
  }
}

for (const [ep, tracedCalls] of entrypoints.entries()) {
  console.log("Entrypoint: ", ep, "\n");
  for (const call of tracedCalls) {
    console.log("\t".repeat(call.level), call.name);
  }
}
