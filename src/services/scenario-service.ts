import { Inject, Injectable } from '@nestjs/common';
import { IScenario } from '../interfaces/scenario.interface';
import { IFileStorage } from '../interfaces/file-storage.interface';
import { Env } from '../classes/env';
import { FILE_STORAGE_TOKEN } from '../consts/file-storage-token';
import * as YAML from 'yaml';

@Injectable()
export class ScenarioService {
  constructor(
    @Inject(FILE_STORAGE_TOKEN) private readonly fileStorage: IFileStorage,
  ) {}

  getScenario(): Promise<IScenario> {
    return this.fileStorage
      .getYamlFile(Env.process('SCENARIO_FILE_NAME'))
      .then((value) => {
        let object: IScenario = {};
        try {
          object = YAML.parse(value);
        } catch (err) {
          console.error(err);
        }
        return object;
      });
  }
}
