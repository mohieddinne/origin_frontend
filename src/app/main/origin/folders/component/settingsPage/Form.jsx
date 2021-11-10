import React, { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useTranslation } from "react-i18next";
import Formsy from "formsy-react";
import { TextFieldFormsy, SelectFormsy, CheckboxFormsy } from "@fuse";
import Button from "@material-ui/core/Button";
import Checkboxheader from "./Checkboxheader";
import RadioGrouheader from "./RadioGrouheader";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import SecondaryText from "@catu/components/SecondaryText";
import { useQuery, gql } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  TextField: {
    "@media screen and (min-width: 320px)": {
      width: "100%",
    },
  },
}));

const mentorsQuery = gql`
  query filters($slugs: [String]) {
    filters(slugs: $slugs) {
      name
      data {
        name
        value
        id
      }
    }
  }
`;

function Form({ setFormRef, handleSubmit, data, loading }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const params = useParams();

  const {
    loading: mentorLoading,
    data: mentorsData,
    error,
  } = useQuery(mentorsQuery, {
    variables: { slugs: ["mentors"] },
  });

  const processSelectOptions = [
    {
      value: 1,
      name: t(
        "dApp:invoice_setting.process_options.resposible_first"
      ),
    },
    {
      value: 2,
      name: t("dApp:invoice_setting.process_options.experts_first"),
    },
    {
      value: 3,
      name: t(
        "dApp:invoice_setting.process_options.facturation_first"
      ),
    },
  ];

  const NumeroDossier = params.id;
  const [isFormValid, setIsFormValid] = useState(true);
  const [isSupervised, setSupervised] = useState(false);

  React.useEffect(() => {
    setSupervised(data?.settings?.isMentor);
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center h-full p-32">
        <Typography className="text-20 mb-16" color="textSecondary">
          {t("loading")}
        </Typography>
        <LinearProgress className="w-xs" color="secondary" />
      </div>
    );
  }
  return (
    <Formsy
      ref={setFormRef}
      className="flex flex-wrap w-full p-10"
      onValidSubmit={handleSubmit}
      onValid={() => {
        if (!isFormValid) {
          setIsFormValid(true);
        }
      }}
      onInvalid={() => {
        if (isFormValid) {
          setIsFormValid(false);
        }
      }}
    >
      <TextFieldFormsy
        id="id"
        name="id"
        type="hidden"
        value={data?.settings.id}
      />
      <div
        style={{ alignItems: "baseline" }}
        className={clsx(
          "flex w-full items-baseline sm:pl-8 sm:w-1/2 sm:mb-0 "
        )}
      >
        <Typography className="px-4" variant="h6">
          {t("dApp:responsable")}:
        </Typography>
        {data?.Responsable ? (
          <Typography variant="subtitle1" className="px-4">
            {data.Responsable}
          </Typography>
        ) : (
          <SecondaryText className="px-4" text={t("not_defined")} />
        )}
      </div>

      <div
        style={{ alignItems: "baseline" }}
        className={clsx(
          "flex w-full items-baseline sm:pl-8 sm:w-1/2 sm:mb-0 "
        )}
      >
        <Typography className="px-4" variant="h6">
          {t("cApp:NumeroDossier")}:
        </Typography>
        {NumeroDossier ? (
          <Typography variant="subtitle1" className="px-4">
            {NumeroDossier}
          </Typography>
        ) : (
          <SecondaryText className="px-4" text={t("not_defined")} />
        )}
      </div>
      <Checkboxheader data={data?.settings} />
      <RadioGrouheader data={data?.settings} />
      <div className="flex flex-wrap w-full justify-between">
        <Typography
          variant="subtitle1"
          color="inherit"
          className={clsx(classes.TextField, "md:w-1/2 mt-8")}
        >
          {t("dApp:invoice_setting.invoice_process")}
        </Typography>
        <SelectFormsy
          className={clsx(classes.TextField, "md:w-1/3 mt-8 ")}
          fullWidth
          autoWidth
          variant="outlined"
          name="submissionProcess"
          id="niveau"
          value={
            data?.settings?.submissionProcess
              ? data.settings.submissionProcess
              : 1
          }
          label={t("dApp:invoice_setting.invoice_process")}
          required
        >
          {processSelectOptions &&
            processSelectOptions.map((el) => {
              return (
                <MenuItem key={el.value} value={el.value}>
                  {el.name}
                </MenuItem>
              );
            })}
        </SelectFormsy>
      </div>
      <div className="flex flex-wrap w-full justify-between">
        <CheckboxFormsy
          value={isSupervised}
          className={clsx(classes.TextField, "md:w-1/2")}
          label={t("dApp:invoice_setting.mentor_supervised")}
          onChange={() => {
            setSupervised(!isSupervised);
          }}
          validationErrors={{
            required: t("error.form.required"),
          }}
          id="file_supervised_by_mentor"
          name="isMentor"
        />
        {mentorLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center h-full">
            <Typography
              className="text-14 mb-8"
              color="textSecondary"
            >
              {t("inputModuleApp:loading_types_parts")}
            </Typography>
            <LinearProgress className="w-xs" color="secondary" />
          </div>
        ) : (
          <SelectFormsy
            className={clsx(classes.TextField, "md:w-1/3 mt-8")}
            fullWidth
            disabled={!isSupervised || error}
            autoWidth
            variant="outlined"
            name="mentor"
            id="niveau"
            label={t("dApp:invoice_setting.mentor_selection")}
            required={isSupervised}
            value={data?.settings?.mentor}
          >
            {Array.isArray(mentorsData?.filters[0]?.data) &&
              mentorsData?.filters[0].data.map((el) => {
                return (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                );
              })}
          </SelectFormsy>
        )}
      </div>
      <div className="w-full flex justify-evenly p-10">
        <Button
          variant="contained"
          color="primary"
          className="py-2 "
          onClick={() => {
            //TODO add history.push return
          }}
        >
          {t("activities:form.reset")}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          aria-label="submit"
          id="submit"
          disabled={!isFormValid}
          value=""
        >
          {t("button.i_confirm")}
        </Button>
      </div>
    </Formsy>
  );
}

export default Form;
