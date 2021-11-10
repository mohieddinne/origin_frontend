import React from "react";
import { FusePageCarded } from "@fuse";
import ListHandler from "../components/tables/ListHandler";
import ListHeader from "@catu/components/HeaderList";
import SearchInput from "../components/SearchInput";
import reducer from "../store/reducer";
import withReducer from "app/store/withReducer";
import { useTranslation } from "react-i18next";

function Page() {
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
        <ListHeader
          icon="people"
          title={t("fApp:title")}
          Input={SearchInput}
        />
      }
      content={<ListHandler />}
    />
  );
}
export default withReducer("factureApp", reducer)(Page);
