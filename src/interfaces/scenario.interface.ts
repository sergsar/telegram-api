export type IScenario = IScenarioNode;

export interface IScenarioNode {
  name?: string
  message?: string;
  content?: IScenarioNode[];
  exit?: IScenarioNode;
}

export interface IScenarioFlatNode {
  name?: string;
  message?: string;
  index: number;
  parent: number;
  exitNode?: boolean;
  content?: IScenarioFlatNodeContent[];
}

export interface IScenarioFlatNodeContent {
  name?: string;
  next: number;
}
