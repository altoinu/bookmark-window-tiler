export interface VirtualDisplay {
  height: number;
  id: string;
  name: string;
  offsetX: number;
  offsetY: number;
  width: number;
}

export interface WindowLayout {
  displayId?: string;
  enabled: boolean;
  height: string | number;
  width: string | number;
  x: string | number;
  y: string | number;
}

export interface WorkspaceProfile {
  bookmarkFolderId: string;
  id: string;
  name: string;
  urlConfigs: {
    [url: string]: WindowLayout;
  };
  workspaceBounds?: {
    height: number;
    width: number;
  };
}
