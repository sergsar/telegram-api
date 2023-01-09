export interface IFileStorage {
  getJsonFile(name: string): Promise<string>;
}
