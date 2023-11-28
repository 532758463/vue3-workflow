<template>
  <div class="h-full px-8">
    <div class="h-15 flex items-center justify-right">
      <Button type="primary" @click="create">新建</Button>
    </div>
    <a-table :pagination="false" :columns="columns" :data-source="data">
      <!--@vue-ignore -->
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <!--@vue-ignore -->
      <template #customTitle>
        <span> Name </span>
      </template>
      <!--@vue-ignore -->
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
      <!--@vue-ignore -->
      <template #action="{ record }">
        <span>
          <a @click="handleAction(ACTION_TYPE.EDIT, record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleAction(ACTION_TYPE.DELETE, record)">删除</a>
          <a-divider type="vertical" />
          <a @click="handleAction(ACTION_TYPE.DESIGN, record)">设计</a>
          <!-- <a-divider type="vertical" />
          <a @click="handleAction(ACTION_TYPE.RUN, record)">运行</a> -->
        </span>
      </template>
    </a-table>
    <TemplatePromise v-slot="{ resolve, args, isResolving }">
      <PipelineForm :actionInfo="args[0]" @ok="(info: any) => {
        onResolve({
          type: args[0].type,
          id: info.id,
          resolve, value: info.value
        })
      }" @cancel="() => resolve('cancel')" :loading="loading" />
    </TemplatePromise>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  createPipeline,
  deletePipeline,
  updatePipeline,
  getPipelineList
} from '@/service/pipeline';
import { createTemplatePromise } from '@vueuse/core';
import { Button } from 'ant-design-vue';
import PipelineForm from './PipelineForm.vue';
import { ACTION_TYPE } from './modal';
type DialogResult = 'ok' | 'cancel';

const TemplatePromise = createTemplatePromise<DialogResult, any>({
  transition: {
    name: 'fade',
    appear: true
  }
});

const data = ref([]);
const loading = ref(false);
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle', customRender: 'name' }
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' }
  }
];
const router = useRouter();
const handleAction = async (type: string, record: any) => {
  if (type === ACTION_TYPE.DELETE && record) {
    alert(JSON.stringify(record));
    try {
      await deletePipeline(record.id);
      fetchData();
    } catch (error) { }
  }

  if (type === ACTION_TYPE.EDIT) {
    const result = await TemplatePromise.start({
      type: ACTION_TYPE.EDIT,
      id: record.id
    });
    console.log(result);
  }
  if (type === ACTION_TYPE.DESIGN) {
    router.push(`/flow?id=${record.id}`);
  }
};

const fetchData = async () => {
  const res = await getPipelineList({ page: 1, limit: 20, sortOrder: 'DESC' });
  console.log(res);
  data.value = res.data;
};

const onResolve = async ({ type, value, resolve, id }: any) => {
  try {
    loading.value = true;
    if (type === ACTION_TYPE.EDIT) {
      await updatePipeline(id, value);
    }
    if (type === ACTION_TYPE.CREATE) {
      await createPipeline({
        ...value
      });
    }

    fetchData();
    loading.value = false;
    resolve('ok');
  } catch (error) { }
};

const create = async () => {
  await TemplatePromise.start({
    type: ACTION_TYPE.CREATE
  });
};

onMounted(() => {
  fetchData();
});
</script>
