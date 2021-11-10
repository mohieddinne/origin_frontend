import React from "react";
import { useTranslation } from "react-i18next";
import { FusePageCarded } from "@fuse";
import ListHeader from "@catu/components/HeaderList";
import InvoiceProjectContainer from "../components/tables/InvoiceProjectContainer";

function Page() {
  const { t } = useTranslation();

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72",
        contentCard: "rounded-8",
        contentWrapper: "mb12",
      }}
      header={
        <ListHeader
          icon="dashboard"
          title={t("projectInvoice:title")}
        />
      }
      content={<InvoiceProjectContainer />}
    />
  );
}

export default Page;
