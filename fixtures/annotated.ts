/** @trace */
function continuteRegistration() {
  calledDuringRegistration();
}

/**
 * @entrypoint Registration
 */
function startRegistration() {
  continuteRegistration();
  finishRegistration();
  untracedFunction();
  cleanupSomething();
}

/** @trace */
function cleanupSomething() {}

/** @trace */
function finishRegistration() {
  tracedDeepCall();
}

/** @trace */
function calledDuringRegistration() {
  anotherTracedDeepCall();
  untracedDeepCall();
}

/** @trace */
function tracedDeepCall() {}

function untracedDeepCall() {}

/** @trace */
function anotherTracedDeepCall() {}

function startPurchase() {}

function continuePurchase() {}

function finishPurchase() {}

function untracedFunction() {}
