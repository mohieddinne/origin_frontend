import React, { useEffect } from "react";
import clsx from "clsx";
import LinearProgress from "@material-ui/core/LinearProgress";
import { FuseNavigation } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import * as Actions from "app/store/actions/fuse/navigation.actions";

const gQlQuery = gql`
  query {
    menuItems {
      id
      type
      name
      icon
      color
      order
      link
      external
      access {
        name
        slug
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
        access {
          name
          slug
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
    me {
      menunNotifications {
        value
        url
      }
    }
  }
`;

function NavigationHandler(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { loading, error, data, refetch } = useQuery(gQlQuery, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const doRefetch = useSelector(({ fuse }) => {
    const navigation = fuse.navigation;
    return navigation === null;
  });

  useEffect(() => {
    if (doRefetch) refetch({ variables: { i: Math.random() } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doRefetch]);

  useEffect(() => {
    if (data && data.menuItems) {
      const menu = handleMenuItems(data.menuItems);
      dispatch(Actions.setNavigation(menu));
      // Get menu notifications
      if (Array.isArray(data.me?.menunNotifications)) {
        for (const item of data?.me?.menunNotifications) {
          dispatch(Actions.updateCountOnItem(item.url, item.value));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (loading)
    return (
      <div className="px-16 py-32 text-gray-500">
        <div className="text-center mb-16">{t("loading")}</div>
        <LinearProgress variant="query" />
      </div>
    );

  if (error)
    return (
      <div className="px-16 py-32 text-gray-500">
        <div className="text-center mb-16">
          {t("error.loading_menu")}
        </div>
      </div>
    );

  return <Navigation {...props} />;
}

function Navigation(props) {
  const navigation = useSelector(({ fuse }) => fuse.navigation);
  return (
    <FuseNavigation
      className={clsx("navigation", props.className)}
      navigation={navigation || []}
      layout={props.layout}
      dense={props.dense}
    />
  );
}

Navigation.defaultProps = {
  layout: "vertical",
};

NavigationHandler.defaultProps = {
  layout: "vertical",
};

export default NavigationHandler;

function handleMenuItems(items) {
  const data = [];
  if (items.length > 0) {
    for (const item of items) {
      const mItem = {
        id: item.id,
        type: item.type,
        title: item.name,
        order: item.order,
        icon: item.icon,
        url: item.link || "#",
        color: item.color || false,
        external: item.external === true,
        children: [],
      };
      // Handle access
      if (item.access && item.access.slug)
        mItem.auth = item.access.slug;
      else mItem.auth = "login";
      // Handle color
      if (mItem.color && mItem.color.indexOf("#") < 0)
        mItem.color = "#" + mItem.color;
      // Handle children
      if (item.children && item.children.length > 0)
        mItem.children = handleMenuItems([...item.children]);
      // Set the data
      if (item.data !== null) mItem.data = item.data;

      data.push(mItem);
    }
  }
  return data;
}
