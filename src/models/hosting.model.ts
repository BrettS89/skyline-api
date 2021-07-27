// aws/hosting-model.ts - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
import { Application } from '../declarations';
import { Model, Mongoose } from 'mongoose';

export default function (app: Application): Model<any> {
  const modelName = 'aws/hosting';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    app_id: {
      type: Schema.Types.ObjectId,
      ref: 'aws/hosting',
      required: true,
    },
    aws_region: {
      type: String,
      required: true,
    },
    cloudfront_url: {
      type: String,
    },
    environment_id: {
      type: String,
      required: true,
    },
    app_type: {
      type: String,
      required: true,
    },
    app_type_name: {
      type: String,
      required: true,
    },
    autoscale: {
      type: Boolean,
      requried: true,
    },
    bucket_name: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    ssl_certificate_arn: {
      type: String,
    },
    domain_name: {
      type: String,
    },
    provider_type: {
      type: String,
      required: true,
    },
    provider_environment: {
      type: String,
    },
    url: {
      type: String,
    },
    provider_arn: {
      type: String,
    },
    pipeline_name: {
      type: String,
      required: true,
    },
    github_repo: {
      type: String,
      required: true,
    },
    repo_branch: {
      type: String,
      required: true,
    },
    auto_deploy: {
      type: Boolean,
      default: false,
    },
    webhook_name: {
      type: String,
    }
  }, {
    timestamps: true,
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<any>(modelName, schema);
}
