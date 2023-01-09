import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { Env } from '../classes/env';
import { IFileStorage } from '../interfaces/file-storage.interface';

export class AwsCellarService implements IFileStorage {
  api: S3;

  constructor() {
    AWS.config.update({
      accessKeyId: Env.process('CELLAR_KEY_ID'),
      secretAccessKey: Env.process('CELLAR_KEY_SECRET'),
    });

    this.api = new S3({ endpoint: Env.process('CELLAR_HOST') });
  }

  getJsonFile(name: string) {
    return this.api
      .getObject({
        Bucket: Env.process('CELLAR_BUCKET_NAME'),
        Key: name,
        ResponseContentType: 'application/json',
      })
      .promise()
      .then((data) => {
        if (!data.Body) {
          throw new Error(`Failed to load json data from file ${name}`);
        }
        return data.Body.toString();
      });
  }
}
