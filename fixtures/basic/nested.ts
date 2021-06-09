/**
 * @entrypoint OuterEntrypoint
 */
function begin() {
  funcA();
  beingNestedEntrypoint();
  funcB();
}

/**
 * @entrypoint NestedEntrypoint
 * @trace */
function beingNestedEntrypoint() {
  funcA();
  funcB();
}

/** @trace */
function funcA() {}

/** @trace */
function funcB() {}
