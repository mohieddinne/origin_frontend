import Button from "@material-ui/core/Button";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { updateUserData } from "app/auth/store/actions/user.actions";

const UPDATE_ADVANCED_FILTER_MUTATION = gql`
  mutation updateAdvancedFilters($usesAdvancedFilters: Boolean) {
    updateMyUser(
      data: { id_Emp: "1", usesAdvancedFilters: $usesAdvancedFilters }
    ) {
      usesAdvancedFilters
    }
  }
`;

function FilterTypeButton(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [mutate, { loading }] = useMutation(
    UPDATE_ADVANCED_FILTER_MUTATION
  );
  const usesAdvancedFilters = useSelector(
    ({ auth }) => auth?.user?.data?.usesAdvancedFilters || false
  );

  const handleClick = () => {
    mutate({
      variables: { usesAdvancedFilters: !usesAdvancedFilters },
    })
      .then(() => {
        if (typeof props.onChange === "function") {
          props.onChange();
        }
        dispatch(
          updateUserData({
            usesAdvancedFilters: !usesAdvancedFilters,
          })
        );
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }
      });
  };

  return (
    <Button
      onClick={handleClick}
      variant="outlined"
      size="small"
      disabled={loading}
      disableElevation
      className="ml-8"
    >
      {loading
        ? t("loading")
        : t(
            usesAdvancedFilters
              ? "button.standard_filters"
              : "button.advanced_filter"
          )}
    </Button>
  );
}

export default FilterTypeButton;
