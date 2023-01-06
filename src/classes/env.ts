import { ENVS } from '../consts/envs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Env {
  static process(key: keyof typeof ENVS): string {
    return process.env[key] || '';
  }
}
