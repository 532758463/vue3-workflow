import openApi from './axios';

interface QueryParams {
  sortBy?: string;
  sortOrder: 'ASC' | 'DESC';
  page: number;
  limit: 20;
}


export async function getPipelineList(params: QueryParams) {
  return await openApi.post('/pipeline/list', params);
}

/**
 * 创建流水线
 */
export async function createPipeline(params: any) {
  return await openApi.post('/pipeline', params);
}

/**
 * 删除授权信息
 */
export async function deletePipeline(id: string) {
  return await openApi.delete(`/pipeline/${id}`);
}
/**
 * 获取授权信息
 */
export async function getPipeline(id: string) {
  return await openApi.get(`/pipeline/${id}`);
}

/**
 * 更新授权信息
 */
export async function updatePipeline(id: string, formData:any){
  return await openApi.patch(`/pipeline/${id}`, formData);
}
