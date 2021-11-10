import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { SelectFormsy } from "@fuse";
import Formsy from "formsy-react";
import { useMutation, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import { showMessage } from "app/store/actions/fuse";
import { useDispatch } from "react-redux";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

const query = gql`
  mutation confirmProjectInvoice(
    $invoiceId: ID
    $users: [ID]
    $closeFolder: Boolean
  ) {
    confirmProjectInvoice(
      invoiceId: $invoiceId
      users: $users
      closeFolder: $closeFolder
    )
  }
`;

export default function DateValidation({ employeesExpert, checked }) {
  const userName = useSelector(
    ({ auth }) => auth.user.data.displayName
  );

  const [open, setOpen] = useState(false);
  const [found, setFound] = useState(false);
  const { t } = useTranslation();
  const { invoiceId } = useParams();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  const [confirm, { loading }] = useMutation(query);

  useEffect(() => {
    if (employeesExpert && userName) {
      setFound(
        employeesExpert.find((el) => el.user.NomEmploye === userName)
      );
    }
  }, [employeesExpert, userName]);

  const handleconfirm = (model) => {
    let variant = "success";
    confirm({
      variables: {
        invoiceId,
        users: model?.expertList,
        closeFolder: checked,
      },
    })
      .then(() => {})
      .catch((err) => {
        variant = "error";
      })
      .finally(() => {
        dispatch(
          showMessage({
            message: t(`projectInvoice:${variant}.confirm_timesheet`),
            autoHideDuration: 3000,
            variant, // success error info warning null
          })
        );
        setOpen(false);
      });
  };

  return (
    <div>
      <Button
        disabled={!found}
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        {t("projectInvoice:confirm_timesheets")}
        <ChevronRightIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {t("projectInvoice:confirm_timesheets")}
        </DialogTitle>
        <Formsy onValidSubmit={handleconfirm}>
          <DialogContent>
            <MenuItem>
              <FormControl className="w-full">
                <SelectFormsy
                  className="w-full"
                  variant="outlined"
                  disabled={loading}
                  value={[]}
                  label={t("projectInvoice:selected_experts")}
                  name="expertList"
                  multiple
                >
                  {employeesExpert?.map((e, key) => (
                    <MenuItem value={e.user.id_Emp} key={key}>
                      {e.user.NomEmploye}
                    </MenuItem>
                  ))}
                </SelectFormsy>
              </FormControl>
            </MenuItem>
            {checked ? (
              <Typography>
                {t("projectInvoice:confirm_timesheet_checked")}
              </Typography>
            ) : (
              <></>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              disabled={loading}
              color="primary"
            >
              {t("button.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
            >
              {t("button.i_confirm")}
            </Button>
          </DialogActions>
        </Formsy>
      </Dialog>
    </div>
  );
}
