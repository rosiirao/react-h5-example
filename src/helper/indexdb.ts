function testIndexdb() {
  const dbRequest = window.indexedDB.open('test', 1);
  dbRequest.onerror = () => {
    console.error(dbRequest.error);
  };
  dbRequest.onsuccess = () => {
    const db = dbRequest.result;
    const trans1 = db.transaction('foo', 'readwrite');
    const trans2 = db.transaction('foo', 'readwrite');
    const objectStore2 = trans2.objectStore('foo');
    const objectStore1 = trans1.objectStore('foo');
    objectStore2.put('2', 'key');
    objectStore1.put('1', 'key');
  };
  // When you create a new database or increase the version number of an existing database
  // the onupgradeneeded event will be triggered
  // and an IDBVersionChangeEvent object will be passed to
  // any onversionchange event handler set up on request.result (i.e., db in the example).
  dbRequest.onupgradeneeded = () => {
    // Save the IDBDatabase interface
    const db = dbRequest.result;

    // Create an objectStore for this database
    const objectStore = db.createObjectStore('customers', {
      keyPath: 'myKey',
      autoIncrement: true,
    });
    objectStore.put('id', 1);

    // Create an index to search customers by name. We may have duplicates
    // so we can't use a unique index.
    objectStore.createIndex('name', 'name', {unique: false});

    // Create an index to search customers by email. We want to ensure that
    // no two customers have the same email, so use a unique index.
    objectStore.createIndex('email', 'email', {unique: true});

    objectStore.transaction.oncomplete = () => {
      // Store values in the newly created objectStore.
      const customerObjectStore = db
        .transaction('customers', 'readwrite')
        .objectStore('customers');
      [{name: 'foo'}, {name: 'bar'}].forEach(customer => {
        customerObjectStore.add(customer);
      });
    };
  };

  dbRequest.onblocked = () => {
    // When update db version, if some other tab is loaded with the database, then it needs to be closed
    // before we can proceed.
    console.log('Please close all other tabs with this site open!');
  };

  dbRequest.onsuccess = () => {
    const db = dbRequest.result;
    db.onversionchange = () => {
      // Make sure to add a handler to be notified if another page requests a version
      // change. We must close the database. This allows the other page to upgrade the database.
      // If you don't do this then the upgrade won't happen until the user closes the tab.
      db.close();
      console.log(
        'A new version of this page is ready. Please reload or close this tab!'
      );
    };
  };
}

export default testIndexdb;
