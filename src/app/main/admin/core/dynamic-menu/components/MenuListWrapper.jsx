import React, { useEffect, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../assets/style.css";
import Icon from "@material-ui/core/Icon";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import * as Actions from "../store/actions";
import { useQuery, gql } from "@apollo/client";
import MenuList from "./MenuList";

const gQlQuery = gql`
  query {
    menuItemsAdmin {
      id
      type
      name
      icon
      color
      order
      link
      external
      accessSlug
      roles {
        id
        name
      }
      data {
        id
        menuItemId
        title
        image
        color_text
        color_background
        link
        external
        order
      }
      children {
        id
        type
        name
        icon
        color
        order
        link
        external
        accessSlug
        roles {
          id
          name
        }
        data {
          id
          menuItemId
          title
          image
          color_text
          color_background
          link
          external
          order
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "50px 20px",
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
}));

function QueryWrapper() {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading, error, data, refetch } = useQuery(gQlQuery, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const doRefetch = useSelector(({ navMenuAdmin }) => {
    return navMenuAdmin.doRefetch;
  });

  useEffect(() => {
    return () => dispatch(Actions.editItem(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data && Array.isArray(data.menuItemsAdmin)) {
      dispatch(Actions.setData(data.menuItemsAdmin));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (doRefetch) {
      try {
        refetch({ variables: { i: Math.random() } });
      } catch (error) {
        if (process.env.NODE_ENV !== "production")
          console.error(error);
      }
      dispatch(Actions.doRefetch(false));
    }
  }, [doRefetch, dispatch, refetch]);

  if (loading)
    return (
      <div className={classes.root}>
        <div>{t("loading")}</div>
        <LinearProgress variant="query" />
      </div>
    );

  if (error) return "Erreur";

  if (
    !data ||
    (Array.isArray(data.menuItemsAdmin) &&
      data.menuItemsAdmin.length <= 0)
  )
    return (
      <div>
        <i>Aucune donnée.</i>
      </div>
    );

  return <MenuListWrapper />;
}

function MenuListWrapper() {
  const [menu, setMenu] = useState(null);

  const navMenuData = useSelector(({ navMenuAdmin }) => {
    return navMenuAdmin.data;
  });

  const handleItemsUI = React.useCallback((element, parent = 0) => {
    const item = Object.assign({}, element); // Do not mutate the Redux state
    item.title = () => <TitleDom item={item} />;
    item.key = item.id;
    if (parent) item.parent = parent;
    if (item.children && item.children.length > 0) {
      item.expanded = true;
      const children = item.children;
      item.children = [];
      for (let child of children) {
        item.children.push(handleItemsUI(child, item.id));
      }
    }
    return item;
  }, []);

  useLayoutEffect(() => {
    if (navMenuData) {
      const data = navMenuData.map((item) => {
        return handleItemsUI(item);
      });
      setMenu(data);
    }
  }, [handleItemsUI, navMenuData]);

  if (!menu) return null;

  return <MenuList menu={menu} />;
}

function TitleDom({ item }) {
  let color = null;
  if (item.color && item.color.indexOf("#") < 0)
    color = item.color = "#" + item.color;
  return (
    <div className="menu-item-title-box" style={{ color }}>
      <Icon className="menu-item-title-box-icon">
        {item.icon || ""}
      </Icon>
      <div className="menu-item-title-box-text">{item.name}</div>
    </div>
  );
}

export default QueryWrapper;
