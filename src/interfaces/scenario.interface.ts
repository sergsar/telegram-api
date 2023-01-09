export interface IScenario extends IScenarioNode {
  exit?: IScenarioNode;
}

export interface IScenarioNode {
  text?: string;
  buttons?: IScenarioButton[];
}

export interface IScenarioButton {
  title: string;
  next: IScenarioNode;
}
