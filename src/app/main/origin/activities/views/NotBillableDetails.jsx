import React from "react";
import { FusePageCarded } from "@fuse";
import List from "../components/tables/NotBillableDetailsList";
import ListHeader from "@catu/components/HeaderList";

function NotBillableDetails() {
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
          title="Détail des heures non facturées"
          options={{
            goBack: true,
            defaultGoBackLink: "/app/kpis/t/dashboard",
            goBack_string: "Tableau de bord",
          }}
        />
      }
      content={<List />}
    />
  );
}
export default NotBillableDetails;
