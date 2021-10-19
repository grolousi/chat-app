import { Collection, Db, MongoClient } from 'mongodb';
import { errorLogger, infoLogger } from '../../logger';

export const TEST_DB = 'chat_app_test';

interface DbConnectionReturnType {
  getDb: (dal?: string) => Promise<Db>;
  getClient: () => Promise<MongoClient>;
  getCollection: <T>(collection: string) => Promise<Collection<T>>;
}
export const dbConnector = ((): DbConnectionReturnType => {
  let client: MongoClient = undefined;

  const urlDb = `${process.env.DB_URL}:${process.env.DB_PORT}`;
  const dbName = process.env.NODE_ENV === 'test' ? TEST_DB : 'chat_app_dev';

  const connectDB = async (): Promise<MongoClient> => {
    try {
      if (client === undefined) {
        return await MongoClient.connect(urlDb);
      } else {
        return client;
      }
    } catch (error) {
      errorLogger(error);
      return error;
    }
  };
  const getDb = async (dal = '') => {
    if (client) {
      infoLogger(`Db connection is already alive ${dal ? dal : ''}`);
      return client.db(dbName);
    } else {
      infoLogger(`Getting new db connection ${dal ? dal : ''}`);
      client = await connectDB();

      return client.db(dbName);
    }
  };

  const getCollection = async <T>(collection) => {
    return (await getDb(collection)).collection<T>(collection);
  };

  const getClient = async () => {
    if (client) {
      return client;
    } else {
      return await connectDB();
    }
  };

  return {
    getDb,
    getClient,
    getCollection,
  };
})();
