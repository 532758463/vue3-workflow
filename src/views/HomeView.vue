<script setup lang="ts">
import TheWelcome from '@/components/TheWelcome.vue';
import AuthList from '@/views/auth-list/AuthList.vue';
import PipelineList from '@/views/pipeline/PipelineList.vue';
import { ref } from 'vue';
const activeKey = ref('1')
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <a-tabs v-model:activeKey="activeKey" centered>
      <a-tab-pane key="1" tab="授权管理">
        <AuthList />
      </a-tab-pane>
      <a-tab-pane key="2" tab="流水线管理">
        <PipelineList />
      </a-tab-pane>
    </a-tabs>
  </main>
</template>
