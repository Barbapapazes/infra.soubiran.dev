import type { Edge, Node } from '@vue-flow/core'
import dagre from '@dagrejs/dagre'
import { Position, useVueFlow } from '@vue-flow/core'
import { ref } from 'vue'

interface LayoutOptions {
  centerNodes?: boolean
}

export function useLayout() {
  const { findNode } = useVueFlow()

  const graph = ref(new dagre.graphlib.Graph())

  const previousDirection = ref('LR')

  function layout<TData = any>(
    nodes: Node<TData>[],
    edges: Edge[],
    direction: 'TB' | 'RL' | 'LR' = 'RL',
    options: LayoutOptions = {},
  ): Node<TData>[] {
    const dagreGraph = new dagre.graphlib.Graph()

    graph.value = dagreGraph

    dagreGraph.setDefaultEdgeLabel(() => ({}))

    const isHorizontal = direction === 'RL' || direction === 'LR'
    dagreGraph.setGraph({ rankdir: direction })

    previousDirection.value = direction

    for (const node of nodes) {
      const graphNode = findNode<Node<TData>>(node.id)

      if (!graphNode)
        continue

      dagreGraph.setNode(node.id, { width: graphNode.dimensions.width * 1.4 || 400, height: graphNode.dimensions.height || 50 })
    }

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target)
    }

    dagre.layout(dagreGraph)

    // set nodes with updated positions
    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      const graphNode = findNode<Node<TData>>(node.id)
      const width = (graphNode?.dimensions.width || 400)
      const height = graphNode?.dimensions.height || 50

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: {
          x: options.centerNodes ? nodeWithPosition.x - width / 2 : nodeWithPosition.x,
          y: options.centerNodes ? nodeWithPosition.y - height / 2 : nodeWithPosition.y,
        },
      }
    })
  }

  return { graph, layout, previousDirection }
}
