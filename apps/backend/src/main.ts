import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';
import { infoLogger } from './logger';
import { authRouter } from './app/auth/auth.routes';

const main = async (): Promise<void> => {
  const app: express.Application = express();

  app.use(
    cors({
      credentials: true,
      allowedHeaders: ['Content-type', 'Authorization'],
      exposedHeaders: ['Authorization'],
    })
  );

  app.use(helmet());

  app.use((req: express.Request, _, done: express.NextFunction) => {
    infoLogger(`${req.method.toUpperCase()}: ${req.originalUrl}`);
    done();
  });

  app.use(express.json());

  app.use('/auth', await authRouter());
  app.use('/', (req, res) => res.send('Helloworld'));

  const port = process.env.BACK_PORT || 3100;
  app.listen(port, () => {
    infoLogger(`App listening on port ${port}!`);
  });
};

main();
