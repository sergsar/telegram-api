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
  if (!node.variants) {
    return [flat];
  }
  flat.joints = [];
  const nested = node.variants.reduce((acc: IScenarioFlatNode[], curr) => {
    const nextIndex = acc.length + index;
    flat.joints?.push({
      on: curr.on,
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
    node.joints?.forEach((joint) => {
      if (!joint.next) {
        joint.next = findNodeNearestExitIndex(node, nested);
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
    on: node.on,
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
