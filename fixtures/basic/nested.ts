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

/** 
 * @entrypoint AnotherNestedEntrypoint
 * @trace */
function funcA() {
  funcC()
}

/** @trace */
function funcB() {}

/** @trace */
function funcC() {}
