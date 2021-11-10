import React, { useState } from "react";
import { TextFieldFormsy, CheckboxFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import InputAdornment from "@material-ui/core/InputAdornment";

const useStyles = makeStyles((theme) => ({
  Checkbox: {
    "@media screen and (min-width: 320px)": {
      width: "100%",
    },
  },
}));

function Checkboxheader({ data }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [withoutActivity, setWithoutActivity] = useState(true);
  const [minimumBudget, setMinimumBudget] = useState(true);

  React.useEffect(() => {
    if (data?.id) {
      setWithoutActivity(data?.daysWithoutActivity);
      setMinimumBudget(data?.budgetBeforeFirstInvoice);
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-wrap w-full justify-between mt-8">
        <CheckboxFormsy
          className={clsx(classes.Checkbox, "md:w-1/2")}
          label={t("dApp:invoice_setting.generate_by_idle_days")}
          validationErrors={{
            required: t("error.form.required"),
          }}
          onChange={() => setWithoutActivity(!withoutActivity)}
          id="daysWithoutActivity"
          name="daysWithoutActivity"
          variant="outlined"
          value={withoutActivity}
        />
        <TextFieldFormsy
          className={clsx(classes.Checkbox, "md:w-1/3 mt-8")}
          label={t("dApp:invoice_setting.days")}
          validations={{
            isInt: true,
            matchRegexp: /^\d+$/,
          }}
          validationErrors={{
            required: t("error.form.required"),
            isInt: t("error.form.value_not_supported"),
            matchRegexp: t("error.form.value_not_supported"),
          }}
          type="number"
          required={withoutActivity}
          disabled={!withoutActivity}
          id="nbrDaysWithoutActivity"
          name="nbrDaysWithoutActivity"
          variant="outlined"
          value={
            data?.nbrDaysWithoutActivity
              ? data?.nbrDaysWithoutActivity
              : ""
          }
        />
      </div>
      <div className="flex flex-wrap w-full justify-between">
        <CheckboxFormsy
          className={clsx(classes.Checkbox, "md:w-1/2")}
          label={t("dApp:invoice_setting.generate_by_purcentage")}
          validationErrors={{
            required: t("error.form.required"),
          }}
          onChange={() => setMinimumBudget(!minimumBudget)}
          id="budgetBeforeFirstInvoice"
          name="budgetBeforeFirstInvoice"
          variant="outlined"
          value={minimumBudget}
        />
        <TextFieldFormsy
          className={clsx(classes.Checkbox, "md:w-1/3 mt-8")}
          label={t("dApp:invoice_setting.budget_purcentage")}
          validations={{
            isFloat: true,
            matchRegexp: /^100$|^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,3}$/,
          }}
          validationErrors={{
            required: t("error.form.required"),
            isFloat: t("error.form.value_not_supported"),
            matchRegexp: t("error.form.value_not_supported"),
          }}
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">%</InputAdornment>
            ),
          }}
          required={minimumBudget}
          disabled={!minimumBudget}
          id="minBudgetBeforeFirstInvoice"
          name="minBudgetBeforeFirstInvoice"
          variant="outlined"
          value={
            data?.minBudgetBeforeFirstInvoice
              ? data?.minBudgetBeforeFirstInvoice
              : ""
          }
        />
      </div>
    </>
  );
}

export default Checkboxheader;
