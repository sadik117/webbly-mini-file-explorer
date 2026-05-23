
export type NodeType = 'folder' | 'file';

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  children?: FileNode[];
  content?: string;
}
