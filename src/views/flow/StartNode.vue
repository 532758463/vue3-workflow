<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core';
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import { CheckCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
  label: string;
  id: string;
  data: any;
  type: string;
}>();

const emit = defineEmits(['delete'])

function onMenuClick(info: MenuInfo) {
  if (info.key === 'delete') {
    emit('delete', props.id)
  }
}

const status = computed(() => props?.data?.status);
</script>

<template>
  <a-dropdown :trigger="['contextmenu']">
    <!-- <div>
      <div class="wrapper gradient">
        <div class="inner">
          <div class="body">
            <div class="title">{{ props?.label }}</div>
          </div>
        </div>
      </div>
      <Handle type="source" :position="Position.Right" />
    </div> -->
    <div>
      <Handle v-if="type !== 'input'" type="source" :position="Position.Left" />
      <div style="font-size: 16px">
        <LoadingOutlined v-if="status === 0" style="color:dodgerblue;" />
        <CheckCircleOutlined v-if="status === 1" style="color:green;" />
        <CloseOutlined v-if="status === 2" style="color: red;" />
        <div>
          {{ props?.label }}
        </div>
      </div>
      <Handle type="source" :position="Position.Right" />

    </div>

    <template #overlay>
      <a-menu @click="onMenuClick">
        <a-menu-item key="delete">删除</a-menu-item>
        <a-menu-item key="edit">编辑</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<style scoped>
.wrapper {
  overflow: hidden;
  display: flex;
  padding: 2px;
  position: relative;
  border-radius: 10px;
}

.wrapper.gradient:before {
  content: '';
  /* background: conic-gradient(from -160deg at 50% 50%, #e92a67 0deg, #a853ba 120deg, #2a8af6 240deg, rgba(42, 138, 246, 0) 360deg); */
  /* animation: spinner 4s linear infinite; */
  transform: translate(-50%, -50%) rotate(0deg);
  z-index: -1;
}

.gradient:before {
  content: '';
  position: absolute;
  padding-bottom: calc(100% * 1.41421356237);
  width: calc(100% * 1.41421356237);
  background: conic-gradient(from -160deg at 50% 50%, #e92a67 0deg, #a853ba 120deg, #2a8af6 240deg, #e92a67 360deg);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 100%
}

.inner {
  background: rgb(17, 17, 17);
  padding: 16px 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  position: relative;
}

.title {
  color: white;
}

@keyframes spinner {
  100% {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}
</style>
