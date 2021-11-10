import React from "react";
import { useQuery, gql } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import Error from "../subrow-card/Error";
const query = gql`
  query clientContact($ids: [ID]) {
    clientContact(ids: $ids) {
      title
      name
      position
      jobTitle
      address
      city
      zip
      email
      phone
      mobile
      homeTel
      otherTel
      fax
      comments
    }
  }
`;
const useStyles = makeStyles({
  root: {
    background: "#f4f4f4",
  },
});
function Contacts(props) {
  const { t } = useTranslation();

  const ids = props.ids;
  const classes = useStyles();
  const { data, loading, error, refetch } = useQuery(query, {
    variables: { ids },
  });

  const columnscontact = React.useMemo(
    () => [
      {
        Header: t("dApp:contact.gretting"),
        accessor: "title",
        sortable: true,
        width: "10%",
      },
      {
        Header: t("dApp:contact.name"),
        accessor: "name",
        sortable: true,
        width: "10%",
      },
      {
        Header: t("dApp:contact.email"),
        accessor: "email",
        sortable: true,
      },
      {
        Header: t("dApp:contact.phone"),
        accessor: "phone",
        sortable: true,
        width: "15%",
      },
      {
        Header: t("dApp:contact.mobile"),
        accessor: "mobile",
        sortable: true,
      },
      {
        Header: t("dApp:contact.homeTel"),
        accessor: "homeTel",
        sortable: true,
      },
      {
        Header: t("dApp:contact.otherTel"),
        accessor: "otherTel",
        sortable: true,
      },
      {
        Header: t("dApp:contact.fax"),
        accessor: "fax",
        sortable: true,
      },
      {
        Header: t("dApp:contact.position"),
        accessor: "position",
        sortable: true,
      },
    ],
    [t]
  );
  let items = [];
  if (data && Array.isArray(data.clientContact)) {
    items = data.clientContact;
  }
  if (error) return <Error retry={refetch} />;

  return (
    <EnhancedTable
      classesNames={classes.root}
      loading={loading}
      columns={columnscontact}
      data={items}
      footer={true}
      selectable={false}
    />
  );
}
export default Contacts;
