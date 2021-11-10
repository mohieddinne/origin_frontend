import React from "react";
import Button from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import RefetchButton from "../buttons/RefetchButton";
import { useTranslation } from "react-i18next";
import FilterBtn from "./actions/Filters";
import AdvancedFilters from "./actions/AdvancedFilters";

function ToolbarActions(props) {
  const { t } = useTranslation();
  const {
    Filter,
    AdvancedFilter,
    selecting,
    refetch,
    Export,
    options,
    selectedIndexes,
    bulkActions,
  } = props;

  const hasBulkActions = selecting && Array.isArray(bulkActions);

  return (
    <>
      {Export && (
        <div>
          <Tooltip title={t("Export_the_table")}>
            <Button></Button>
          </Tooltip>
          <Export />
        </div>
      )}

      <FilterBtn Component={Filter} options={options} />
      <RefetchButton refetch={refetch} loading={props.loading} />

      {hasBulkActions && (
        <div className="flex items-center">
          {bulkActions.map((Component, index) => {
            return (
              <div key={index}>
                {typeof Component === "function" ? (
                  <Component selectedIndexes={selectedIndexes} />
                ) : (
                  <>{Component}</>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selecting && typeof bulkActions?.bulkDelete === "function" && (
        <>
          <div className="hidden md:block">
            <Tooltip title="Delete">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  if (typeof bulkActions?.bulkDelete === "function") {
                    bulkActions.bulkDelete(selectedIndexes);
                  }
                }}
                startIcon={<DeleteIcon />}
              >
                <Icon>delete</Icon>
              </Button>
            </Tooltip>
          </div>
          <div className="block md:hidden">
            <Tooltip title="Delete">
              <Button
                aria-label="delete"
                onClick={() => {
                  if (typeof bulkActions?.bulkDelete === "function") {
                    bulkActions.bulkDelete(selectedIndexes);
                  }
                }}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        </>
      )}
      {selecting && typeof bulkActions?.bulkEdit === "function" && (
        <>
          <div className="hidden md:block">
            <Tooltip title="Edit">
              <Button
                color="primary"
                variant="contained"
                aria-label="Edit"
                className="text-sm"
                onClick={() => {
                  if (typeof bulkActions?.bulkEdit === "function") {
                    bulkActions.bulkEdit(selectedIndexes);
                  }
                }}
                startIcon={<EditIcon />}
              >
                Modifier
              </Button>
            </Tooltip>
          </div>
          <div className="block md:hidden">
            <Tooltip title="Edit">
              <Button
                aria-label="Edit"
                onClick={() => {
                  if (typeof bulkActions?.bulkEdit === "function") {
                    bulkActions.bulkEdit(selectedIndexes);
                  }
                }}
              >
                <EditIcon />
              </Button>
            </Tooltip>
          </div>
        </>
      )}
    </>
  );
}

export default ToolbarActions;
