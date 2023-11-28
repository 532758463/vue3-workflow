import { ref } from 'vue';
import { getBranches } from '@/service/flow';

const useBranches = (formState: Ref<any>, app: any) => {
  const branchInfo = ref();

  // 初始化或者值发生变化时请求
  watch(
    [formState, app],
    async(value) => {
      const env = value[0].env;
      const deployment = value[0].deployment;
      const projectId = value[1]?.id;
      if (env && projectId) {
        const res = await getBranches({
          projectId,
          env,
          deployment,
        });
        branchInfo.value = res.data;
      }
    },
    { deep: true, immediate: true },
  );
  return branchInfo;
};

export default useBranches;
