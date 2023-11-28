import openApi from './axios';

export interface QueryParams {
  projectName?: string;
  pageSize?: number;
  pageNumber?: number;
  total?: number;
  userId?: number;
  // 前端: frontendNormal ，后端：normal，npm: custom
  projectType?: 'frontendNormal' | 'normal' | 'custom';
  deployment?: 'ali' | 'huawei';
}

export interface QueryBranchesParams {
  projectId: number;
  env: string;
  deployment?: string;
}

interface QueryBuildState extends QueryBranchesParams {
  queryId: string;
}

// 获取构建应用信息
export async function getAppOrNpmInfo(params: QueryParams) {
  return await openApi.post('/flow/frontApps', params);
}

// 获取当前应用的环境信息
export async function getEnvs(envParams: QueryParams) {
  return await openApi.post('/flow/getEnvs', envParams);
}

// 获取当前应用的构建分支
export async function getBranches(params: QueryBranchesParams) {
  return await openApi.post('/flow/getBranches', params);
}

// 获取构建状态
export async function getBuildState(params: QueryBuildState) {
  return await openApi.post('/flow/getBuildState', params);
}

// 构建
export async function sendTask(params: any) {
  return await openApi.post('/flow/sendTask', params);
}
// 保存流程图信息
export async function save(params: any) {
  return await openApi.post('/flow/save', params);
}

// 查询流程图信息
export async function queryProcess(id: string) {
  return await openApi.get(`/flow/${id}`);
}

