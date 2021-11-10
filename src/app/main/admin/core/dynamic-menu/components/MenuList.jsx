import React from "react";
import SortableTree from "react-sortable-tree";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch } from "react-redux";
import * as Actions from "../store/actions";

import "../assets/style.css";

function MenuList(props) {
  const { menu, loading } = props;
  const dispatch = useDispatch();

  const cleanTree = (data) => {
    return data.map((element) => {
      if (element.expanded) delete element.expanded;
      if (element.children)
        element.children = cleanTree(element.children);
      return element;
    });
  };

  const handleTreeOnChange = (treeData) => {
    dispatch(Actions.updateData(cleanTree(treeData)));
  };

  const prepareToEditClick = (item) => {
    if (!item) return null;
    const element = { ...item }; // Prepare to edit
    if (item.parentNode) element.parent = item.parentNode.id;
    if (element.expanded) delete element.expanded;
    if (element.children && element.children.length > 0) {
      element.children = element.children.map(prepareToEditClick);
    }
    return element;
  };

  const handleEditClick = (item) => {
    if (!item.node) return false;
    // Prepare to edit
    const element = { ...prepareToEditClick(item.node) };
    dispatch(Actions.editItem(element));
  };

  const handleDeleteClick = (item) => {
    if (!item.node) return false;
    const element = { ...item.node }; // Prepare to edit
    if (item.parentNode) element.parent = item.parentNode.id;
    if (element.expanded) delete element.expanded;
    dispatch(Actions.deleteItem(element));
  };

  return (
    <SortableTree
      treeData={menu}
      onChange={handleTreeOnChange}
      isVirtualized={false}
      getNodeKey={({ node }) => node.id}
      maxDepth={2}
      generateNodeProps={(rowInfo) => ({
        buttons: [
          <IconButton
            aria-label="edit"
            onClick={() => handleEditClick(rowInfo)}
            disabled={loading}
            size="small"
          >
            <Icon>edit</Icon>
          </IconButton>,
          <IconButton
            aria-label="remove"
            onClick={() => handleDeleteClick(rowInfo)}
            disabled={loading}
            size="small"
          >
            <Icon>remove_circle</Icon>
          </IconButton>,
        ],
      })}
    />
  );
}

export default MenuList;
