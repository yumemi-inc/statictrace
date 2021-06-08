/** @trace */
function continuteRegistration() {
  calledDuringRegistration();
}

/**
 * @entrypoint Registration
 */
function startRegistration() {
  const db = new Database();

  continuteRegistration();
  finishRegistration();

  db.saveUser({});

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

interface DB {
  save(thing: any): void;
}

class Database {
  db: DB = {
    /** @trace */
    save() {},
  };

  /** @trace */
  saveUser(user: any) {
    this.db.save(user);
  }
}
