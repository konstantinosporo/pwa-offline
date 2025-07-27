export interface OfflineAction{
  id: number;
  action: HTTPAction;
  data?: any;
}

export enum HTTPAction {
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}