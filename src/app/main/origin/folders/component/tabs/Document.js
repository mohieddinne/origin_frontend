import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextFieldFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import DatePickerFormsy from "@catu/components/DatePickerFormsy";
import Button from "@material-ui/core/Button";
import SecondaryText from "@catu/components/SecondaryText";
import * as MainActions from "app/store/actions";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Formsy from "formsy-react";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
function DetailsTab(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data = useSelector(
    ({ folderApp }) => folderApp.documentData || []
  );
  const formatDate = (value) => {
    const date = new Date(value);
    return date.toString().slice(0, 24);
  };
  const addDocument = () => {
    dispatch(
      MainActions.openDialog({
        title: t("materialsApp:add_document"),
        actions: [
          <>
            <Button
              onClick={() => dispatch(MainActions.closeDialog())}
              color="primary"
              autoFocus
            >
              {t("close")}
            </Button>
            <Button
              onClick={() => dispatch(MainActions.closeDialog())}
              color="primary"
              autoFocus
            >
              {t("add")}
            </Button>
          </>,
        ],
        content: (
          <Formsy
            onValid={console.log}
            onChange={console.log}
            onInvalid={console.log}
            className="p-16 sm:p-24 max-w-2xl"
          >
            <TextFieldFormsy
              className="mt-8 mb-16"
              label={t("adminDocsApp:name")}
              autofocus
              validationErrors={{
                required: t("error.form.required"),
              }}
              id="name"
              name="name"
              fullWidth
              variant="outlined"
            />
            <TextFieldFormsy
              className="mt-8 mb-16"
              label={t("adminDocsApp:note")}
              id="note"
              name="note"
              fullWidth
              variant="outlined"
            />
            <DatePickerFormsy
              name="dateCreated"
              fullWidth
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label={t("adminDocsApp:creation_date")}
              //value={data.dateFete}
            />
            <Button
              className="whitespace-nowrap normal-case"
              variant="contained"
              color="primary"
            >
              {t("adminDocsApp:upload")}
            </Button>
            <div className="mb-24">
              {data && data.versions ? (
                data.versions.map((el) => {
                  return (
                    <div className="mb-24">
                      <a href={el.path}>
                        V.{el.version} {formatDate(el.dateCreated)}
                      </a>
                    </div>
                  );
                })
              ) : (
                <SecondaryText text={t("adminDocsApp:no.versions")} />
              )}
            </div>
          </Formsy>
        ),
      })
    );
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = () => {
    return [
      <Tooltip
        title={t("button.edit", {
          context: "male",
          element: t("document"),
        })}
      >
        <IconButton
          onClick={(ev) => {
            ev.stopPropagation();
          }}
        >
          <Icon>edit</Icon>
        </IconButton>
      </Tooltip>,
      <Tooltip
        title={t("archive", {
          context: "male",
          element: t("document"),
        })}
      >
        <IconButton
          onClick={(ev) => {
            ev.stopPropagation();
          }}
        >
          <Icon>archive</Icon>
        </IconButton>
      </Tooltip>,
    ];
  };
  const columns = React.useMemo(
    () => [
      {
        Header: t("materialsApp:documents"),
        accessor: "name",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: t("materialsApp:remarques"),
        accessor: "note",
        sortable: true,
      },
      {
        Header: t("option", { count: options().length }),
        id: "action",
        className: "justify-center",
        width: "20%",
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">
            {options(row).map((Option, key) => ({ ...Option, key }))}
          </div>
        ),
      },
    ],
    [t, options]
  );
  return (
    <>
      <Tooltip
        title={t("button.add", {
          context: "male",
          element: t("document"),
        })}
      >
        <IconButton
          onClick={(ev) => {
            ev.stopPropagation();
            addDocument();
          }}
        >
          <Icon>add</Icon>
        </IconButton>
      </Tooltip>
      <EnhancedTable
        classesNames="min-h-full sm:border-1"
        columns={columns}
        data={data}
        //onRowClick={(ev, row) => viewItem(row.original)}
        selectable={false}
      />
    </>
  );
}
export default DetailsTab;
