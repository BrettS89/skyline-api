import mongoose from 'mongoose';
import { Application } from './declarations';
import logger from './logger';

export default function (app: Application): void {
  console.log(app.get('mongodb'));
  mongoose.connect(
    app.get('mongodb'),
    { useCreateIndex: true, useNewUrlParser: true }
  ).catch(err => {
    logger.error(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
}
