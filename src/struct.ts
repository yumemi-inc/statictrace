import { getCallableName } from "./helpers";
import type { CallableDeclaration } from "./types";

export class Environment {
  _enclosing: Environment | null;
  _name: string;
  _declaration: CallableDeclaration;

  constructor(
    callable: CallableDeclaration,
    parent: Environment | null = null
  ) {
    this._enclosing = parent;
    this._declaration = callable;
    this._name = getCallableName(callable);
  }

  asRoot() {
    return new Environment(this.decl());
  }

  enclosing() {
    return this._enclosing;
  }

  name() {
    return this._name;
  }

  decl() {
    return this._declaration;
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
