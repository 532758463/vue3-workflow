import { onMounted, ref } from 'vue';
import { getAuthList, type AuthInfo } from '@/service/auth';

export const useAuthList = () => {
  const authList = ref<AuthInfo[]>([]);

  const fetchData = async () => {
    const res = await getAuthList({ page: 1, limit: 20, sortOrder: 'DESC' });
    authList.value = res.data;
  };
  // 初始化请求授权用户
  onMounted(() => {
    fetchData();
  });
  return authList;
};

export default useAuthList;
