/**
 * @entrypoint Registration
 */
function startRegistration() {
  processRegistration();
  finishRegistration();
  untracedFunction();
  cleanupSomething();
}

/** @trace */
function processRegistration() {
  someRegistrationProcedure();
}

/** @trace */
function cleanupSomething() {}

/** @trace */
function finishRegistration() {
  callInsideTracedFn();
}

/** @trace */
function someRegistrationProcedure() {
  callInsideTracedFn();
  untracedFunction();
}

/** @trace */
function callInsideTracedFn() {}

function untracedFunction() {}
