import React, { useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import { FuseAnimate } from "@fuse";
import { useTranslation } from "react-i18next";
import CategoryListItem from "./CategoryListItem";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";
import slugify from "slugify";

const gQlQuery = gql`
  query {
    emailTemplatesCategories {
      id
      name
    }
  }
`;

function CategoriesWidgets() {
  const { t } = useTranslation();
  return (
    <FuseAnimate animation="transition.slideLeftIn" delay={200}>
      <List classes={{ root: "p-8 pb-16 bg-gray-100 rounded-8" }}>
        <ListSubheader>
          {t("category-liste", { count: 2 })}
        </ListSubheader>
        <CategoriesList />
      </List>
    </FuseAnimate>
  );
}

function CategoriesList() {
  const { t } = useTranslation();
  const params = useParams();
  const history = useHistory();

  const { loading, error, data } = useQuery(gQlQuery);

  const id = parseInt(params.id);

  const categories = useMemo(() => {
    let categories = [];
    if (data && Array.isArray(data.emailTemplatesCategories))
      categories = data.emailTemplatesCategories;
    return categories;
  }, [data]);

  useEffect(() => {
    if (categories.length > 0 && !id) {
      let slug = "/admin/email-templates/list/";
      const fc = categories[0];
      const name = slugify(categories[0].name).toLowerCase();
      slug = slug + fc.id + "-" + name;
      history.push(slug);
    }
  }, [categories, history, id]);

  if (error)
    return (
      <CategoryListItem
        disabled={true}
        item={{
          id: 0,
          name: t("error"),
          icon: "error",
        }}
      />
    );

  if (loading)
    return (
      <CategoryListItem
        disabled={true}
        item={{
          id: 0,
          name: t("loading"),
          icon: "more_horiz",
        }}
      />
    );

  return categories.map((item) => (
    <CategoryListItem key={item.id} item={item} />
  ));
}

export default CategoriesWidgets;
