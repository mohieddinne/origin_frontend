import React from "react";
import { FusePageCarded } from "@fuse";
import Layout from "../components/Layout";
import HeaderList from "@catu/components/HeaderList";
import { useTranslation } from "react-i18next";

function List() {
  const { t } = useTranslation();

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "py-24",
        contentCard: "rounded-8",
        contentWrapper: "mb12",
      }}
      header={
        <HeaderList
          url="/admin"
          icon="description"
          title={t("access:title")}
          options={{
            goBack: "/admin/home",
            goBack_string: "Administration",
          }}
        />
      }
      content={<Layout />}
    />
  );
}

export default List;
