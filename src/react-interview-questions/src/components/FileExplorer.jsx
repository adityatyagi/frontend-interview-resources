
// • “A directory tree is self-similar, so recursion is the most natural mental model. React lets me map that 1-to-1: each <FileNode> renders itself and recursively renders its children.”

import { useState, memo, useCallback } from "react";

// “React.memo + useCallback ⇒ shallow-prop equality prevents cascading renders, which is critical when the tree grows into the thousands of nodes.”

const FileNode = memo(function ({ node, level = 0 }) {
  // track the open and close of the node
  // have open/close tracking for each node seprately
  // “I scoped the isOpen (expanded/collapsed) flag inside each <FileNode>. Locality keeps updates cheap—only the expanded branch re-renders.”

  // “If requirements shift to ‘Collapse All’ or ‘Sync with URL’, I can lift that state into a context or Redux store—so I keep the door open for both localized and global control.”
  const [isOpen, setIsOpen] = useState(false);

  //  “Because each node is memoized and owns its own state, clicking one folder doesn’t trigger a re-render on its siblings or the rest of the tree. We go from a potential O(totalNodes) diff to O(depth). That’s the difference between smooth UX and scroll jank in a monorepo.”
  const toggleNode = useCallback(
    function () {
      // only toggle for folders
      if (node.isFolder) {
        setIsOpen((prev) => !prev);
      }
    },
    [node.isFolder]
  );

  const icon = node.isFolder ? (isOpen ? "📂" : "📁") : "📄";

  // Keyboard accessibility: ArrowRight opens folder, ArrowLeft closes
  const handleKeyDown = useCallback(
    function (e) {
      if (!node.isFolder) return;
      if (e.key === "ArrowRight" && !isOpen) {
        setIsOpen(true);
      } else if (e.key === "ArrowLeft" && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen, node.isFolder]
  );

// ARIA stands for "Accessible Rich Internet Applications".
/**
 *  Definition: "ARIA stands for Accessible Rich Internet Applications"
    Purpose: "It's a set of attributes that make web content accessible to assistive technologies"
    Categories: "There are three main types: roles, properties, and states"
    Best Practice: "Use semantic HTML first, then add ARIA when needed"

    ROLE
    role="button"     // This div acts like a button
    role="tree"       // This is a hierarchical tree structure
    role="treeitem"   // This is an item within a tree

    PROPERTIES
    aria-expanded="true"    // This element is expanded
    aria-hidden="false"     // This element should be visible to screen readers
    aria-required="true"    // This field is required

    STATE
    aria-checked="true"     // This checkbox is checked
    aria-selected="true"    // This item is selected
    aria-disabled="true"    // This element is disabled

 * 
 */

// Think about what a screen reader user needs to know:
// - What is this item? (file/folder)
// - What's its name?
// - Where is it in the hierarchy?
// - What's its current state? (expanded/collapsed)
  return (
    <>
      <div
        role="treeitem"
        aria-expanded={node.isFolder ? isOpen : undefined}
        tabIndex={0}
        aria-label={`${node.name} ${node.isFolder ? 'folder' : 'file'} ${
          node.isFolder ? `, ${isOpen ? 'expanded' : 'collapsed'}` : ''
        }`}
        style={{
          paddingLeft: level * 16,
          textAlign: "left",
          cursor: node.isFolder ? "pointer" : "default",
        }}
        onClick={toggleNode}
        onKeyDown={handleKeyDown}
      >
        <span>{icon}</span> {node.name}
      </div>

      {/* “I render children lazily (isOpen && children.map(...)). That way deep folders never hit the DOM or React reconciler until the user asks for them. It’s an O(visibleNodes) rendering cost.” */}
      {node.isFolder &&
        isOpen &&
        node.children?.map((child) => (
          //  “Keys are React’s anchor for diffing. Without a stable key={child.id}, React will reuse DOM nodes in the wrong places—expanding one folder might suddenly repaint an entirely different branch.
          <FileNode key={child.id} node={child} level={level + 1} />
        ))}
    </>
  );
});

// “I isolate responsibilities: a thin <FileExplorer> entry point and a memoized <FileNode> leaf. That separation makes the component composable and testable.”

const FileExplorer = function ({ data }) {
  return (
    <div role="tree" aria-label="File Explorer">
      <FileNode node={data} />
    </div>
  );
};

export default FileExplorer;
