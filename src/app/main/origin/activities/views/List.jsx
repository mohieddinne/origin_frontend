import React from "react";
import { FusePageCarded } from "@fuse";
import List from "../components/tables/Activities";
import ListHeader from "@catu/components/HeaderList";
import { useTranslation } from "react-i18next";
import SearchInput from "../components/SearchInput";
import reducer from "../store/reducer";
import withReducer from "app/store/withReducer";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

function Page() {
  const { t } = useTranslation();
  const location = useLocation();

  const actions =
    process.env.NODE_ENV !== "production"
      ? [
          <>
            <Button
              component={Link}
              className="block md:hidden whitespace-nowrap normal-case "
              style={{ minWidth: 26 }}
              to="/app/activities/item/new"
              variant="contained"
              color="secondary"
              disableElevation
            >
              <AddIcon style={{ fontSize: 26 }} />
            </Button>
            <Button
              component={Link}
              to="/app/activities/item/new"
              className="hidden md:block whitespace-nowrap normal-case"
              variant="contained"
              color="secondary"
              disableElevation
            >
              <span className="hidden sm:flex">
                {t("activities:new_activity_title")}
              </span>
            </Button>
          </>,
        ]
      : [];

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
          icon="assignment"
          title={t("activities:title")}
          options={{
            goBack: location?.state?.filters ? true : false,
            goBack_string: t("dashboard"),
          }}
          Input={SearchInput}
          actions={actions}
        />
      }
      content={<List />}
    />
  );
}
export default withReducer("activityApp", reducer)(Page);
