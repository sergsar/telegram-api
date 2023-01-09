export interface IScenario extends IScenarioNode {
  last?: IScenarioNode;
}

export interface IScenarioNode {
  button?: string;
  text?: string;
  nodes?: IScenarioNode[];
}
