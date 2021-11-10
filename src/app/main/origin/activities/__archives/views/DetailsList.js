import React from "react";
import { FusePageCarded } from "@fuse";
import List from "../components/tables/Details";
import ListHeader from "@catu/components/HeaderList";
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
          icon="assignment"
          title={t("activities:bilable_hours_title")}
          options={{
            goBack: true,
            defaultGoBackLink: "/dashboard",
            goBack_string: "Tableau de bord",
          }}
        />
      }
      content={<List />}
    />
  );
}
export default Page;
