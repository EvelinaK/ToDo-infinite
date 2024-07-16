import React, { useState, useCallback } from "react";

function TreeNode({ node, onCheck, onAdd, onDelete }) {
  const [expanded, setExpanded] = useState(true);

  const handleCheck = () => {
    onCheck(node.id, !node.checked);
  };

  const handleAdd = () => {
    const newNode = {
      id: `${node.id}.${node.children.length + 1}`,
      label: `Child ${node.id}.${node.children.length + 1}`,
      checked: false,
      indeterminate: false,
      path: [],
    };
    onAdd(node.id, newNode);
  };

  const handleDelete = () => {
    onDelete(node.id);
  };

  return (
    <div style={{ marginLeft: 20 }}>
      <input
        type="checkbox"
        checked={node.checked}
        // indeterminate={node.indeterminate === "checked" ? "true" : "false"}

        ref={(el) => {
          if (el) el.indeterminate = node.indeterminate;
        }}
        onChange={handleCheck}
      />
      <span
        style={{ background: "blue" }}
        onClick={() => setExpanded(!expanded)}
      >
        {node.label}
      </span>
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleDelete}>Delete</button>
      {expanded && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onCheck={onCheck}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Tree({ data, onCheck, onAdd, onDelete }) {
  function buildTree(data) {
    const idMap = {};
    const tree = [];

    data.forEach((node) => {
      idMap[node.id] = { ...node, children: [] };
    });

    data.forEach((node) => {
      if (node.path.length === 0) {
        tree.push(idMap[node.id]);
      } else {
        const parent = idMap[node.path[node.path.length - 1]];
        parent.children.push(idMap[node.id]);
      }
    });

    return tree;
  }
  const treeData = buildTree(data);

  return (
    <div>
      {treeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onCheck={onCheck}
          onAdd={onAdd}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default Tree;
