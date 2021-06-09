import { ConstructorDeclaration, Identifier, SyntaxKind } from "ts-morph";

export function constructorClassName(cons: ConstructorDeclaration) {
  return cons.getParentIfKindOrThrow(SyntaxKind.ClassDeclaration).getName();
}

export function getDefinitionNodeOrThrow(ident: Identifier) {
  const definition = ident.getDefinitionNodes()[0];
  const callee =
    definition.asKind(SyntaxKind.FunctionDeclaration) ||
    definition.asKind(SyntaxKind.MethodDeclaration);

  if (!callee) throw new Error(`No definition found for ${ident.getText()}`);

  return callee;
}
