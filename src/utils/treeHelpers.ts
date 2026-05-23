// ─────────────────────────────────────────────────────────────
// FILE: src/utils/treeHelpers.ts
//
// PURPOSE: Pure functions that READ or MODIFY the file tree.
//
// WHY "PURE" FUNCTIONS?
//   A pure function:
//     1. Given the same input, always returns the same output.
//     2. Has NO side effects — it never modifies anything outside itself.
//
//   This means these functions NEVER mutate the existing `nodes` array.
//   Instead, they always return a BRAND NEW array/object.
//
//   Why does that matter for React?
//   React detects changes by comparing object references.
//   If you mutate an existing object, React sees the same reference
//   and thinks nothing changed — so it won't re-render.
//   By returning a NEW object, we guarantee React will re-render.
//
// HOW RECURSION WORKS HERE (the core mental model):
//   The tree has an unknown number of levels deep.
//   We can't hardcode "check level 1, then level 2, then level 3...".
//   Instead, every function follows the same 3-step pattern:
//
//     STEP A: Is this the node we're looking for?  → act on it
//     STEP B: Does this node have children?        → go deeper (recurse)
//     STEP C: Neither?                             → return it unchanged
//
// ─────────────────────────────────────────────────────────────

import { FileNode } from '@/types';

// ═══════════════════════════════════════════════════════════════
// 🔍 findNode — Get a single node anywhere in the tree by its ID
// ═══════════════════════════════════════════════════════════════
//
// Parameters:
//   nodes — the array of FileNodes to search in (starts at root)
//   id    — the UUID string of the node we want to find
//
// Returns:
//   The matching FileNode, or null if not found anywhere.
//
// Why a `for...of` loop instead of `.map()`?
//   We want to RETURN EARLY the moment we find the node.
//   `.map()` always processes the entire array — no early exit.
//   `for...of` lets us `return` immediately when found.
export function findNode(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    // STEP A: Is this the node we want?
    if (node.id === id) return node; // Found it! Return immediately.

    // STEP B: Does this node have children? Search inside them.
    if (node.children) {
      const found = findNode(node.children, id); // Recursive call
      // If the recursive search found something, bubble it up.
      if (found) return found;
    }
    // STEP C: Not a match, no children → the loop continues to next sibling.
  }
  // We searched the entire tree and found nothing.
  return null;
}

// ═══════════════════════════════════════════════════════════════
// 📂 getChildren — Get the direct children of a selected folder
// ═══════════════════════════════════════════════════════════════
//
// Parameters:
//   nodes    — the full root-level array
//   folderId — the ID of the folder to look inside,
//              OR null to mean "show the root level"
//
// Returns:
//   An array of FileNode (the immediate children).
//   Returns empty array if the folder has no children yet.
//
// Used by: MainPanel — to know what items to display in the grid.
export function getChildren(nodes: FileNode[], folderId: string | null): FileNode[] {
  // If no folder is selected (folderId is null), we're at the root.
  // The root "folder" IS the nodes array itself.
  if (!folderId) return nodes;

  // Otherwise, find the folder node...
  const folder = findNode(nodes, folderId);

  // ...and return its children.
  // `??` is the "nullish coalescing" operator:
  //   if folder?.children is null or undefined, return [] instead.
  // This prevents crashes if the folder exists but has no children yet.
  return folder?.children ?? [];
}

// ═══════════════════════════════════════════════════════════════
// ➕ addNode — Insert a new node into a parent folder
// ═══════════════════════════════════════════════════════════════
//
// Parameters:
//   nodes    — the current full tree (we will NOT mutate this)
//   parentId — the ID of the folder to add into,
//              OR null to add at the root level
//   newNode  — the new FileNode to insert
//
// Returns:
//   A completely NEW tree with newNode inserted in the right place.
//
// HOW IT WORKS (the recursive pattern):
//   We use `.map()` which always creates a NEW array.
//   For each node:
//     - If it's the parent → return a new node with newNode appended to children
//     - If it has children → return a new node with recursively updated children
//     - Otherwise → return the node unchanged
export function addNode(
  nodes: FileNode[],
  parentId: string | null,
  newNode: FileNode
): FileNode[] {
  // Special case: no parent means we add to the ROOT level.
  // The spread `...nodes` creates a new array — never mutates.
  if (!parentId) {
    return [...nodes, newNode]; // New array = old items + the new node
  }

  // Walk through every node at the current level using .map()
  // .map() returns a NEW array — the original `nodes` is untouched.
  return nodes.map((node) => {
    // STEP A: Is this the parent we want to add into?
    if (node.id === parentId && node.type === 'folder') {
      return {
        ...node, // Spread: copy ALL existing properties of this node
        children: [
          ...(node.children ?? []), // Spread existing children (or empty array)
          newNode,                  // Append the new node at the end
        ],
        // Why `node.children ?? []`?
        // If a folder has never had children, `node.children` is undefined.
        // Spreading `undefined` throws an error: [...undefined] ❌
        // So we default to an empty array: [...[]] ✅
      };
    }

    // STEP B: Not our target, but has children → go deeper.
    if (node.children) {
      return {
        ...node,
        // Recursively search and insert inside this node's children.
        children: addNode(node.children, parentId, newNode),
      };
    }

    // STEP C: Not our target, no children (it's a file leaf) → unchanged.
    return node;
  });
}

// ═══════════════════════════════════════════════════════════════
// ✏️ renameNode — Update the name of any node in the tree
// ═══════════════════════════════════════════════════════════════
//
// Parameters:
//   nodes   — the current full tree
//   id      — the ID of the node to rename
//   newName — the replacement name string
//
// Returns:
//   A new tree where the matching node has the updated name.
export function renameNode(nodes: FileNode[], id: string, newName: string): FileNode[] {
  return nodes.map((node) => {
    // STEP A: Found the target node.
    if (node.id === id) {
      // Return a new object with the same properties, except `name` is updated.
      // `{ ...node, name: newName }` is equivalent to:
      //   Object.assign({}, node, { name: newName })
      // The spread comes first so all existing fields are copied,
      // then `name: newName` OVERWRITES just the name field.
      return { ...node, name: newName };
    }

    // STEP B: Not our target, has children → recurse deeper.
    if (node.children) {
      return { ...node, children: renameNode(node.children, id, newName) };
    }

    // STEP C: Not our target, no children → return unchanged.
    return node;
  });
}

// ═══════════════════════════════════════════════════════════════
// 📝 updateFileContent — Save edited text into a file node
// ═══════════════════════════════════════════════════════════════
//
// Parameters:
//   nodes      — the current full tree
//   id         — the ID of the file to update
//   newContent — the new text content (what the user typed)
//
// Returns:
//   A new tree where the matching file has the updated content.
//
// This is called whenever the user hits "Save" in the TextEditor.
export function updateFileContent(
  nodes: FileNode[],
  id: string,
  newContent: string
): FileNode[] {
  return nodes.map((node) => {
    // STEP A: Found the file node.
    if (node.id === id && node.type === 'file') {
      // Return a new object, only the `content` field changes.
      return { ...node, content: newContent };
    }

    // STEP B: Has children → recurse (the file might be nested inside a folder).
    if (node.children) {
      return { ...node, children: updateFileContent(node.children, id, newContent) };
    }

    // STEP C: Unchanged node.
    return node;
  });
}

// ═══════════════════════════════════════════════════════════════
// 🗑️ deleteNode — Remove a node (and all its descendants) from the tree
// ═══════════════════════════════════════════════════════════════
//
// Parameters:
//   nodes — the current full tree
//   id    — the ID of the node to delete
//
// Returns:
//   A new tree with the matching node completely removed.
//
// WHY DOES DELETING A FOLDER DELETE ALL ITS CONTENTS AUTOMATICALLY?
//   We simply remove the folder node itself.
//   Its `children` array is PART of that folder node object.
//   When the folder is removed, its entire subtree disappears with it.
//   No extra logic needed — the data structure handles it naturally.
//
// HOW IT WORKS:
//   Unlike the other functions which use `.map()`,
//   here we CHAIN `.filter()` then `.map()`:
//
//   1. `.filter()` removes any node at THIS level whose id matches.
//   2. `.map()` then recurses into the SURVIVORS' children.
//
//   Why filter BEFORE map?
//   We need to remove nodes at this level first, THEN recurse into
//   the remaining ones. If we mapped first and then filtered, we'd
//   have already created new child arrays for nodes we're about to delete.
export function deleteNode(nodes: FileNode[], id: string): FileNode[] {
  return nodes
    // Step 1: Remove any node at this level that matches the ID.
    // `.filter()` returns a new array containing only nodes where the
    // callback returns `true`. When `node.id === id` is true, the node
    // is EXCLUDED (we return false). Everyone else is kept.
    .filter((node) => node.id !== id)

    // Step 2: For each SURVIVING node, recursively clean its children too.
    // Why? The node to delete might be deeper in the tree, not at this level.
    // We need to descend into children to find and remove it there.
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: deleteNode(node.children, id), // Recurse into children
        };
      }
      return node; // File leaf node — no children to recurse into
    });
}
