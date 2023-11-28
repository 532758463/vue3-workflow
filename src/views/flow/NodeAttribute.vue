<template>
  <a-drawer title="节点属性" size="large" :open="open" @close="onClose">
    <NpmForm v-if="type === 'npm'" @ok="updateNode" @cancel="onClose" />
    <AppForm v-else  @ok="updateNode" @cancel="onClose"/>
  </a-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { DrawerProps } from 'ant-design-vue';
import NpmForm from './NpmForm.vue';
import AppForm from './AppForm.vue';

defineProps<{
  open: boolean;
  type?: 'npm' | 'app';
}>();

const emit = defineEmits(['close', 'updateNode'])

// 关闭
const onClose = () => {
  // open.value = false;
  emit('close')
};

// 更新节点信息
const updateNode = async (value: any) => {
  emit('updateNode', value)
  onClose();
}
</script>

