import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import { gql, useLazyQuery } from "@apollo/client";
import ViewFolderButton from "./ViewFolderButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ListboxComponent from "@catu/components/formsy/Autocomplete/VirtualizedListboxComponent";
import { withFormsy } from "formsy-react";
import FormContext from "../Context";
import clsx from "clsx";

const LOCALSTORAGE_KEY = "tkr_actfrm_folder";

const FOLDERS_QUERY = gql`
  query filtersActivity($search: String) {
    filtersActivity(slugs: [FOLDERS], search: $search) {
      name
      data {
        id
        ... on ActivityFilterFolder {
          budget
          consummated
        }
      }
    }
  }
`;

function Project(props) {
  const { t } = useTranslation("activities");
  const value = props.value || "";
  const errorMessage = props.errorMessage;
  const { setFolder } = useContext(FormContext);

  const [keyword, setKeyWord] = useState("");

  const [search, { loading, data: reponse }] = useLazyQuery(
    FOLDERS_QUERY,
    { fetchPolicy: "no-cache" }
  );

  useEffect(() => {
    if (keyword === "" || keyword === value) return;
    const handler = setTimeout(() => {
      search({ variables: { search: keyword } });
    }, 500);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, value]);

  useEffect(() => {
    if (props.disabled) {
      props.setValue("");
    } else {
      const _search = value || props.defaultValue;
      if (!value && props.defaultValue)
        props.setValue(props.defaultValue);
      if (_search) search({ variables: { search: _search } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.disabled]);

  let items = [];
  if (reponse?.filtersActivity[0]?.data) {
    items = [...items, ...reponse?.filtersActivity[0]?.data];
  }

  const handleChange = (event, newValue) => {
    props.setValue(newValue);
    localStorage.setItem(LOCALSTORAGE_KEY, newValue);
    if (typeof props.onChange === "function") {
      props.onChange(event, newValue);
    }
  };

  // Selected folder
  let sFolder = null;
  if (value) {
    sFolder = items.find((e) => e.id === value) || null;
    setFolder(sFolder)
  }

  return (
    <div className="flex flex-wrap sm:flex-nowrap w-full">
      <Autocomplete
        options={[...items].map((e) => {
          return e.id;
        })}
        className="w-full sm:w-2/5"
        loading={loading}
        value={value}
        autoComplete
        disabled={props.disabled}
        required={props.required}
        onChange={handleChange}
        ListboxComponent={ListboxComponent}
        onInputChange={(event, newInputValue) => {
          setKeyWord(newInputValue);
        }}
        loadingText={t("translation:loading")}
        noOptionsText={t(
          `translation:form.autocomplete.${
            reponse && keyword ? "no_data" : "please_search"
          }`
        )}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              variant="outlined"
              required={props.required}
              label={t("folder_number")}
              error={Boolean(errorMessage)}
              helperText={errorMessage}
              inputProps={{
                ...params.inputProps,
                autoComplete: "none",
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                    {value ? <ViewFolderButton id={value} /> : null}
                  </>
                ),
              }}
            />
          );
        }}
      />
      <div
        className={clsx(
          "bg-gray-100 rounded-b-xl flex mx-auto sm:w-3/5 sm:h-auto sm:my-8 sm:rounded-r-xl sm:rounded-l-none",
          { "opacity-50": props.disabled }
        )}
      >
        <div className="flex flex-wrap justify-evenly gap-8 p-8 h-auto sm:items-center sm:w-full">
          <div className="py-0">
            <span className="text-gray-700">
              {t("form.total_seizure")}:
            </span>
            <span className="pl-4">
              <MoneyFormatter
                className={
                  sFolder?.budget > sFolder?.consummated
                    ? "text-red-600"
                    : "text-gray-900"
                }
                data={sFolder?.consummated || 0}
                digit={0}
              />
            </span>
          </div>
          <div className="py-0">
            <span className="text-gray-700">{t("form.budget")}:</span>
            <span className="pl-4">
              <MoneyFormatter
                className="text-gray-900"
                data={sFolder?.budget || 0}
                digit={0}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
const ProjectFormsy = React.memo(withFormsy(Project));

function FolderWrapper(props) {
  const lsFolderId = localStorage.getItem(LOCALSTORAGE_KEY);
  const { usedOnFolder } = useContext(FormContext);

  return (
    <ProjectFormsy
      {...props}
      defaultValue={lsFolderId || ""}
      disabled={!usedOnFolder}
      required={usedOnFolder}
    />
  );
}

export default FolderWrapper;
