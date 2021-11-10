import React from "react";
import CatuFilePageCarded from "@catu/components/PageLayouts/carded/CatuFilePageCarded";
import withReducer from "app/store/withReducer";
import reducer from "../store/reducer";
import { useTranslation } from "react-i18next";
import HeaderForm from "@catu/components/HeaderForm";
import { useParams } from "react-router-dom";
import HolidayForm from "../components/forms/HolidayForm";
import { makeStyles } from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";

const useStyle = makeStyles(() => ({
  content: {
    position: "static !important",
  },
}));

const query = gql`
  query holiday($id: ID) {
    holiday(id: $id) {
      id
      name
      date
    }
  }
`;

function ItemHandler(props) {
  const { itemId } = useParams();

  const { data, loading, error } = useQuery(query, {
    variables: { id: itemId },
    skip: itemId === "new",
    notifyOnNetworkStatusChange: true,
  });

  if (error) return "error";

  return (
    <Form
      loading={loading}
      item={(data && data.holiday) || null}
      {...props}
    />
  );
}

function Form(props) {
  const { t } = useTranslation();
  const classes = useStyle();

  const url = "/app/holidays/list";

  const { loading, item } = props;

  return (
    <CatuFilePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        content: classes.content,
      }}
      header={
        <HeaderForm
          strings={{
            defaultTitle: loading
              ? t("loading")
              : t(`holidays:${item ? "edit" : "new"}_holiday`),
            caption: loading
              ? " "
              : t(`holidays:${item ? "edit" : "new"}_holiday_cap`),
            list_name: t("holidays:holiday", { count: 2 }),
          }}
          options={{
            showIconEditor: false,
            goBack: true,
            defaultGoBackLink: url,
          }}
        />
      }
      content={<HolidayForm loading={loading} item={item} />}
      innerScroll
    />
  );
}

export default withReducer("HolidaysApp", reducer)(ItemHandler);
