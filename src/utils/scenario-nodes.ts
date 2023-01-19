import {
  IScenarioFlatNode,
  IScenarioNode,
} from '../interfaces/scenario.interface';

export const traverse = (
  node?: IScenarioNode,
  index = 0,
  parent = -1,
): IScenarioFlatNode[] => {
  if (!node) {
    return [];
  }
  const flat = convertToFlatNode(node, index, parent);
  index++;
  if (!node.buttons) {
    return [flat];
  }
  flat.buttons = [];
  const nested = node.buttons.reduce((acc: IScenarioFlatNode[], curr) => {
    const nextIndex = acc.length + index;
    flat.buttons?.push({
      title: curr.title,
      next: curr.next ? nextIndex : 0,
    });
    return [...acc, ...traverse(curr.next, nextIndex, flat.index)];
  }, []);
  if (node.exit) {
    nested.push(
      convertToFlatNode(node.exit, index + nested.length, parent, true),
    );
  }
  nested.forEach((node) => {
    node.buttons?.forEach((button) => {
      if (!button.next) {
        button.next = findNodeNearestExitIndex(node, nested);
      }
    });
  });
  return [flat, ...nested];
};

const convertToFlatNode = (
  node: IScenarioNode,
  index: number,
  parent: number,
  exit?: boolean,
): IScenarioFlatNode => {
  return {
    text: node.text,
    index,
    parent,
    exitNode: exit,
  };
};

const findNodeNearestExitIndex = (
  node: IScenarioFlatNode,
  nodes: IScenarioFlatNode[],
): number => {
  return (
    nodes
      .filter((item) => !!item.exitNode)
      .find((item) => item.parent <= node.parent)?.index || 0
  );
};
