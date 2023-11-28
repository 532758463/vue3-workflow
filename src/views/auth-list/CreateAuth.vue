<template>
  <div>
    <a-button type="primary" @click="showModal">新建</a-button>
    <a-modal v-model:open="open" title="新建授权" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form ref="formRef" :rules="rules" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item name="name" label="授权用户名">
          <a-input v-model:value="formData.name" />
        </a-form-item>
        <a-form-item name="authInfo" label="授权信息">
          <a-textarea :rows="4" v-model:value="formData.authInfo" />
        </a-form-item>
        <a-form-item name="description" label="描述">
          <a-textarea :rows="4" v-model:value="formData.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineEmits, reactive } from 'vue';
import type { UnwrapRef } from 'vue';
import { createAuth } from '@/service/auth';

interface FormData {
  name: string;
  authInfo: string;
  description: string;
}
const modalText = ref<string>('Content of the modal');
const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const formRef = ref();

const formData: UnwrapRef<FormData> = reactive({
  name: '',
  authInfo: '',
  description: ''
});
const rules = {
  name: {
    required: true,
    message: '用户名必填'
  },
  authInfo: {
    required: true,
    message: '授权信息不能为空'
  },
  description: {
    required: false,
    message: '描述'
  }
};

const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 14 };

const showModal = () => {
  open.value = true;
};
const emit = defineEmits(['cancel', 'ok']);

function handleCancel() {
  emit('cancel');
}

const handleOk = async () => {
  try {
    confirmLoading.value = true;
    const value = await formRef.value.validate();
    await createAuth(value);
    emit('ok');
    open.value = false;
    confirmLoading.value = false;
  } catch (error) { }
};
</script>
