<script lang="ts" setup>
import { ref, inject } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { NODE_DATA } from './injectKeys'
import useAuthList from './useAuthList'
import useApp from './useApp'
import useEnvs from './useEnvs'
import useBranches from './useBranches'

const labelCol = { span: 8 }
const wrapperCol = { span: 16 }
const defaultData = {
  projectType: 'frontendNormal',
  authInfo: '',
  projectName: '',
  branch: '',
  env: '',
  isSonar: false,
  deployment: 'ali'
}
const nodeData = inject(NODE_DATA)
const formRef = ref()
const authList = useAuthList()
const formState = toRef({
  ...defaultData,
  ...nodeData.value
})
const rules: Record<string, Rule> = {
  projectType: {
    type: 'string',
    required: true
  },
  authInfo: {
    required: true
  },
  projectName: {
    type: 'string',
    required: true
  },
  env: {
    type: 'string',
    required: true
  },
  branch: {
    type: 'string',
    required: true
  },
  isSonar: {
    type: 'boolean',
    required: false
  }
}
const emit = defineEmits(['ok', 'cancel'])
const envs = useEnvs(formState)
const [app, apps] = useApp(formState, {
  pageSize: 20,
  pageNumber: 1,
  total: 20
})

const branchInfo = useBranches(formState, app)

const onSubmit = async () => {
  const value = await formRef?.value?.validate()
  const user = JSON.parse(value.authInfo)
  const { publishUserId, publishUserName } = user
  const { env, projectName, branch, isSonar, projectType } = value
  const currentEnv = envs?.value?.find((item: any) => item?.type === env)
  const buildParams = {
    env: currentEnv.env,
    deployment: currentEnv.deployment,
    projectName,
    projectType,
    branch,
    isSonar,
    projectId: app.value.id,
    publishUserId,
    publishUserName
  }
  await emit('ok', {
    ...value,
    buildParams
  })
}

const resetForm = async () => {
  await emit('cancel')
}
</script>

<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item label="授权" name="authInfo">
      <a-select v-model:value="formState.authInfo" placeholder="请选择授权">
        <a-select-option v-for="item in authList" :value="item.authInfo">{{
          item.name
        }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="前端/后端应用" name="projectType">
      <a-select v-model:value="formState.projectType" placeholder="请选择应用类型">
        <a-select-option value="frontendNormal">前端</a-select-option>
        <a-select-option value="normal">后端</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="应用" name="projectName">
      <a-select v-model:value="formState.projectName" placeholder="请选择应用">
        <a-select-option v-for="item in apps" :value="item.projectName">
          {{ item.projectName }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="环境" name="env">
      <a-select mode="SECRET_COMBOBOX_MODE_DO_NOT_USE" v-model:value="formState.env"
        placeholder="please select your zone">
        <a-select-option v-for="item in envs" :key="item.type" :value="item.type">{{ item.desc }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="分支" name="branch">
      <a-select :default-value="branchInfo?.defaultBranch" mode="SECRET_COMBOBOX_MODE_DO_NOT_USE"
        v-model:value="formState.branch" placeholder="please select your zone">
        <a-select-option v-for="val in branchInfo?.branches" :value="val">
          {{ val }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="isSonar" name="isSonar">
      <a-switch v-model:checked="formState.isSonar" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">确定</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">取消</a-button>
    </a-form-item>
  </a-form>
</template>
