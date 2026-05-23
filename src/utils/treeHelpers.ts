import { FileNode } from '@/types';

export function findNode(nodes: FileNode[], id: string): FileNode | null {

  for (const node of nodes) {
    if (node.id === id) return node;

    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}


export function getChildren(nodes: FileNode[], folderId: string | null): FileNode[] {

  if (!folderId) return nodes;

  const folder = findNode(nodes, folderId);

  return folder?.children ?? [];
}


export function addNode(
  nodes: FileNode[],
  parentId: string | null,
  newNode: FileNode
): FileNode[] {

  if (!parentId) {
    return [...nodes, newNode];
  }

  return nodes.map((node) => {

    if (node.id === parentId && node.type === 'folder') {
      return {
        ...node,
        children: [
          ...(node.children ?? []),
          newNode,
        ],
      };
    }

    if (node.children) {
      return {
        ...node,
        children: addNode(node.children, parentId, newNode),
      };
    }

    return node;
  });
}


export function renameNode(nodes: FileNode[], id: string, newName: string): FileNode[] {
  return nodes.map((node) => {

    if (node.id === id) {
      return { ...node, name: newName };
    }

    if (node.children) {
      return { ...node, children: renameNode(node.children, id, newName) };
    }

    return node;
  });
}


export function updateFileContent(
  nodes: FileNode[],
  id: string,
  newContent: string
): FileNode[] {
  return nodes.map((node) => {

    if (node.id === id && node.type === 'file') {

      return { ...node, content: newContent };
    }

    if (node.children) {
      return { ...node, children: updateFileContent(node.children, id, newContent) };
    }

    return node;
  });
}


export function deleteNode(nodes: FileNode[], id: string): FileNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: deleteNode(node.children, id),
        };
      }
      return node;
    });
}
