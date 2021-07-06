// aws/environment-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'aws/environment';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    environment: {
      type: String,
      required: true,
    },
    hosting_id: {
      type: Schema.Types.ObjectId,
      ref: 'aws/hosting',
    },
    kubernetes_id: {
      type: Schema.Types.ObjectId,
      ref: 'aws/kubernetes',
    },
    bucket_id: {
      type: Schema.Types.ObjectId,
      ref: 'aws/bucket',
    },
    cloudfront_id: {
      type: Schema.Types.ObjectId,
      ref: 'aws/cloudfront',
    },
    iam_user_id: {
      type: Schema.Types.ObjectId,
      ref: 'aws/iam-user',
    },
    policy_id: {
      type: Schema.Types.ObjectId,
      ref: 'aws/policy',
    },
    access_keys_id: {
      type: Schema.Types.ObjectId,
      ref: 'aws/access-keys',
    },
    env_vars: [{
      type: String,
      default: [],
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
