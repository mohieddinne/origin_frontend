import React from "react";
import { useTranslation } from "react-i18next";
import PercentFormatter from "@catu/components/formatters/PercentFormatter";
import ClientNumber from "app/main/origin/components/ClientNumber";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

function ClientsTable(props) {
  const { t } = useTranslation();
  const data = props.data || [];
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>
            {t("customer", { count: data.length })}
          </TableCell>
          <TableCell>
            {t("dApp:insurer", { count: data.length })}
          </TableCell>
          <TableCell>{t("NumeroPolice")}</TableCell>
          <TableCell align="center">{t("risque")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => {
          return (row.insurers || []).map((insurer, key) => (
            <TableRow key={insurer.NumeroAssureur}>
              {key === 0 && (
                <TableCell
                  component="th"
                  scope="row"
                  rowSpan={row.insurers.length}
                >
                  <ClientNumber
                    value={row.NomClient}
                    id={row.NumeroClient}
                  />
                  <div className="opacity-50 text-xs">
                    Ref. # <ClientNumber id={row.NumeroClient} />
                  </div>
                </TableCell>
              )}
              <TableCell>
                <ClientNumber
                  value={insurer.NomAssureur}
                  id={insurer.NumeroAssureur}
                />
                <div className="opacity-50 text-xs">
                  Ref. # <ClientNumber id={insurer.NumeroAssureur} />
                </div>
              </TableCell>
              <TableCell>{insurer.NumeroPolice || "--"}</TableCell>
              <TableCell align="center">
                <PercentFormatter data={insurer.PourcentageRisque} />
              </TableCell>
            </TableRow>
          ));
        })}
      </TableBody>
    </Table>
  );
}
export default ClientsTable;
