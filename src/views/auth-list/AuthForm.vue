<template>
  <div>
    <a-modal
      open
      title="新建授权"
      :confirm-loading="props.loading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form
        ref="formRef"
        :rules="rules"
        :model="formData"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item name="name" label="授权用户名">
          <a-input v-model:value="formData.name" />
        </a-form-item>
        <a-form-item name="authInfo" label="授权信息">
          <a-textarea :rows="5" v-model:value="formData.authInfo" />
        </a-form-item>
        <a-form-item name="description" label="描述">
          <a-textarea :rows="4" v-model:value="formData.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineEmits, watchEffect } from 'vue';
import { getAuth } from '@/service/auth';

interface FormData {
  name: string;
  authInfo: string;
  description: string;
}
const formRef = ref();

const formData = ref<FormData>({
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

const emit = defineEmits(['cancel', 'ok']);

function handleCancel() {
  emit('cancel');
}

const props = defineProps<{
  loading: boolean;
  id?: string;
}>();
const stop = watchEffect(() => {
  console.log(props.id);
  console.log(props.loading);
  if (props.id) {
    getAuth(props.id).then((res: any) => {
      const content = res.data;
      console.log(content);
      formData.value = content;
      stop();
    });
  }
});
const handleOk = async () => {
  try {
    // confirmLoading.value = true;
    const value = await formRef.value.validate();
    await emit('ok', { value, id: props.id });
    // confirmLoading.value = false;
  } catch (error) {}
};
</script>
