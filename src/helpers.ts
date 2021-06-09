import {
  ConstructorDeclaration,
  Identifier,
  JSDocTagInfo,
  SyntaxKind,
} from "ts-morph";
import { CallableDeclaration } from "./types";

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

export function getEntrypointTag(func: CallableDeclaration) {
  const signature = func.getSignature();
  const annotations = signature.getJsDocTags();
  return annotations.find((tag) => tag.getName() == "entrypoint");
}

export function getEntrypointText(tag: JSDocTagInfo) {
  const { text } = tag.getText()[0];
  return text;
}
