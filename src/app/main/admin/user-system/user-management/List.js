import React from "react";
import { useTranslation } from "react-i18next";
import { FusePageCarded } from "@fuse";
import withReducer from "app/store/withReducer";
import reducer from "../store/reducer";
import ListHeader from "@catu/components/HeaderList";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import SearchInput from "../components/SearchInput";
import MaterialTable from "../components/tables/MaterialsTable";

function List() {
  const { t } = useTranslation();

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        contentCard: "rounded-8",
        contentWrapper: "mb12",
      }}
      header={
        <ListHeader
          icon="listalt"
          title={t("materialsApp:title", { count: 2 })}
          actions={[
            <Button
              component={Link}
              to="/app/materials/item/new"
              className="whitespace-nowrap normal-case"
              variant="contained"
              color="secondary"
            >
              <span className="hidden sm:flex">
                {t("materialsApp:add")}
              </span>
              <span className="flex sm:hidden">
                {t("materialsApp:new")}
              </span>
            </Button>,
          ]}
          Input={SearchInput}
        />
      }
      content={<MaterialTable />}
      innerScroll
    />
  );
}

export default withReducer("materialApp", reducer)(List);
