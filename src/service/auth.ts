import openApi, { type Response} from './axios';

interface QueryParams {
  sortBy?: string;
  sortOrder: 'ASC' | 'DESC';
  page: number;
  limit: 20;
}

export interface AuthInfo {
  name: string;
  authInfo: string;
  description: string;
}

export async function getAuthList(params: QueryParams):Promise<Response<AuthInfo[]>> {
  return await openApi.post('/flow/auth/list', params);
}

/**
 * 创建授权信息
 */
export async function createAuth(params: any) {
  return await openApi.post('flow/auth', params);
}

/**
 * 删除授权信息
 */
export async function deleteAuth(id: string) {
  return await openApi.delete(`flow/auth/${id}`);
}
/**
 * 获取授权信息
 */
export async function getAuth(id: string) {
  return await openApi.get(`flow/auth/${id}`);
}

/**
 * 更新授权信息
 */
export async function updateAuth(id: string, formData:any){
  return await openApi.patch(`flow/auth/${id}`, formData);
}
