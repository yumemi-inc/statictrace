import { getCallableName } from "./helpers";
import type { CallableDeclaration } from "./types";

export class Environment {
  #enclosing: Environment | null;
  #name: string;
  #declaration: CallableDeclaration;

  constructor(
    callable: CallableDeclaration,
    parent: Environment | null = null
  ) {
    this.#enclosing = parent;
    this.#declaration = callable;
    this.#name = getCallableName(callable);
  }

  hasAncestor(name: string) {
    let parent = this.enclosing();
    while (parent != null) {
      if (parent.name() == name) return true;
      parent = parent.enclosing();
    }
    return false;
  }

  enclosing() {
    return this.#enclosing;
  }

  name() {
    return this.#name;
  }

  decl() {
    return this.#declaration;
  }

  level() {
    let lvl = 0;
    let parent = this.enclosing();
    while (parent != null) {
      parent = parent.enclosing();
      lvl += 1;
    }
    return lvl;
  }
}
