// aws/app-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'aws/app';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    account_id: {
      type: Schema.Types.ObjectId,
      ref: 'security/account',
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'security/user',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    environment_ids: [{
      type: Schema.Types.ObjectId,
      ref: 'aws/environment',
    }],
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
