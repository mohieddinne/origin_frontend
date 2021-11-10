import { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import Divider from "@material-ui/core/Divider";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import ClosingDateTag from "../../../../folders/components/ClosingDateTag";

const query = gql`
  query folders($ids: [ID]) {
    folders(ids: $ids) {
      NumeroDossier
      Reference
      Commentaire
      NomContact
      Responsable
      NomAssure
      DateLivraison
      DatePerte
      DateFerme
      RecuPar
      MontantPerte
      Budget
      HeurePerte
      AdressePerte
      VillePerte
      CodePostalPerte
      TypeDePerte
    }
  }
`;

export default function ViewFolderButton(props) {
  const { t } = useTranslation("dApp");
  const { id } = props;

  const [open, setOpen] = useState(false);

  const { data, loading } = useQuery(query, {
    variables: { ids: [id] },
    skip: !id,
  });

  const item = data?.folders[0] || null;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const houresFmtr = (_date) => {
    const date = new Date(_date);
    const h = ("0" + date.getUTCHours()).slice(-2);
    const m = ("0" + date.getUTCMinutes()).slice(-2);
    return `${h}:${m}`;
  };

  if (!id) return null;

  return (
    <>
      <IconButton
        variant="outlined"
        onClick={handleOpen}
        disabled={loading}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        classes={{ paper: "p-24 flex flex-col gap-16" }}
      >
        {loading ? (
          t("loading")
        ) : (
          <>
            <div className="flex flex-col gap-8">
              <div className="text-gray-500">
                {t("dApp:reference")}:
              </div>
              <div className="font-bold text-lg leading-tight mb-2">
                {item?.Reference}
              </div>
              <div className="w-full">
                <span className="text-gray-700 mr-4">
                  # {item?.NumeroDossier}
                </span>
                <ClosingDateTag date={item?.DateFerme} />
              </div>
            </div>
            <Divider className="w-full" />
            <div className="flex flex-col gap-8">
              <div className="w-full">
                <span className="text-gray-700">
                  {t("RecuPar")}:{" "}
                </span>
                <span>{item?.RecuPar}</span>
              </div>
              <div className="w-full">
                <span className="text-gray-700">
                  {t("responsable")}:{" "}
                </span>
                <span>{item?.Responsable}</span>
              </div>
              <div className="w-full">
                <span className="text-gray-700">
                  {t("contact_name")}:{" "}
                </span>
                <span>{item?.NomContact}</span>
              </div>
              <div className="w-full">
                <span className="text-gray-700">
                  {t("comment")}:{" "}
                </span>
                <span>
                  {item?.Commentaire || t("translation:unspecified")}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <Divider className="w-full" />
              <h6 className="font-bold text-lg leading-tight md:leading-normal">
                {t("losses_details")}:
              </h6>
              <Divider className="w-full" />
            </div>

            <div className="flex flex-col gap-8">
              <div className="w-full">
                <span className="text-gray-700">
                  {t("TypeDePerte")}:{" "}
                </span>
                <span>{item?.TypeDePerte}</span>
              </div>
              <div className="w-full">
                <span className="text-gray-700">
                  {t("montant_perte")}:{" "}
                </span>
                <MoneyFormatter data={item?.MontantPerte} digit={0} />
              </div>
              <div className="w-full">
                <span className="text-gray-700">
                  {t("DatePerte")}:{" "}
                </span>
                <DateFormatter date={item?.DatePerte} />
                {item?.HeurePerte &&
                  " " + houresFmtr(item?.HeurePerte)}
              </div>
              <div className="w-full">
                <span className="text-gray-700">
                  {t("loss_address")}:{" "}
                </span>
                <address className="not-italic inline">
                  {item?.AdressePerte}
                  {item?.VillePerte && `, ${item?.VillePerte}`}
                  {item?.CodePostalPerte &&
                    `, ${item?.CodePostalPerte}`}
                  {(item?.AdressePerte ||
                    item?.VillePerte ||
                    item?.CodePostalPerte) &&
                    `, Canada`}
                  {!item?.AdressePerte &&
                    !item?.VillePerte &&
                    !item?.CodePostalPerte &&
                    t("no_.address")}
                </address>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
}
