import {
  ConstructorDeclaration,
  Identifier,
  JSDocTagInfo,
  SyntaxKind,
  Node,
  FunctionDeclaration,
  MethodDeclaration
} from 'ts-morph';
import { CallableDeclaration } from './types';

export function constructorClassName(cons: ConstructorDeclaration) {
  return cons.getParentIfKindOrThrow(SyntaxKind.ClassDeclaration).getName();
}

export function getDefinitionNode(
  ident: Identifier
): FunctionDeclaration | MethodDeclaration | null {
  for (const def of ident.getDefinitionNodes()) {
    const callee =
      def.asKind(SyntaxKind.FunctionDeclaration) ||
      def.asKind(SyntaxKind.MethodDeclaration);

    if (callee) {
      return callee;
    }
  }

  // No definition found: this could be a standard library function like .map() or .bind().
  return null;
}

export function getEntrypointTag(func: CallableDeclaration) {
  const signature = func.getSignature();
  const annotations = signature.getJsDocTags();
  return annotations.find((tag) => tag.getName() == 'entrypoint');
}

export function getEntrypointText(tag: JSDocTagInfo) {
  const { text } = tag.getText()[0];
  return text;
}

export function getCallableName(callable: CallableDeclaration) {
  // No traced functions are anonymous.
  return Node.isConstructorDeclaration(callable)
    ? `${constructorClassName(callable)} constructor`
    : callable.getName()!;
}

export function isTraced(func: FunctionDeclaration | MethodDeclaration) {
  const signature = func.getSignature();
  const annotations = signature.getJsDocTags();
  return annotations.find((tag) => tag.getName() == 'trace');
}
