<template>
  <div class="h-full px-8">
    <div class="h-15 flex items-center justify-right">
      <CreateAuth @ok="fetchData" />
    </div>
    <a-table :pagination="false" :columns="columns" :data-source="data">
      <!--@vue-ignore -->
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <!-- @vue-ignore -->
      <template #customTitle>
        <span> Name </span>
      </template>
      <!-- @vue-ignore -->
      <template #tags="{ text: tags }">
        <span>
          <a-tag v-for="tag in tags" :key="tag" :color="tag === 'loser'
            ? 'volcano'
            : tag.length > 5
              ? 'geekblue'
              : 'green'
            ">
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <!-- @vue-ignore -->
      <template #action="{ record }">
        <span>
          <a @click="handleAction('EDIT', record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleAction('DELETE', record)">删除</a>
        </span>
      </template>
    </a-table>
    <TemplatePromise v-slot="{ resolve, args }">
      <AuthForm :id="args[0]" @ok="(value: any) => onUpdate(resolve, value)" @cancel="() => resolve('cancel')"
        :loading="loading" />
    </TemplatePromise>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import CreateAuth from './CreateAuth.vue';
import { getAuthList, deleteAuth, updateAuth, type AuthInfo } from '@/service/auth';
import { createTemplatePromise } from '@vueuse/core';
import AuthForm from './AuthForm.vue';
type DialogResult = 'ok' | 'cancel';

const TemplatePromise = createTemplatePromise<DialogResult, [string]>({
  transition: {
    name: 'fade',
    appear: true
  }
});

const data = ref<AuthInfo[]>([]);
const loading = ref(false);
const columns = [
  {
    title: '授权用户',
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle', customRender: 'name' }
  },
  {
    title: '授权描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' }
  }
];

const handleAction = async (type: string, record: any) => {
  if (type === 'DELETE' && record) {
    alert(JSON.stringify(record));
    try {
      await deleteAuth(record.id);
      fetchData();
    } catch (error) { }
  }

  if (type === 'EDIT') {
    const result = await TemplatePromise.start(record.id);
    console.log(result);
  }
};

const fetchData = async () => {
  const res = await getAuthList({ page: 1, limit: 20, sortOrder: 'DESC' });
  console.log(res);
  data.value = res.data;
};

const onUpdate = async (resolve: any, param: any) => {
  loading.value = true;
  updateAuth(param.id, param.value).then((res) => {
    fetchData();
    setTimeout(() => {
      loading.value = false;
      resolve('ok');
    }, 2000);
  });
};

onMounted(() => {
  fetchData();
});
</script>
