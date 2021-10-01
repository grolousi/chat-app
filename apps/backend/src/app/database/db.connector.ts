import { Db, MongoClient } from 'mongodb';
import { errorLogger, infoLogger } from '../../logger';

interface DbConnectionReturnType {
  getDb: (dal?: string) => Promise<Db>;
}

export const dbConnector = ((): DbConnectionReturnType => {
  let client: MongoClient;

  const urlDb = `${process.env.DB_URL}:${process.env.DB_PORT}`;
  const dbName = 'chat_app_test';
  const connectDB = async (): Promise<MongoClient> => {
    try {
      const client = await MongoClient.connect(urlDb);
      return client;
    } catch (error) {
      errorLogger(error);
      return error;
    }
  };
  const getDb = async (dal = ''): Promise<Db> => {
    if (client) {
      infoLogger(`Db connection is already alive ${dal ? dal : ''}`);
      return client.db(dbName);
    } else {
      infoLogger(`Getting new db connection ${dal ? dal : ''}`);
      client = await connectDB();
      return client.db(dbName);
    }
  };

  return {
    getDb,
  };
})();
