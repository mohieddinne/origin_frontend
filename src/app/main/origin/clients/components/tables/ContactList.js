import React from "react";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import Error from "@catu/components/TablesUI/Error";
import clsx from "clsx";
import ClientNumber from "../../../components/ClientNumber";
import ClientContactCard from "../../../components/ClientContactCard";
const query = gql`
  query clientContacts(
    $clientIds: [ID]
    $filters: [ArrayFilterInput]
  ) {
    clientContacts(clientIds: $clientIds, filters: $filters) {
      id
      name
      title
      position
      mobile
      email
      inactive
      client {
        NumeroClient
        NomClient
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  activeIndicator: {
    width: "10px",
    height: "10px",
  },
}));

function ContactName({ cell, row }) {
  const classes = useStyles();
  const { t } = useTranslation();
  if (!cell.value) {
    return (
      <span className="text-gray italic">{t("unspecified")}</span>
    );
  }
  return (
    <div>
      <span className="text-gray-500">
        {row.original.title + " "}
      </span>
      {cell.value}
      <span
        className={clsx(
          classes.activeIndicator,
          "inline-block rounded-full ml-4",
          {
            "bg-green": !cell.inactive,
            "bg-gray": cell.inactive,
          }
        )}
      ></span>
    </div>
  );
}

function RenderEmail({ cell }) {
  const { t } = useTranslation();
  if (!cell.value) {
    return (
      <span className="text-gray italic">{t("unspecified")}</span>
    );
  }
  const href = "mailto:" + cell.value;
  return <a href={href}>{cell.value}</a>;
}

function RenderTel({ cell }) {
  const { t } = useTranslation();
  if (!cell.value) {
    return (
      <span className="text-gray italic">{t("unspecified")}</span>
    );
  }
  const href = "tel:" + cell.value;
  return <a href={href}>{cell.value}</a>;
}

function RenderClientCell({ cell }) {
  const { t } = useTranslation();
  if (!cell.value) {
    return (
      <span className="text-gray italic">{t("unspecified")}</span>
    );
  }

  const client = cell.value;

  return (
    <ClientNumber id={client.NumeroClient} value={client.NomClient} />
  );
}

function ContactList({ clientId }) {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useQuery(query, {
    variables: { clientIds: clientId },
  });
  const columns = React.useMemo(
    () => [
      {
        Header: t("cApp:contacts.name"),
        accessor: "name",
        sortable: true,
        Cell: ContactName,
      },
      {
        Header: t("cApp:contacts.position"),
        accessor: "position",
        sortable: true,
      },
      {
        Header: t("cApp:contacts.company"),
        accessor: "client",
        sortable: true,
        Cell: RenderClientCell,
      },
      {
        Header: t("cApp:contacts.mobile"),
        accessor: "mobile",
        sortable: true,
        Cell: RenderTel,
      },
      {
        Header: t("cApp:contacts.email"),
        accessor: "email",
        sortable: true,
        Cell: RenderEmail,
      },
    ],
    [t]
  );
  let contacts = [];
  if (data && data.clientContacts) {
    contacts = data.clientContacts;
  }
  if (error) return <Error retry={refetch} />;

  return (
    <EnhancedTable
      data={contacts}
      columns={columns}
      loading={loading}
      error={error}
      dense={true}
      options={{
        refetch,
        subRow: (row) => <ClientContactCard id={row.original.id} />,
        special_filter: true,
      }}
    />
  );
}
export default ContactList;
