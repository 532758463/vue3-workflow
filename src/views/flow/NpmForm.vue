<script lang="ts" setup>
import { ref, inject } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { NODE_DATA } from './injectKeys';
import useAuthList from './useAuthList';
import useApp from './useApp';

const labelCol = { span: 8 };
const wrapperCol = { span: 16 };
interface FormState {
  packageName: string;
  tag: string;
  hotfix: boolean;
  buildBranch: string;
  cloud: string;
  authInfo: string
}

const defaultData = {
  authInfo: '',
  packageName: '',
  tag: '',
  hotfix: false,
  buildBranch: 'undefined',
  cloud: 'ali',
}
const nodeData = inject(NODE_DATA);
const formRef = ref();
const formState = ref<Ref<FormState>>({
  ...defaultData,
  ...nodeData.value,
});

const authList = useAuthList();

const rules: Record<string, Rule> = {
  authInfo: {
    required: true,
    message: '请选择授权'
  },
  packageName: {
    type: "string",
    required: true,
    message: '请输入包名'
  },
  tag: {
    type: "string",
    required: true,
  },
  hotfix: {
    type: "boolean",
    required: false,
  },
  buildBranch: {
    type: "string",
    required: false,
  },
  cloud: {
    type: "string",
    required: true,
  },
};
const emit = defineEmits(['ok', 'cancel']);

const [npmInfo] = useApp(formState, {
  projectName: "npmbuild",
  pageSize: 20,
  pageNumber: 1,
  total: 9,
  projectType: "custom",
  deployment: "ali"
});

const shellInfo = computed(() => npmInfo?.value?.shellInfo ? JSON.parse(npmInfo?.value?.shellInfo) : undefined)

const getAttrValue = (name: string) => {
  return shellInfo?.value?.find((v: any) => v.name === name).value
}
const tags = computed(() => {
  const tagInfo = getAttrValue('tag');
  return tagInfo?.split('^') || [];
})

const onSubmit = async () => {
  const value = await formRef?.value?.validate();
  const npm = npmInfo.value;
  const { packageName, tag, cloud = 'ali', buildBranch: bBranch = 'undefined' } = value;
  const buildBranch = bBranch || 'undefined';
  const { publishUserName, publishUserId } = JSON.parse(value.authInfo);
  const branch = getAttrValue('branch');
  const buildScript = getAttrValue('buildScript');
  const shell = getAttrValue('shellInfo') || '' as string;
  const scripts = shell.replaceAll('${packageName}', packageName)
    .replaceAll('${tag}', tag)
    .replaceAll('${_userName}', publishUserName)
    .replaceAll('${cloud}', cloud)
    .replaceAll('${buildScript}', buildScript)
    .replaceAll('${buildBranch}', buildBranch);
  const buildParams = {
    deployment: cloud,
    env: "dev",
    projectType: npm.projectType,
    projectId: npm.id,
    publishUserId,
    publishUserName,
    packageName,
    shellInfo: scripts,
    tag,
    cloud,
    branch,
    buildScript,
    custom: 'npm',
    buildBranch,
    targetBranch: "master"
  }
  await emit('ok', { ...value, buildParams });
}

const resetForm = async () => {
  await emit('cancel');
}

</script>

<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="授权" name="authInfo">
      <a-select v-model:value="formState.authInfo" placeholder="请选择授权">
        <a-select-option v-for="item in authList" :value="item.authInfo">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="hotfix" name="hotfix">
      <a-switch v-model:checked="formState.hotfix" />
    </a-form-item>
    <a-form-item ref="packageName" label="包名" name="packageName">
      <a-input v-model:value="formState.packageName" />
    </a-form-item>
    <a-form-item label="tag" name="tag">
      <a-select v-model:value="formState.tag" placeholder="please select your zone">
        <a-select-option v-for="tag in tags" :value="tag">{{ tag }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="buildBranch" name="buildBranch">
      <a-input placeholder="undefined" default-value="undefined" v-model:value="formState.buildBranch" />
    </a-form-item>
    <a-form-item label="cloud" name="cloud">
      <a-select v-model:value="formState.cloud" placeholder="please select your zone">
        <a-select-option value="ali">阿里云</a-select-option>
        <a-select-option value="huawei">华为云</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 16 }">
      <a-button type="primary" @click="onSubmit">确定</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">取消</a-button>
    </a-form-item>
  </a-form>
</template>


