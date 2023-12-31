import type { Node, Edge } from "@vue-flow/core";
import { getBuildState, sendTask } from "@/service/flow";

type UpdateNodeFn = (nodeId: string, data: any) => void;

const fetchState = (params: any, cb: any) => {
  const timerId = setInterval(() => {
    getBuildState(params).then((res) => {
      if (res.data !== 0) {
        clearInterval(timerId);
        cb(res.data);
      }
    });
  }, 5000);
};

function executeNode(node: Node, updateNodeState: UpdateNodeFn) {
  return new Promise((resolve, reject) => {
    // 执行节点的操作，这里假设节点的操作是一个异步操作
    const buildParams = node.data.buildParams;
    updateNodeState(node.id, 0);
    console.log(`执行节点 ${node.label} 的操作`);
    sendTask(buildParams).then((res) => {
      const params = {
        projectId: buildParams.projectId,
        env: buildParams.env,
        deployment: buildParams.deployment,
        queryId: res.data,
      };
      fetchState(params, (status: any) => {
        updateNodeState(node.id, status);
        // 假设节点的操作结果为 result
        if (status === 1) {
          const result = `执行${node.label}成功！`;
          resolve(result);
        } else {
          reject(`执行节点 ${node.label} 失败${status}`);
        }
      });
    });
  });
}

export async function executeNodes(
  nodes: Node[],
  edges: Edge[],
  updateNodeState: UpdateNodeFn,
) {
  const nodeMap = new Map();
  const promises = [];
  // 只有一个节点时
  if (!edges.length && nodes.length === 1) {
    // 先执行来源节点本身
    const sourcePromise = executeNode(nodes[0], updateNodeState);
    promises.push(sourcePromise);
    return await Promise.all(promises);
  }

  const executedNodeIds = new Set();
  const targetIds = new Set();
  // 创建节点映射
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  // 按照edges的连线规则执行节点
  for (const edge of edges) {
    const sourceNode = nodeMap.get(edge.source);
    if (sourceNode) {
      // 检查节点是否已经执行过
      if (!executedNodeIds.has(sourceNode.id)) {
        // 标记节点已经执行过
        sourceNode.data.executed = true;
        executedNodeIds.add(sourceNode.id);
        try {
          // 先执行来源节点本身，如果之前源节点的目标节点执行过就不再执行，只执行它的目标节点
          if(!targetIds.has(sourceNode.id)){
            await executeNode(sourceNode, updateNodeState);
          }
           // 并行执行具有相同来源的节点
          const parallelNodes = edges.filter((e) => e.source === edge.source);
          const parallelPromises = parallelNodes.map((parallelEdge) => {
            const parallelTargetNode = nodeMap.get(parallelEdge.target);
            targetIds.add(parallelEdge.target);
            return executeNode(parallelTargetNode, updateNodeState);
          });
          promises.push(...parallelPromises);
          await Promise.all(promises);
        } catch (err) {
          updateNodeState(sourceNode.id, 2);
          return Promise.reject(err);
        }
      }
    }
  }
  return new Promise((resolve)=>{
    resolve('success')
  })
}

// executeNodes(data.nodes, data.edges)
//   .then(() => {
//     console.log('节点执行完成');
//   })
//   .catch(error => {
//     console.error(`执行节点出错：${error}`);
//   });
