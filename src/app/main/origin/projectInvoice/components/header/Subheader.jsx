import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useQuery, gql } from "@apollo/client";
import LinearProgress from "@material-ui/core/LinearProgress";
import ErrorComponent from "@catu/components/Error";
import { useTranslation } from "react-i18next";
import { CheckboxFormsy } from "@fuse";
import Formsy from "formsy-react";
import SecondaryText from "@catu/components/SecondaryText";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";

const query = gql`
  query report_TEC($projectNumber: ID) {
    report_TEC(projectNumber: $projectNumber) {
      employee
      folderId
      nextActivityDate
      lastActivityDate
      mandateDate
      deliveryDate
      refrence
      invoiceAmount
      budget
      specimen
      stats
      totalAmount
      toComplete
      redFlag
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  headerField: {
    "@media screen and (min-width: 320px)": {},
  },
  disabledInput: {
    "& .MuiInputBase-root.Mui-disabled": {
      color: "#2196F3",
    },
  },
}));

function Subheader({ checked, setChecked, NumeroDossier }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const { data, loading, error } = useQuery(query, {
    variables: {
      projectNumber: NumeroDossier,
    },
  });
  let item = null;
  if (data) {
    if (data.report_TEC && data.report_TEC[0])
      item = data.report_TEC[0];
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <>
      {loading ? (
        <div className="flex p-8 mb-16 flex-1 flex-col items-center justify-center h-full">
          <Typography className="text-14 mb-8" color="textSecondary">
            {t("loading")}
          </Typography>
          <LinearProgress className="w-xs" color="secondary" />
        </div>
      ) : (
        <div className="flex flex-wrap p-8 justify-between w-full items-center">
          <div
            style={{ alignItems: "baseline" }}
            className={clsx(
              classes.headerField,
              "md:w-1/5 flex my-4"
            )}
          >
            <Typography className="px-4" variant="h6">
              {t("activities:form.budget")}:
            </Typography>
            {item?.budget ? (
              <Typography variant="subtitle1" className="px-4">
                <MoneyFormatter data={item.budget} />
              </Typography>
            ) : (
              <SecondaryText
                className="px-4"
                text={t("not_defined")}
              />
            )}
          </div>
          <div
            style={{ alignItems: "baseline" }}
            className={clsx(
              classes.headerField,
              "md:w-1/5 flex my-4"
            )}
          >
            <Typography className="px-4" variant="h6">
              {t("activities:affected_invoice")}:
            </Typography>
            {item?.invoiceAmount ? (
              <Typography variant="subtitle1" className="px-4">
                <MoneyFormatter data={item.invoiceAmount} />
              </Typography>
            ) : (
              <SecondaryText
                className="px-4"
                text={t("not_defined")}
              />
            )}
          </div>
          <div
            style={{ alignItems: "baseline" }}
            className={clsx(
              classes.headerField,
              "md:w-1/5 flex my-4"
            )}
          >
            <Typography className="px-4" variant="h6">
              {t("projectInvoice:tec_value")}:
            </Typography>
            {item?.totalAmount ? (
              <Typography variant="subtitle1" className="px-4">
                <MoneyFormatter data={item.totalAmount} />
              </Typography>
            ) : (
              <SecondaryText
                className="px-4"
                text={t("not_defined")}
              />
            )}
          </div>
          <div
            style={{ alignItems: "baseline" }}
            className={clsx(
              classes.headerField,
              "md:w-1/5 flex my-4"
            )}
          >
            <Typography className="px-4" variant="h6">
              {t("projectInvoice:rest")}:
            </Typography>
            {item?.toComplete ? (
              <Typography variant="subtitle1" className="px-4">
                <MoneyFormatter data={item.toComplete} />
              </Typography>
            ) : (
              <SecondaryText
                className="px-4"
                text={t("not_defined")}
              />
            )}
          </div>

          <Formsy
            variant="outlined"
            className={clsx(classes.headerField, "md:w-1/5 my-4")}
          >
            <CheckboxFormsy
              label={t("projectInvoice:close_folder")}
              validationErrors={{
                required: t("error.form.required"),
              }}
              onChange={handleChange}
              id="daysWithoutActivity"
              name="daysWithoutActivity"
              variant="outlined"
              value={checked}
            />
          </Formsy>
        </div>
      )}
    </>
  );
}

export default Subheader;
