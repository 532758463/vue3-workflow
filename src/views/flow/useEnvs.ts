import { watch, ref } from 'vue';
import { getEnvs } from '@/service/flow';

const useEnvs = (formState: Ref<any>) => {
  const envs = ref();
  // 初始化或者值发生变化时请求
  watch(
    formState,
    async value => {
      const authInfo = value?.authInfo;
      const projectName = value?.projectName;
      if (authInfo && projectName) {
        const user = JSON.parse(authInfo);
        const userId = user.publishUserId;
        if (userId) {
          const args = {
            pageSize: 20,
            pageNumber: 1,
            total: 9,
            ...value,
            userId
          }
          const res = await getEnvs(args);
          envs.value = res.data;
        }
      }
    },
    { deep: true, immediate: true },
  );
  return envs;
};

export default useEnvs;