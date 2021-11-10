import React from "react";
import { useParams } from "react-router-dom";
import ContactList from "../../components/tables/ContactList";

function Contacts() {
  const { id } = useParams();

  return <ContactList clientId={id} />;
}
export default Contacts;
