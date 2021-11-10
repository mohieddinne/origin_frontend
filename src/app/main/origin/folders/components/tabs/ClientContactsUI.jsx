import React from "react";
import { useParams } from "react-router-dom";
import ClientContactsTable from "../../../components/ClientContactsTable";

function ClientContactsUI() {
  const { id } = useParams();

  return <ClientContactsTable folderIds={[id]} />;
}
export default ClientContactsUI;
