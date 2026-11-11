import { TreeNode } from '../types.js';

export class ParseTree {
  constructor(root = null) {
    this.root = root;
  }

  /**
   * Computes layout coordinates (x, y) for every node in the tree.
   * Uses depth for y, and leaf-index ordering with subtree centering for x.
   * @param {number} width - Target width
   * @param {number} levelHeight - Vertical spacing between levels
   * @returns {{ root: TreeNode, width: number, height: number, maxDepth: number }}
   */
  layout(width = 800, levelHeight = 70) {
    if (!this.root) {
      return { root: null, width: 0, height: 0, maxDepth: 0 };
    }

    let nextLeafX = 40;
    const leafGap = 45;
    let maxDepth = 0;

    // Step 1: Post-order pass to position leaves and center parents
    const assignPositions = (node, depth) => {
      if (depth > maxDepth) maxDepth = depth;
      node.y = depth * levelHeight + 40;

      if (!node.children || node.children.length === 0) {
        node.x = nextLeafX;
        nextLeafX += leafGap;
        return;
      }

      for (const child of node.children) {
        assignPositions(child, depth + 1);
      }

      // Parent x is the midpoint of its first and last child
      const firstChild = node.children[0];
      const lastChild = node.children[node.children.length - 1];
      node.x = (firstChild.x + lastChild.x) / 2;
    };

    assignPositions(this.root, 0);

    const treeWidth = Math.max(width, nextLeafX + 40);
    const treeHeight = (maxDepth + 1) * levelHeight + 60;

    return {
      root: this.root,
      width: treeWidth,
      height: treeHeight,
      maxDepth
    };
  }

  /**
   * Returns all nodes in pre-order traversal
   */
  getNodes() {
    const nodes = [];
    const traverse = (node) => {
      if (!node) return;
      nodes.push(node);
      for (const child of node.children) {
        traverse(child);
      }
    };
    traverse(this.root);
    return nodes;
  }

  /**
   * Returns all edges as { parent, child }
   */
  getEdges() {
    const edges = [];
    const traverse = (node) => {
      if (!node) return;
      for (const child of node.children) {
        edges.push({ parent: node, child });
        traverse(child);
      }
    };
    traverse(this.root);
    return edges;
  }

  /**
   * Returns leaves of the parse tree (the terminal yield)
   */
  getYield() {
    const yieldTokens = [];
    const traverse = (node) => {
      if (!node) return;
      if (!node.children || node.children.length === 0) {
        if (node.type === 'terminal' || node.type === 'epsilon') {
          yieldTokens.push(node.label);
        }
      } else {
        for (const child of node.children) {
          traverse(child);
        }
      }
    };
    traverse(this.root);
    return yieldTokens.join(' ');
  }
}
