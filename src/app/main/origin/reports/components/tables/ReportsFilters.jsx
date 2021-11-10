import { useQuery, gql } from "@apollo/client";
import FuseUtils from "@fuse/FuseUtils";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const query = gql`
  query filterReport {
    filterReport {
      name
      data {
        name
        value
        actif
      }
    }
  }
`;

function ReportsFiltersQueryHandler(props) {
  const { t } = useTranslation();
  const hasAccess = FuseUtils.hasPermission({
    slug: "reports-tec",
    permission: "can_view",
  });

  const { loading, data, error } = useQuery(query, {
    variables: { slugs: ["staff"] },
    skip: !hasAccess,
  });

  let employees = [
    { name: t("Reports:every_user"), value: "every_user", actif: 1 },
  ];
  if (data && data.filterReport) {
    employees.push(...data.filterReport[0].data);
  }

  if (!hasAccess) return null;

  return (
    <ReportsFilters
      employees={employees}
      loading={loading}
      error={error}
      {...props}
    />
  );
}

function ReportsFilters(props) {
  const { t } = useTranslation();

  const { employees, loading, error, handlers, defaultUser } = props;
  const initialState = useSelector(
    ({ kpisApp }) => kpisApp?.reportFilter
  );
  const [formData, setFormData] = React.useState(initialState);

  const oVal = formData?.Responsable || [];

  const newValue = (list, value) => {
    return list.includes(value) && !oVal.includes(value);
  };

  let selectedValues = [];

  React.useEffect(() => {
    if (defaultUser && !initialState?.Responsable)
      setFormData({
        Responsable: [defaultUser],
        projectNumber: "",
      });
    else if (initialState?.Responsable) {
      setFormData({
        Responsable: initialState.Responsable,
        projectNumber: "",
      });
    }
  }, [defaultUser, initialState]);

  const handleChange = (event) => {
    let value = event.target.value;
    const name = event.target.name;
    if (!Array.isArray(value)) {
      setFormData({ ...formData, [name]: value });
      return;
    }
    if (newValue(value, "every_user")) {
      value = ["every_user"];
    } else if (newValue(value, "with_no_users")) {
      value = ["with_no_users"];
    } else {
      value = value.filter((element) => {
        return (
          !!element &&
          element !== "with_no_users" &&
          element !== "every_user"
        );
      });
    }
    selectedValues.push(value);
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div
      className="mx-16 my-0 p-8 rounded-8 shadow-none border-1 flex flex-wrap"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <FormControl
        variant="outlined"
        className="w-full mb-8 sm:w-1/2 sm:mb-0"
      >
        <InputLabel id="filters-responsable-label">
          {t("kpisApp:Responsable")}
        </InputLabel>
        <Select
          id="filters-Responsable"
          name="Responsable"
          variant="outlined"
          value={oVal}
          disabled={loading || error}
          onChange={handleChange}
          fullWidth
          label={t("kpisApp:Responsable")}
          multiple
          labelId="filters-responsable-label"
          input={
            <OutlinedInput
              value={oVal}
              labelWidth={
                (t("kpisApp:Responsable") || { length: 0 }).length * 8
              }
              id={"Responsable"}
              name={"Responsable"}
            />
          }
        >
          {(employees || []).map((item, key) => {
            return (
              <MenuItem
                className={
                  !item.actif ? "text-gray-500" : "text-black"
                }
                value={item.value}
                key={key}
                dense={true}
              >
                {item.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <div className="flex w-full sm:pl-8 sm:w-1/2 sm:mb-0">
        <TextField
          id="standard-read-"
          name="projectNumber"
          label="Numéro du dossier"
          variant="outlined"
          value={formData?.projectNumber || ""}
          onChange={(e) => handleChange(e)}
          fullWidth
        />
        <div className="pl-8">
          <Button
            variant="outlined"
            className="h-full"
            onClick={() => {
              handlers(formData, selectedValues);
            }}
          >
            {t("Reports:execute")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportsFiltersQueryHandler;
