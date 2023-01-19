export type IScenario = IScenarioNode;

export interface IScenarioNode {
  text?: string;
  buttons?: IScenarioButton[];
  exit?: IScenarioNode;
}

export interface IScenarioButton {
  title?: string;
  next?: IScenarioNode;
}

export interface IScenarioFlatNode {
  text?: string;
  buttons?: IScenarioFlatButton[];
  index: number;
  parent: number;
  exitNode?: boolean;
}

export interface IScenarioFlatButton {
  title?: string;
  next: number;
}
