export interface IFileStorage {
  getJsonFile(name: string): Promise<string>;
  getYamlFile(name: string): Promise<string>;
}
