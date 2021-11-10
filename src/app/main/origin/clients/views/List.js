import React from "react";
// import Button from "@material-ui/core/Button";
import { FusePageCarded } from "@fuse";
import List from "../components/tables/List";
// import { Link } from "react-router-dom";
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
          title={t("cApp:title")}
          /*actions={[
            <Button
              component={Link}
              to="/clients/item/new"
              className="whitespace-nowrap normal-case"
              variant="contained"
              color="secondary"
            >
              <span className="hidden sm:flex">{t("cApp:create_new_client")}</span>
            </Button>,
          ]}*/
          Input={SearchInput}
        />
      }
      content={<List />}
    />
  );
}
export default withReducer("clientApp", reducer)(Page);
