export function treeHandling(data, fn, action = "map") {
  return data[action]((item) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      const obj = {
        ...item,
        children: treeHandling(item?.children, fn, action),
      };
      return fn(obj);
    } else {
      return fn(item);
    }
  });
}

export function rolesToRedux(data) {
  // Reshape roles
  let roles = data.roles;
  if (Array.isArray(roles)) {
    roles = roles.map((id) => ({ id: parseInt(id) }));
  }
  return { ...data, roles };
}

export function rolesToEditor(data) {
  // Reshape roles
  let roles = null;
  if (Array.isArray(data.roles)) {
    roles = data.roles.map((role) => role.id);
  }
  return { ...data, roles };
}

export function flattenTree(data) {
  if (!Array.isArray(data)) return [];
  let root = [],
    children = [];
  for (let item of data) {
    if (item.children) {
      children = flattenTree(item.children);
      delete item.children;
    }
    root.push(item);
  }
  return [...root, ...children];
}

export function prepareToServer(data, parent) {
  console.log({ data, parent });
  let result = [];
  let order = 1;
  for (const item of data) {
    // Main node
    const node = { ...item, order, parentId: parent || null };
    if (node.module) delete node.module;
    // Children
    let children = [];
    delete node.children;
    delete node.key;
    delete node.parent;
    delete node.isNewItem;
    if (Array.isArray(item.children) && item.children.length > 0)
      children = prepareToServer(item.children, item.id);
    if (Array.isArray(item.data) && item.data.length > 0) {
      item.data = prepareDataToServer(item.data, item.id);
      // const obj = {
      //   ...item,
      //   data: prepareDataToServer(item.data, item.id),
      // };
    }
    result = [...result, node, ...children];
    order++;
  }
  return result;
}

export function prepareDataToServer(data, parentId) {
  let order = 1;
  const items = [];
  for (const item of data) {
    delete item.isNew;
    const obj = {
      ...item,
      menuItemId: parentId,
      order,
    };
    // item.menuItemId = parentId;
    // item.order = order;
    items.push(obj);
    order++;
  }
  return items;
}
