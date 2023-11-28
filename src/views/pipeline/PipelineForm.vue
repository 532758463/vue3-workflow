<template>
  <div>
    <a-modal
      open
      :title="props.title"
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
        <a-form-item name="name" label="流水线名称">
          <a-input v-model:value="formData.name" />
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
import { getPipeline } from '@/service/pipeline';

interface FormData {
  name: string;
  description: string;
}
const confirmLoading = ref<boolean>(false);
const formRef = ref();

const formData = ref<FormData>({
  name: '',
  description: ''
});
const rules = {
  name: {
    required: true,
    message: '流水线名称不能为空'
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
  title?: string;
  actionInfo?: any;
}>();
const id = props.actionInfo.id;
const stop = watchEffect(() => {
  console.log(id);
  console.log(props.loading);
  if (id) {
    getPipeline(id).then((res: any) => {
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
    await emit('ok', { value, id });
    // confirmLoading.value = false;
  } catch (error) {}
};
</script>
