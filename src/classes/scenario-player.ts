import {
  IScenario,
  IScenarioFlatNode,
  IScenarioFlatNodeContent,
} from '../interfaces/scenario.interface';
import { traverse } from '../utils/scenario-nodes';

export class ScenarioPlayer {
  private readonly flatNodes: IScenarioFlatNode[];

  constructor(private readonly scenario: IScenario) {
    this.flatNodes = traverse(scenario);
  }

  getMessage(index: number): string {
    const node = this.flatNodes[index];
    if (!node) {
      const message = `the node with index ${index} doesn't exist`;
      console.error(message);
      throw new Error(message);
    }
    return (
      node.message || 'Please keep in mind the telegram API expects text here'
    );
  }

  getFlatNodeContent(index: number): IScenarioFlatNodeContent[] | undefined {
    const node = this.flatNodes[index];
    if (!node) {
      const message = `the node with index ${index} doesn't exist`;
      console.error(message);
      throw new Error(message);
    }
    return node.content;
  }
}
