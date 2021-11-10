import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Divider from "@material-ui/core/Divider";
import { withRouter } from "react-router-dom";
import * as Actions from "../../store/actions";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import { TextFieldFormsy, SelectFormsy } from "@fuse";
import Formsy from "formsy-react";
import ClosingDateTag from "../../components/ClosingDateTag";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query report_TEC($projectNumber: ID) {
    report_TEC(projectNumber: $projectNumber) {
      invoiceAmount
      totalAmount
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "50px 20px",
    textAlign: "center",
    "& > div": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Folder(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ID = props.match.params.id;

  const { data, loading, isEditable, offices } = useSelector(
    ({ folderApp }) => {
      return {
        isEditable: folderApp.form.isEditable,
        loading: folderApp.form.loading,
        data: folderApp.form.data,
        offices: folderApp.form.offices,
      };
    }
  );
  const projectNumber = data?.NumeroDossier;

  const { data: datareport, loading: reportLoading } = useQuery(
    query,
    {
      variables: {
        projectNumber,
      },
    }
  );

  const houresFmtr = (date) => {
    let d = new Date(date);
    let H = d.getUTCHours();
    let M = d.getUTCMinutes();
    let HH = ("0" + H).slice(-2);
    let MM = ("0" + M).slice(-2);
    return HH + ":" + MM;
  };

  useEffect(() => {
    dispatch(Actions.getFolder([ID]));
    dispatch(Actions.getOffices());
  }, [ID, dispatch]);

  const {
    NumeroDossier,
    RecuPar,
    Responsable,
    Bureau,
    Repertoire,
    // TelephonerPourRDV,
    Budget,
    // TempsEstime,
    MontantPerte,
    TypeDePerte,
    HeurePerte,
    Reference,
    DatePerte,
    AdressePerte,
    VillePerte,
    CodePostalPerte,
    DescriptionMandat,
    AutresDirectives,
    DateFerme,
    TypeBatiment,
    DateMandat,
    HeureMandat,
    DateLivraison,
    // DateRDV,
    Commentaire,
    NomContact,
  } = data || {};

  if (loading)
    return (
      <div className={classes.root}>
        {t("loading")}
        <LinearProgress variant="query" />
      </div>
    );

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <div className="w-full mb-16">
          <span className="text-gray-500">
            {t("dApp:reference")}:
          </span>
          <div className="font-bold text-lg mb-6 leading-tight md:leading-normal">
            {Reference}
          </div>
          <span className="text-gray-700 mr-4">
            # {NumeroDossier}
          </span>
          <ClosingDateTag date={DateFerme} />
        </div>
      </div>

      <div className="w-full mb-16">
        <Divider />
      </div>

      <div className="flex flex-wrap w-full sm:w-1/2 pr-0 sm:pr-32 self-start">
        <div className="w-full md:w-1/2 mb-8">
          <span className="text-gray-500">{t("dApp:RecuPar")}:</span>{" "}
          <span>{RecuPar}</span>{" "}
        </div>
        <div className="w-full md:w-1/2 mb-8">
          <span className="text-gray-500">
            {t("dApp:responsable")}:
          </span>{" "}
          <span>{Responsable}</span>{" "}
        </div>
        {isEditable ? (
          <Formsy ref={props.setFormRef} className="mt-8 w-full">
            <TextFieldFormsy
              type="hidden"
              id="id"
              name="NumeroDossier"
              value={ID ? ID : null}
            />
            <SelectFormsy
              id="folder-office"
              value={Bureau}
              name="Bureau"
              label={t("dApp:office")}
              disabled={loading}
              className="w-full"
              variant="outlined"
            >
              <MenuItem value="">{t("none")}</MenuItem>
              {offices.map((item, key) => (
                <MenuItem value={item} key={key}>
                  {item}
                </MenuItem>
              ))}
            </SelectFormsy>
          </Formsy>
        ) : (
          Bureau && (
            <div className="w-full mb-8">
              <span className="text-gray-500">
                {t("dApp:office")}:
              </span>{" "}
              <span>{Bureau}</span>
            </div>
          )
        )}
        <div className="w-full mb-8">
          <span className="text-gray-500">
            {t("dApp:contact_name")} :{" "}
          </span>
          <span>{NomContact}</span>
        </div>
        <div className="w-full mb-8">
          <span className="text-gray-500">
            {t("dApp:comment")} :{" "}
          </span>
          <span>{Commentaire}</span>
        </div>
        <div className="w-full  my-8">
          <span className="text-gray-500">
            {t("dApp:type_of_building")} :
          </span>{" "}
          <span>{TypeBatiment}</span>
        </div>
        <div className="w-full mb-8">
          <span className="text-gray-500">
            {t("dApp:repertoire")}:
          </span>{" "}
          <span>{Repertoire}</span>
        </div>

        {/* <div className="w-full font-bold my-8">
          {t("dApp:meeting_details")}
        </div>
        <div className="w-full md:w-1/2">
          <span className="text-gray-500">
            {t("dApp:call_for_meeting")}:{" "}
          </span>
          <YesOrNo call={TelephonerPourRDV} />
        </div>
        <div className="w-full md:w-1/2">
          <span className="text-gray-500">
            {t("dApp:meeting_date")}:
          </span>{" "}
          <DateFormatter date={DateRDV} />
        </div> */}
      </div>

      <div className="flex flex-wrap flex-col w-full sm:w-1/2 pl-0 sm:pl-8 pr-0 sm:pr-32 self-start">
        <div className="flex flex-wrap flex-row w-full">
          <div className="w-full mb-16">
            <h6 className="font-bold text-lg mb-6 leading-tight md:leading-normal">
              {t("dApp:losses_details")}:
            </h6>
          </div>
          <div className="w-full md:w-1/2 mb-8">
            <span className="text-gray-500">
              {t("dApp:montant_perte")}:{" "}
            </span>
            <MoneyFormatter data={MontantPerte} digit={0} />
          </div>
          <div className="w-full md:w-1/2 mb-8">
            <span className="text-gray-500">
              {t("dApp:DatePerte")}:{" "}
            </span>
            <DateFormatter date={DatePerte} />
            {HeurePerte && " " + houresFmtr(HeurePerte)}
          </div>

          <div className="w-full mb-8">
            <span className="text-gray-500">
              {t("dApp:loss_address")}:{" "}
            </span>
            <address className="not-italic">
              {AdressePerte}
              {VillePerte && `, ${VillePerte}`}
              {CodePostalPerte && `, ${CodePostalPerte}`}
              {(AdressePerte || VillePerte || CodePostalPerte) &&
                `, Canada`}
              {!AdressePerte &&
                !VillePerte &&
                !CodePostalPerte &&
                t("no_.address")}
            </address>
          </div>
          <div className="w-full md:w-1/2 mb-8">
            <span className="text-gray-500">
              {t("dApp:TypeDePerte")}:
            </span>{" "}
            <span>{TypeDePerte} </span>
          </div>
        </div>

        <div className="w-full my-16">
          <Divider />
        </div>

        <div className="flex flex-wrap flex-row w-full">
          <div className="w-full mb-8">
            <h6 className="font-bold text-lg mb-6 leading-tight md:leading-normal">
              {t("dApp:mondat_info")}:
            </h6>
          </div>
          <div className="w-full md:w-1/2 mb-8">
            <span className="text-gray-500">{t("dApp:budget")}:</span>{" "}
            <MoneyFormatter data={Budget} digit={0} />
          </div>
          <div className="w-full md:w-1/2 mb-8">
            <span className="text-gray-500">
              {t("dApp:mandate_date")}:
            </span>{" "}
            <DateFormatter date={DateMandat} />
            {HeureMandat && " " + houresFmtr(HeureMandat)}
          </div>
          <div className="w-full md:w-1/2 mb-8">
            <span className="text-gray-500">
              {t("dApp:montant_tec_current")}
            </span>
            <span>
              {reportLoading ? (
                t("dApp:montant_tec_current_loading")
              ) : datareport?.report_TEC[0]?.invoiceAmount ? (
                <MoneyFormatter
                  data={datareport?.report_TEC[0]?.invoiceAmount}
                  digit={0}
                />
              ) : (
                t("not_defined")
              )}
            </span>
          </div>
          <div className="w-full md:w-1/2 mb-8">
            <span className="text-gray-500">
              {t("dApp:date_livraison")}:{" "}
            </span>
            <DateFormatter date={DateLivraison} />
          </div>
          <div className="w-full md:w-1/2 mb-8">
            <span className="text-gray-500">
              {t("dApp:montant_tec_billed")}
            </span>
            <span>
              {reportLoading ? (
                t("dApp:montant_tec_current_loading")
              ) : datareport?.report_TEC[0]?.totalAmount ? (
                <MoneyFormatter
                  data={datareport?.report_TEC[0]?.totalAmount}
                  digit={0}
                />
              ) : (
                t("not_defined")
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full my-16">
        <Divider />
      </div>

      <div className="w-full">
        {AutresDirectives && (
          <div className="w-full">
            <div className="font-bold mb-8">
              {t("dApp:other_directives")}:
            </div>
            {AutresDirectives.split("\n").map((item, key) => {
              return (
                <p key={key} className="my-4">
                  {item}
                </p>
              );
            })}
          </div>
        )}
        <div className="w-full">
          <div className="font-bold my-8">
            {t("dApp:DescriptionMandat")}:
          </div>
          {DescriptionMandat &&
            DescriptionMandat.split("\n").map((item, key) => {
              return (
                <p key={key} className="my-4">
                  {item}
                </p>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* function YesOrNo({ call }) {
  const { t } = useTranslation();
  const text = t(call ? "yes" : "no");
  return (
    <span
      className={clsx({
        "text-white text-11 font-500 px-8 py-4 rounded-4 whitespace-nowrap mx-4": true,
        "bg-green-500": call,
        "bg-red-400": !call,
      })}
    >
      {text}
    </span>
  );
}*/

export default withRouter(Folder);
