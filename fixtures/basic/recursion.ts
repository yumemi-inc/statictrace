/**
 * @entrypoint InfiniteSelfRecursion
 * @trace
 */
function infiniteSelfRecursion() {
  infiniteSelfRecursion();
}

/**
 * @entrypoint IndirectInfiniteSelfRecursion
 * @trace
 */
function indirectInfiniteSelfRecursion() {
  makeIndirectRecursiveCall();
}

/**
 * @trace
 */
function makeIndirectRecursiveCall() {
  indirectInfiniteSelfRecursion();
}
