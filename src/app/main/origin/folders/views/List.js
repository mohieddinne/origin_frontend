import React from "react";
import { FusePageCarded } from "@fuse";
import List from "../components/FoldersTable";
import ListHeader from "@catu/components/HeaderList";
import reducer from "../store/reducer";
import withReducer from "app/store/withReducer";
import { useTranslation } from "react-i18next";
import SearchInput from "../component/SearchInput";
import { useLocation } from "react-router-dom";

function Page() {
  const { t } = useTranslation();
  const location = useLocation();

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
          title={t("dApp:title")}
          options={{
            goBack: location?.state?.title ? true : false,
            goBack_string: t(location?.state?.title),
          }}
          Input={SearchInput}
        />
      }
      content={<List />}
    />
  );
}

export default withReducer("folderApp", reducer)(Page);
