import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';

export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9000/api',
  timeout: 3000
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
});

interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    let { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve
        });
      });
    }

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
      refreshing = true;

      const res = await refreshToken();

      refreshing = false;
      if (res.code === 200) {
        localStorage.setItem('access_token', res.data.access_token || '');
        localStorage.setItem('refresh_token', res.data.refresh_token || '');
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        message.error(data.message);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);
async function refreshToken() {
  const res:Response<{
    access_token:string;
    refresh_token: string;
  }> = await axiosInstance.get('/user/refresh', {
    params: {
      refreshToken: localStorage.getItem('refresh_token')
    }
  });
  return res;
}

export default axiosInstance;
