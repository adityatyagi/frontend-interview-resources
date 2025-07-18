// • “A directory tree is self-similar, so recursion is the most natural mental model. React lets me map that 1-to-1: each <FileNode> renders itself and recursively renders its children.”

import { memo, useCallback } from "react";
import {
  FileExplorerProvider,
  useFileExplorer,
} from "./FileExplorerContext";

// “React.memo + useCallback ⇒ shallow-prop equality prevents cascading renders, which is critical when the tree grows into the thousands of nodes.”

const FileNode = memo(function ({ node, level = 0 }) {
  const { openNodes, toggleNode } = useFileExplorer();
  const isOpen = node.isFolder ? openNodes.has(node.id) : false;

  //  “Because each node is memoized and owns its own state, clicking one folder doesn’t trigger a re-render on its siblings or the rest of the tree. We go from a potential O(totalNodes) diff to O(depth). That’s the difference between smooth UX and scroll jank in a monorepo.”
  const handleToggle = useCallback(
    function () {
      if (node.isFolder) {
        toggleNode(node.id);
      }
    },
    [node.isFolder, node.id, toggleNode]
  );

  const icon = node.isFolder ? (isOpen ? "📂" : "📁") : "📄";

  // Keyboard accessibility: ArrowRight opens folder, ArrowLeft closes
  const handleKeyDown = useCallback(
    function (e) {
      if (!node.isFolder) return;
      if (e.key === "ArrowRight" && !isOpen) {
        toggleNode(node.id);
      } else if (e.key === "ArrowLeft" && isOpen) {
        toggleNode(node.id);
      }
    },
    [isOpen, node.isFolder, node.id, toggleNode]
  );

  return (
    <>
      <div
        role="treeitem"
        aria-expanded={node.isFolder ? isOpen : undefined}
        tabIndex={0}
        style={{
          paddingLeft: level * 16,
          textAlign: "left",
          cursor: node.isFolder ? "pointer" : "default",
        }}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span>{icon}</span> {node.name}
      </div>

      {/* “I render children lazily (isOpen && children.map(...)). That way deep folders never hit the DOM or React reconciler until the user asks for them. It’s an O(visibleNodes) rendering cost.” */}
      {node.isFolder &&
        isOpen &&
        node.children?.map((child) => (
          //  “Keys are React’s anchor for diffing. Without a stable key={child.id}, React will reuse DOM nodes in the wrong places—expanding one folder might suddenly repaint an entirely different branch.
          <FileNode
            key={child.id}
            node={child}
            level={level + 1}
          />
        ))}
    </>
  );
});

// “I isolate responsibilities: a thin <FileExplorer> entry point and a memoized <FileNode> leaf. That separation makes the component composable and testable.”

function ExplorerBody({ data }) {
  const { collapseAll } = useFileExplorer();

  return (
    <div>
      <button
        onClick={collapseAll}
        style={{ marginBottom: 8 }}
        aria-label="Collapse All Folders"
        role="button"
      >
        Collapse All
      </button>

      <div role="tree" aria-label="File Explorer">
        <FileNode node={data} />
      </div>
    </div>
  );
}

export default function FileExplorerCollapseAll({ data }) {
  return (
    <FileExplorerProvider>
      <ExplorerBody data={data} />
    </FileExplorerProvider>
  );
}
