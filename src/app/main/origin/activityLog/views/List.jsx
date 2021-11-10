import React from "react";
import { FusePageCarded } from "@fuse";
import List from "../components/tables/activityLogListUi";
import ListHeader from "@catu/components/HeaderList";
import { useTranslation } from "react-i18next";
import SearchInput from "../search";
import withReducer from "app/store/withReducer";
import reducer from "../store/reducer";

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
          icon="assignment"
          title={t("activity_log:Activity log")}
          options={{
            goBack: true,
            defaultGoBackLink: "/admin/home",
            goBack_string: "Administration ",
          }}
          Input={SearchInput}
        />
      }
      content={<List />}
    />
  );
}
export default withReducer("Activity_log_app", reducer)(Page);
