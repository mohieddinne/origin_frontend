import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { useTranslation } from "react-i18next";
import { useQuery, gql } from "@apollo/client";
import FuseUtils from "@fuse/FuseUtils";
import { setSelectedEmployee } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";

const query = gql`
  query filters($slugs: [String]) {
    filters(slugs: $slugs) {
      name
      data {
        name
        value
        actif
        id
      }
    }
  }
`;

function DashboardFilterQueryHandler(props) {
  const hasAccess = FuseUtils.hasPermission({
    slug: "dashboard",
    permission: "can_view",
  });

  const { loading, data, error } = useQuery(query, {
    variables: { slugs: ["staff"] },
    skip: !hasAccess,
  });

  let employees = [];
  if (data && data.filters) {
    employees = data.filters[0].data;
  }

  if (!hasAccess) return null;

  return (
    <DashboardFilter
      employees={employees}
      loading={loading}
      error={error}
      {...props}
    />
  );
}

function DashboardFilter(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedEmployee = useSelector(
    ({ kpisApp }) => kpisApp.selectedEmployee
  );

  const { employees, loading, error, handlers, state } = props;

  const oVal = state.employee || "";

  const handleChange = (event) => {
    const value = event.target.value;
    dispatch(setSelectedEmployee(value));
    handlers.setEmployee(value);
  };

  React.useEffect(() => {
    if (selectedEmployee) {
      handlers.setEmployee(selectedEmployee);
    }
  }, [selectedEmployee, handlers]);

  return (
    <div
      className="flex flex-col md:flex-row sm:p-8 container"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <div className="flex flex-1 flex-col min-w-0">
        <div className="mx-16 mt-16 p-16 bg-white border-1 rounded-8">
          <OutlinedSelect
            id="filters-Responsable"
            name="Responsable"
            variant="outlined"
            value={oVal}
            disabled={loading || error}
            onChange={handleChange}
            label={t("kpisApp:Responsable")}
          >
            {/* <MenuItem value="every_user" dense={true}>
              {t("Reports:every_user")}
            </MenuItem>
            <MenuItem value="with_no_users" dense={true}>
              {t("Reports:with_no_users")}
            </MenuItem> */}
            {employees.map((item, key) => {
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
          </OutlinedSelect>
        </div>
      </div>
      <div className="flex flex-wrap w-full md:w-320 pt-16"></div>
    </div>
  );
}

function OutlinedSelect(props) {
  return (
    <FormControl variant="outlined" className="w-full">
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Select
        {...props}
        input={
          <OutlinedInput
            labelWidth={(props.label || "").length * 8}
            id={props.name}
            name={props.name}
          />
        }
      >
        {props.children}
      </Select>
    </FormControl>
  );
}

export default DashboardFilterQueryHandler;
