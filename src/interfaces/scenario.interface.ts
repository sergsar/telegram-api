export type IScenario = IScenarioNode;

export interface IScenarioNode {
  on?: string
  message?: string;
  variants?: IScenarioNode[];
  exit?: IScenarioNode;
}

export interface IScenarioFlatNode {
  on?: string;
  message?: string;
  index: number;
  parent: number;
  exitNode?: boolean;
  joints?: IScenarioFlatNodeJoint[];
}

export interface IScenarioFlatNodeJoint {
  on?: string;
  next: number;
}
