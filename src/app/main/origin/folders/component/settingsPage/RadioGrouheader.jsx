import React, { useState } from "react";
import { Radio, FormControlLabel } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import { TextFieldFormsy, RadioGroupFormsy } from "@fuse";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  width: {
    flex: "1 0 45% ",
    marginBottom: "1rem !important",
  },
  inputMarginRight: {
    marginRight: "1rem !important",
  },
  inputMarginTop: {
    marginTop: "1rem !important",
  },
}));

function RadioGrouheader({ data }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [fields, setFields] = useState([{ value: null }]);
  const [state, setState] = useState("1");

  React.useEffect(() => {
    if (data?.id) {
      setState(data?.budgetVsTec.toString());
      if (data?.budgetVsTec === 1) {
        const __fields = data.maxPourcentagesOfBudget
          .split(",")
          .map((el) => {
            return { value: el };
          });
        setFields(__fields);
      }
    }
  }, [data]);

  function handleAdd() {
    const values = [...fields];
    values.push({ value: null });
    setFields(values);
  }

  function handleRemove(i) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  }

  return (
    <>
      <RadioGroupFormsy
        name="budgetVsTec"
        value={state}
        onChange={(ev) => {
          setState(ev.target.value);
        }}
        required
        validationErrors={{
          isDefaultRequiredValue: t("error.form.required"),
        }}
        className="w-full"
      >
        <div className={clsx("flex")}>
          <FormControlLabel
            value={"1"}
            control={<Radio color="default" />}
            label={t("dApp:invoice_setting.generate_by_purcentages")}
            labelPlacement="end"
            className="w-2/3"
          />
          <div className="w-1/3 flex justify-between flex-wrap ">
            {fields.map((field, idx) => {
              return (
                <TextFieldFormsy
                  disabled={state !== "1"}
                  key={`${field}-${idx}`}
                  label={t("dApp:budget")}
                  type="number"
                  validations={{
                    isFloat: true,
                    matchRegexp: /^100$|^[0-9]{1,2}$|^[0-9]{1,2}\.[0-9]{1,3}$/,
                  }}
                  validationErrors={{
                    required: t("error.form.required"),
                    isFloat: t("error.form.value_not_supported"),
                    matchRegexp: t("error.form.value_not_supported"),
                  }}
                  required={state === "1"}
                  id={`budgetValue[`.concat(idx).concat("]")}
                  name={`maxPourcentagesOfBudget[`
                    .concat(idx)
                    .concat("]")}
                  variant="outlined"
                  value={field.value}
                  className={clsx(
                    classes.width,
                    idx % 2 === 0 ? classes.inputMarginRight : "",
                    "md:w-1/3 mt-8"
                  )}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          disabled={state !== "1"}
                          onClick={() => handleAdd()}
                          className={classes.margin}
                          size="small"
                        >
                          <AddIcon fontSize="inherit" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        <InputAdornment position="end">
                          <InputAdornment position="end">
                            %
                          </InputAdornment>

                          <IconButton
                            disabled={state !== "1"}
                            onClick={() => handleRemove(idx)}
                            // className={classes.margin}
                            size="small"
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap w-full justify-between">
          <FormControlLabel
            value={"2"}
            className={clsx(classes.Radiobox, "md:w-1/2")}
            control={<Radio color="default" />}
            label={t("dApp:invoice_setting.generate_by_tec_value")}
            labelPlacement="end"
          />
          <TextFieldFormsy
            className={clsx(classes.Radiobox, "md:w-1/3 mt-8")}
            label={t("dApp:montant_de_TEC")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">$</InputAdornment>
              ),
            }}
            validationErrors={{
              required: t("error.form.required"),
            }}
            disabled={state !== "2"}
            required={state === "2"}
            id="maxOfTecAmount"
            name="maxOfTecAmount"
            fullWidth
            variant="outlined"
            value={data?.maxOfTecAmount ? data?.maxOfTecAmount : ""}
          />
        </div>
      </RadioGroupFormsy>
    </>
  );
}

export default RadioGrouheader;
