import { SelectFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import { useQuery, gql } from "@apollo/client";
import FuseUtils from "@fuse/FuseUtils";

const QUERY = gql`
  query {
    activitiesEmployee {
      NomEmploye
      actif
    }
    me {
      NomEmploye
    }
  }
`;

function EmployeeSelect() {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(QUERY, {
    fetchPolicy: "no-cache",
  });

  const haViewActivities = FuseUtils.hasPermission({
    slug: "activities",
    permission: "can_view",
  });

  const props = { value: "" };
  let employee = data?.activitiesEmployee || [];

  if (!haViewActivities && data?.me) {
    employee = [{ ...data.me, actif: true }];
  }

  props.value = data?.me.NomEmploye || "";

  return (
    <div>
      <SelectFormsy
        className="w-full"
        variant="outlined"
        name="employee"
        disabled={loading || error}
        label={t("activities:form.user")}
      >
        {employee.map((item) => (
          <MenuItem
            key={item.NomEmploye}
            value={item.NomEmploye}
            className={!item.actif ? "text-gray-500" : "text-black"}
          >
            {item.NomEmploye}
          </MenuItem>
        ))}
      </SelectFormsy>
    </div>
  );
}

export default EmployeeSelect;
