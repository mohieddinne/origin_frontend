import React from "react";
import ActivitiesTable from "../components/tables/Actitvities";
import { useTranslation } from "react-i18next";
import CatuFilePageCarded from "@catu/components/PageLayouts/carded/CatuFilePageCarded";
import HeaderForm from "@catu/components/HeaderForm";

function Page() {
  const { t } = useTranslation();

  return (
    <>
      <CatuFilePageCarded
        classes={{
          toolbar: "p-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={
          <HeaderForm
            strings={{
              defaultTitle: t("Activities"),
              caption: t("   "),
            }}
            options={{
              showIconEditor: false,
            }}
          />
        }
        content={<ActivitiesTable />}
        innerScroll
      />
    </>
  );
}
export default Page;
