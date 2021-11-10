import React from "react";
import { FusePageCarded } from "@fuse";
import ListHeader from "@catu/components/HeaderList";
import reducer from "../store/reducer";
import withReducer from "app/store/withReducer";
import { useTranslation } from "react-i18next";
import SearchInput from "../components/SearchInput";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import HolidayList from "../components/tables/Holidays";

function Page() {
  const { t } = useTranslation();
  const url = "/admin/home";

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        contentCard: "rounded-8 overflow-hidden",
        contentWrapper: "mb12",
      }}
      header={
        <ListHeader
          icon="books"
          title={t("holidays:holiday", { count: 2 })}
          Input={SearchInput}
          options={{
            goBack: true,
            defaultGoBackLink: url,
            goBack_string: "Administration ",
          }}
          actions={[
            <Button
              component={Link}
              to="/app/holidays/item/new"
              className="whitespace-nowrap normal-case"
              variant="contained"
              color="secondary"
              disableElevation
            >
              <span className="hidden sm:flex">
                {t("holidays:new_holiday")}
              </span>
              <span className="flex sm:hidden">{t("new")}</span>
            </Button>,
          ]}
        />
      }
      content={<HolidayList />}
    />
  );
}

export default withReducer("HolidaysApp", reducer)(Page);
