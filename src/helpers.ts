import { ConstructorDeclaration, SyntaxKind } from "ts-morph";

export function constructorClassName(cons: ConstructorDeclaration) {
  return cons.getParentIfKindOrThrow(SyntaxKind.ClassDeclaration).getName();
}
