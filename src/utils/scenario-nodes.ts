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
  if (!node.content) {
    return [flat];
  }
  flat.content = [];
  const nested = node.content.reduce((acc: IScenarioFlatNode[], curr) => {
    const nextIndex = acc.length + index;
    flat.content?.push({
      name: curr.name,
      next: curr.message ? nextIndex : 0,
    });
    return [...acc, ...traverse(curr, nextIndex, flat.index)];
  }, []);
  if (node.exit) {
    nested.push(
      convertToFlatNode(node.exit, index + nested.length, parent, true),
    );
  }
  nested.forEach((node) => {
    node.content?.forEach((item) => {
      if (!item.next) {
        item.next = findNodeNearestExitIndex(node, nested);
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
    name: node.name,
    message: node.message,
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
