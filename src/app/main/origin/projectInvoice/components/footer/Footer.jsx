import React from "react";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import DateValidation from "../dialog/DateValidation";
import { useParams } from "react-router-dom";

import { useQuery, gql } from "@apollo/client";

const query = gql`
  query activitiesEmployeeExpert($folderId: ID!, $invoiceId: ID) {
    activitiesEmployeeExpert(
      folderId: $folderId
      invoiceId: $invoiceId
    ) {
      user {
        NomEmploye
        id_Emp
      }
      confirmed
    }
  }
`;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  button: {
    "@media screen and (min-width: 320px)": {
      width: "100%",
      marginTop: "20px",
    },
  },
  buttonFooter: {
    "@media screen and (min-width: 320px)": {
      width: "100%",
      marginTop: "50px",
    },
  },
}));
function Footer({ list, checked }) {
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const { folderId, invoiceId } = useParams();

  let hour = 0;
  let billableHours = 0;

  const { data } = useQuery(query, {
    variables: {
      folderId,
      invoiceId,
    },
  });
  const listexperts = data?.activitiesEmployeeExpert;

  for (const test of list || []) {
    hour += test.hours;
    billableHours += test.billableHours;
  }

  return (
    <div className="flex flex-wrap w-full p-8 justify-between">
      <div className="flex">
        <div data-col>
          <div className="my-8  px-8">
            {t("projectInvoice:total_hours")}
          </div>
          <div className="my-8 px-8">
            {t("projectInvoice:total_billable_hours")}
          </div>
        </div>
        <div className="mx-16">
          <div className=" border-2 border-black my-8 px-8 ">
            {hour.toFixed(2)}
          </div>
          <div className="border-2 border-black my-8 px-8">
            {billableHours.toFixed(2)}
          </div>
        </div>
      </div>
      <div className="p-8">
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t("projectInvoice:experts_validation")}
          </FormLabel>
          <FormGroup>
            {listexperts?.map((e, key) => (
              <FormControlLabel
                control={
                  <Checkbox
                    name={e.user.NomEmploye}
                    disabled
                    checked={e.confirmed}
                  />
                }
                label={e.user.NomEmploye}
              />
            ))}
          </FormGroup>
        </FormControl>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap justify-between  ">
          <Button
            variant="outlined"
            className={clsx(classes.button, "md:w-1/2")}
            onClick={() => {
              history.push({
                pathname: "/app/activities/item/new",
              });
            }}
          >
            {t("add")}
          </Button>
        </div>
        <div className={clsx(classes.buttonFooter, "mt-10")}>
          <DateValidation
            employeesExpert={listexperts}
            checked={checked}
          />
        </div>
      </div>
    </div>
  );
}

export default Footer;
