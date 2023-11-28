<script setup lang="ts">
import Node from '@/components/Node.vue';

function onDragStart(event: DragEvent, nodeType: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }
}
</script>

<template>
  <aside>
    <slot name="header"></slot>
    <div class="nodes">
      <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'input')">
        npm包
      </div>

      <div class="vue-flow__node-default" :draggable="true" @dragstart="onDragStart($event, 'default')">
        npm包
      </div>
      <div class="vue-flow__node-output" :draggable="true" @dragstart="onDragStart($event, 'output')">
        应用
      </div>
      <!-- <CustomNode :draggable="true" label="应用" /> -->
      <!-- <div class="vue-flow__node-input" :draggable="true" @dragstart="onDragStart($event, 'custom')">
        npm包
      </div> -->
    </div>
    <slot name="footer"></slot>
  </aside>
</template>
<style></style>
