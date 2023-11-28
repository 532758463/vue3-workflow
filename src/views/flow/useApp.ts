import { watch, ref } from 'vue';
import { getAppOrNpmInfo, type QueryParams } from '@/service/flow';

const useApp = (formState: Ref<any>, params: QueryParams) => {
  const app = ref();
  const apps =ref();
  // 初始化或者值发生变化时请求
  watch(
    formState,
    async value => {
      const authInfo = value?.authInfo;
      const isHotfix = value?.hotfix;
      if (authInfo) {
        const user = JSON.parse(authInfo);
        const userId = user.publishUserId;
        if (userId) {
          const args = {
            ...params,
            ...value,
            userId
          }
          const newParams = {
            ...args,
            projectName: ''
          }
          const res = await getAppOrNpmInfo(newParams);
          apps.value = res.data.records;
          const info = res.data.records.find((v: any) => {
            if (isHotfix) {
              return v.projectName?.toLocaleLowerCase() === 'npmbuild-hotfix';
            }
            return v.projectName?.toLocaleLowerCase() === args.projectName?.toLocaleLowerCase();
          });
          app.value = info;
        }
      }
    },
    { deep: true, immediate: true },
  );
  return [app, apps];
};

export default useApp;