import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import DeleteConfirmation from "./DeleteConfirmation";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/actions";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Tooltip from "@material-ui/core/Tooltip";
import CustomButton from "./CustomButton";

const DELETE_FILTER = gql`
  mutation ($id: ID!) {
    deleteSavedFilter(id: $id) {
      id
    }
  }
`;

function DeleteFavorite(props) {
  const { value } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation("ComFavoriteFilters");

  const [isOpenConfirmModal, setOpenConfirmModal] = useState(false);
  const [exec, { loading }] = useMutation(DELETE_FILTER);

  const handleMessage = (message, variant) => {
    dispatch(
      showMessage({
        message: t(message, { name: value.name }),
        autoHideDuration: 3000,
        variant, // success error info warning null
      })
    );
  };

  const handleDelete = () => {
    exec({ variables: { id: value.id } })
      .then(() => {
        handleMessage("filter_deleted", "success");
        props.onSuccess();
      })
      .catch((error) => {
        handleMessage("error_deleting_filter", "error");
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }
      })
      .finally(() => {
        setOpenConfirmModal(false);
      });
  };

  return (
    <>
      <Tooltip title={!loading && value ? t("delete_tooltip") : ""}>
        <span>
          <CustomButton
            onClick={() => setOpenConfirmModal(true)}
            variant="outlined"
            size="small"
            disableElevation
            disabled={loading || !value}
          >
            <DeleteOutlineIcon fontSize="small" />
          </CustomButton>
        </span>
      </Tooltip>
      <DeleteConfirmation
        loading={loading}
        favorite={value.name}
        open={isOpenConfirmModal}
        setOpen={setOpenConfirmModal}
        action={handleDelete}
      />
    </>
  );
}
export default DeleteFavorite;
