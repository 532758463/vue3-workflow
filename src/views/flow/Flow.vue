
<script lang="ts" setup>
import { nextTick, watch, provide, ref } from 'vue';
import type { Elements, Node, NodeProps } from '@vue-flow/core';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import CustomNode from './CustomNode.vue';
import Sidebar from './Sidebar.vue';
import NodeAttribute from './NodeAttribute.vue';
import { NODE_DATA } from './injectKeys';
import { Controls } from '@vue-flow/controls'
import StartNode from './StartNode.vue';
import { executeNodes } from './executeTree';
// @ts-ignore
import cloneDeep from 'lodash/cloneDeep';
import { save, queryProcess } from '@/service/flow';
import { message, Space } from 'ant-design-vue';
import { Background } from '@vue-flow/background'
import { e } from 'unocss';

const open = ref(false);
const currentNode = ref<Node>();
const isLoading = ref(false);
const props = defineProps<{
  id: string;
}>();
let id = 0;
function getId() {
  return Date.now() + '';
}

const nodeData = computed(() => currentNode.value?.data);
// 构建类型
const buildType = computed(() => {
  const nodeType = currentNode?.value?.type;
  if (nodeType) {
    const npmNodes = ['custom', 'default', 'input'];
    if (npmNodes.includes(nodeType)) {
      return 'npm'
    }
    return 'app'
  }

})
provide(NODE_DATA, nodeData);

const {
  findNode,
  onConnect,
  addEdges,
  addNodes,
  project,
  vueFlowRef,
  nodes,
  toObject,
  setNodes,
  setEdges,
  setViewport,
  edges,
  findEdge
} = useVueFlow({
  nodes: [
    {
      id: '1',
      type: 'input',
      label: '开始节点',
      position: { x: 250, y: 25 },
    }
  ]
});

// 点击打开节点属性
const onNodeAttrOpen = () => {
  open.value = true;
}

// 关闭属性弹窗
const onNodeAttrClose = () => {
  open.value = false;
  currentNode.value = undefined;
}

const updateNode = (value: any) => {
  const nextNodes = nodes.value.map((v) => {
    if (v.id === currentNode.value?.id) {
      v.data = value;
      v.label = value.packageName || value.projectName;
    }
    return v
  })
  setNodes(nextNodes);
}

function onDragOver(event: any) {
  event.preventDefault();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

// 删除指定节点
function onDeleteNode(id: string) {
  const nextNodes = nodes.value.filter((v) => v.id !== id);
  const nextEdges = edges.value.filter(v => (v.target !== id && v.source !== id))
  setNodes(nextNodes);
  setEdges(nextEdges);
}

function onNodeContextMenu({ event, node }: { event: Event; node: Node }) {
  event.preventDefault();
  console.log(node.type, node.id);
}

// 点击节点触发
function onNodeClick({ event, node }: { event: Event; node: Node }) {
  currentNode.value = node;
  onNodeAttrOpen();
}

onConnect((params) => addEdges(params));

const getNodeName = (type: string) => {
  const npmNodes = ['custom', 'default', 'input'];
  if (npmNodes.includes(type)) {
    return 'npm'
  }
  return '应用'
}

function onDrop(event: any) {
  const type = event.dataTransfer?.getData('application/vueflow');
  const { left = 0, top = 0 } = vueFlowRef?.value?.getBoundingClientRect() || {};
  const position = project({
    x: event.clientX - left,
    y: event.clientY - top
  });

  const newNode = {
    id: getId(),
    type,
    position,
    label: getNodeName(type)
  };
  addNodes([newNode]);
  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(newNode.id);
    const stop = watch(
      () => node?.dimensions,
      (dimensions) => {
        if (dimensions && dimensions.width > 0 && dimensions.height > 0 && node) {
          node.position = {
            x: node.position.x - node.dimensions.width / 2,
            y: node.position.y - node.dimensions.height / 2
          };
          stop();
        }
      },
      { deep: true, flush: 'post' }
    );
  });
}

const updateNodeState = (nodeId: string, status: any) => {
  const nextNodes = nodes.value.map((v) => {
    if (v.id === nodeId) {
      v.data.status = status;
    }
    return v
  })
  const nextEdges = edges.value.map((v) => {
    if (v.source === nodeId) {
      if (status === 0) {
        v.animated = true;
      } else if (status === 1) {
        v.animated = false;
        v.class = 'success'
      } else {
        v.animated = false;
      }

    }
    return v
  })
  setEdges(nextEdges);
  setNodes(nextNodes);
}

onMounted(() => {
  if (props.id) {
    queryProcess(props.id).then((res) => {
      if (res?.data?.length) {
        const processJson = res?.data[0]?.processJson;
        loadProcess(processJson)
      }
    })
  }
})

// 保存
async function onSave() {
  console.log(toObject());
  try {
    await save({
      id: props.id,
      processJson: JSON.stringify(toObject())
    });
    message.success('保存成功');
    localStorage.setItem(props.id, JSON.stringify(toObject()));
  } catch (error) {
    console.log(error)
  }
}

// 清除
function onClear() {
  localStorage.setItem(props.id, '{}')
}

// 加载流程图
const loadProcess = (processJson: string) => {
  const data = processJson || '{}' as string;
  const flow = JSON.parse(data)

  if (flow) {
    const [x = 0, y = 0] = flow.position
    setNodes(flow.nodes)
    setEdges(flow.edges)
    setViewport({ x, y, zoom: flow.zoom || 0 })
  }
}

// 恢复流程图
function onRestore() {
  const data = localStorage.getItem(props.id) || '{}' as string;
  // const flow = JSON.parse(data)
  loadProcess(data);
}

function onEacute() {
  const treeNodes = [...cloneDeep(nodes.value)];
  const treeEdges = [...cloneDeep(edges.value)]
  isLoading.value = true;
  executeNodes(treeNodes, treeEdges, updateNodeState)
    .then(() => {
      console.log('顺序执行节点完成');
    })
    .then(() => {
      console.log('并行执行节点完成');
    }).finally(() => {
      isLoading.value = false;
    })
    .catch((error: any) => {
      isLoading.value = false;
      console.error(`执行节点出错：${error}`);
    });
}
</script>
<template>
  <div class="h-full px-8">
    <div class="dndflow" @drop="onDrop">
      <Sidebar>
        <template #header>
          <Space>
            <a-button :loading="isLoading" @click="onEacute">运行</a-button>
            <a-button @click="onSave">保存</a-button>
          </Space>
        </template>
      </Sidebar>
      <!-- @vue-ignore -->
      <VueFlow :nodes="nodes" @dragover="onDragOver" @nodeClick="onNodeClick" @nodeContextMenu="onNodeContextMenu">
        <Background pattern-color="#aaa" :gap="8" />
        <Controls />
        <template #node-custom="customNodeProps">
          <!--@vue-ignore -->
          <CustomNode v-bind="customNodeProps" @delete="onDeleteNode" />
        </template>
        <template #node-input="nodeProps">
          <!--@vue-ignore -->
          <StartNode v-bind="nodeProps" @delete="onDeleteNode" />
        </template>
        <template #node-default="nodeProps">
          <!--@vue-ignore -->
          <StartNode v-bind="nodeProps" @delete="onDeleteNode" />
        </template>
        <template #node-output="nodeProps">
          <!--@vue-ignore -->
          <StartNode v-bind="nodeProps" @delete="onDeleteNode" />
        </template>
      </VueFlow>
    </div>


    <NodeAttribute :type="buildType" :key="currentNode?.id" :open="open" @close="onNodeAttrClose"
      @update-node="updateNode" />
  </div>
</template>
<style lang="less">
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

@import '@vue-flow/controls/dist/style.css';
/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

.success .vue-flow__edge-path {
  stroke: green;
}

.dndflow {
  flex-direction: column;
  display: flex;
  height: 100%;
}

.dndflow aside {
  color: #fff;
  font-weight: 700;
  border-right: 1px solid #eee;
  padding: 15px 10px;
  font-size: 12px;
  background: rgba(16, 185, 129, 0.75);
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0 5px 10px #0000004d;
}

.dndflow aside .nodes>* {
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: grab;
  font-weight: 500;
  -webkit-box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.25);
  box-shadow: 5px 5px 10px 2px #00000040;
}

.dndflow aside .description {
  margin-bottom: 10px;
}

.dndflow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%;
}

@media screen and (min-width: 640px) {
  .dndflow {
    flex-direction: row;
  }

  .dndflow aside {
    min-width: 25%;
  }
}

@media screen and (max-width: 639px) {
  .dndflow aside .nodes {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
}
</style>
