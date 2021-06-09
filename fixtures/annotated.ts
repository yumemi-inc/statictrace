/** @trace */
function continuteRegistration() {
  someRegistrationProcedure();
}

/**
 * @entrypoint Registration
 */
function startRegistration() {
  const db = new Database();

  continuteRegistration();
  finishRegistration();

  db.saveUser({ user: "Test" });

  untracedFunction();
  cleanupSomething();
}

/** @trace */
function cleanupSomething() {}

/** @trace */
function finishRegistration() {
  calledInsideTracedFn();
}

/**
 * @entrypoint EmbeddedInRegistration
 * @trace */
function someRegistrationProcedure() {
  calledInsideTracedFn();
  untracedFunction();
}

/** @trace */
function calledInsideTracedFn() {}

function untracedFunction() {}

class DbInterface {
  /** @trace */
  post(user: any) {}
}

class Database {
  db: DbInterface;

  /** @entrypoint Database */
  constructor() {
    this.db = new DbInterface();
  }

  /** @trace */
  saveUser(user: any) {
    this.db.post(user);
  }
}

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
