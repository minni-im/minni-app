function isLocalStorageActive() {
  const value = "value";
  try {
    localStorage.setItem(value, value);
    localStorage.removeItem(value);
    return true;
  } catch(e) {
    return false;
  }
}

class LocalStorage {
  get(key) {
    let value = localStorage.getItem(key);
    try {
      value = JSON.parse(value);
    } catch(e) {} //eslint-disable-line no-empty
    return value;
  }

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}

class ObjectStorage {
  constructor() {
    this.storage = {};
  }

  get(key) {
    return this.storage[key];
  }

  set(key, value) {
    this.storage[key] = value;
  }

  remove(key) {
    delete this.storage[key];
  }

  clear() {
    this.storage = {};
  }
}

export default isLocalStorageActive() ? new LocalStorage() : new ObjectStorage();
