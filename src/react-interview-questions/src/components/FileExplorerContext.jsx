/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useCallback } from "react";

const FileExplorerContext = createContext(null);

export function FileExplorerProvider({ children }) {
  // Store ids of folders currently expanded
  // using Set for unique nodes
  const [openNodes, setOpenNodes] = useState(() => new Set());

  const toggleNode = useCallback((id) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setOpenNodes(new Set());
  }, []);

  const value = { openNodes, toggleNode, collapseAll };

  return <FileExplorerContext.Provider value={value}>{children}</FileExplorerContext.Provider>;
}

export function useFileExplorer() {
  const ctx = useContext(FileExplorerContext);
  if (!ctx) {
    throw new Error("useFileExplorer must be used within FileExplorerProvider");
  }
  return ctx;
} 