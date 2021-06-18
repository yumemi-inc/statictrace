class DbInterface {
  /** @trace */
  post(user: any) {}

  /** @trace */
  get() {}
}

class Database {
  db: DbInterface;
  info: any;

  /** @entrypoint Database */
  constructor() {
    this.db = new DbInterface();
    this.info = this.db.get();
    this.saveUser({ name: 'Cat' });
  }

  /** @trace */
  saveUser(user: any) {
    this.db.post(user);
  }
}
