import {createRxDatabase, RxDatabase, addRxPlugin} from 'rxdb';
import {NodeCollection, nodeCollectionSchema} from './schema';
import {createContext, useContext} from 'react';
addRxPlugin(require('pouchdb-adapter-asyncstorage').default);
// addRxPlugin(require('pouchdb-adapter-memory'));

type kipuDatabaseCollections = {
  nodes: NodeCollection;
};

export type KipuDatabase = RxDatabase<kipuDatabaseCollections>;

export async function createDatabase(username: string) {
  // removeRxDatabase(`${username}_db2`, `asyncstorage`)
  let db: KipuDatabase = await createRxDatabase<kipuDatabaseCollections>({
    name: `${username}_db2`,
    adapter: 'asyncstorage',
    multiInstance: false,
  });

  await db.collection(nodeCollectionSchema);

  return db;
}

let DbContext = createContext<KipuDatabase>(null as any);
export let DbProvider = DbContext.Provider;
export let useDb = () => useContext(DbContext);
