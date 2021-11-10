import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import * as Actions from "../../../../misc/navigation-menu/store/actions";
import { useTranslation } from "react-i18next";
import * as materialsService from "app/services/axios/portal/materials.service";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import Tooltip from "@material-ui/core/Tooltip";
import * as MainActions from "app/store/actions";
import SecondaryText from "@catu/components/SecondaryText";
import slugify from "slugify";
import CircularProgress from "@material-ui/core/CircularProgress";

function MaterialTable(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const data = useSelector(({ materialApp }) => materialApp.data);
  const searchText = useSelector(
    ({ materialApp }) => materialApp.searchText
  );

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState([false, 0]);
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
    if (!Array.isArray(data) || data.length <= 1) {
      materialsService
        .getAll()
        .then((response) => {
          dispatch(Actions.setData(response));
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [data, dispatch]);

  useEffect(() => {}, [data]);

  useEffect(() => {
    if (!searchText) {
      setDataArray(data);
    } else {
      const keyword = searchText.toLowerCase();
      const filters = ["name"];
      if (Array.isArray(data)) {
        setDataArray(
          data.filter((element) => {
            for (const filterBy of filters) {
              if (
                element[filterBy].toLowerCase().indexOf(keyword) >= 0
              ) {
                return true;
              }
            }
            return false;
          })
        );
      }
    }
  }, [searchText, data]);

  const handleArchiveClick = (item) => {
    if (!item || !item.id) return;
    dispatch(
      MainActions.openDialog({
        title: t("formulasApp:archivage"),
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
              onClick={() => {
                archiveAndRefresh(item);
                dispatch(MainActions.closeDialog());
              }}
              color="primary"
              autoFocus
            >
              {t("confirm")}
            </Button>
          </>,
        ],
        content: (
          <>
            <div className="mb-24">
              <Typography>
                {t("formulasApp:confirm_message")}
              </Typography>
            </div>
          </>
        ),
      })
    );
  };

  const archiveAndRefresh = (item) => {
    if (!item || actionLoading[0]) {
      return;
    }
    setActionLoading([2, item.id]);
    materialsService
      .archive(item)
      .then(() => {
        dispatch(Actions.deleteItem(item));
        setActionLoading([false, 0]);
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleEditClick = (item) => {
    if (!item || !item.id) return;
    const slug = slugify(
      item.name ? item.name : ""
    ).toLocaleLowerCase();
    props.history.push(`/app/materials/item/${item.id}/${slug}`);
    return true;
  };

  const viewItem = (item) => {
    if (!item) return;
    dispatch(
      MainActions.openDialog({
        title: item.name,
        icon: item.icon,
        actions: [
          <Button
            onClick={() => dispatch(MainActions.closeDialog())}
            color="primary"
            autoFocus
          >
            {t("close")}
          </Button>,
        ],
        tabs: [
          {
            name: t("detail_plural"),
            content: [
              <>
                <div className="mb-24">
                  <Typography className="font-bold mb-4 text-15">
                    {t("materialsApp:category")}
                  </Typography>
                  <Typography>{item.category}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-bold mb-4 text-15">
                    {t("materialsApp:supplier_name")}
                  </Typography>
                  <Typography>{item.supplier}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-bold mb-4 text-15">
                    {t("materialsApp:density")}
                  </Typography>
                  <Typography>{item.density}</Typography>
                </div>

                <div className="mb-24">
                  <Typography className="font-bold mb-4 text-15">
                    {t("materialsApp:unit")}
                  </Typography>
                  <Typography>
                    {item.unitValue
                      ? item.unitValue + " " + item.unit
                      : item.unit}
                  </Typography>
                </div>
              </>,
            ],
          },
          {
            name: t("materialsApp:documents"),
            content: [
              <>
                <EnhancedTable
                  columns={[
                    {
                      Header: t("materialsApp:doc_name"),
                      accessor: "name",
                      className: "font-bold",
                      sortable: true,
                    },
                    {
                      Header: t("materialsApp:doc_date"),
                      accessor: "dateCreated",
                      sortable: true,
                      Cell: ({ row, cell }) => {
                        if (cell.value) {
                          const date = new Date(cell.value);
                          return date.toString().slice(0, 24);
                        } else {
                          return (
                            <SecondaryText
                              text={t("materialsApp:no.date")}
                            />
                          );
                        }
                      },
                    },
                    {
                      Header: t("materialsApp:versions"),
                      accessor: "versions",
                      sortable: true,
                      sortType: (a, b, columnId, desc) => {
                        const x = Array.isArray(a.original[columnId])
                          ? a.original[columnId].length
                          : 0;
                        const y = Array.isArray(b.original[columnId])
                          ? b.original[columnId].length
                          : 0;
                        return desc ? x < y : x > y;
                      },
                      Cell: ({ row, cell }) => {
                        const count =
                          Array.isArray(cell.value) &&
                          cell.value.length;
                        if (count > 0) {
                          return t("materialsApp:n.version", {
                            count,
                          });
                        } else {
                          return (
                            <SecondaryText
                              text={t("materialsApp:no.version")}
                            />
                          );
                        }
                      },
                    },
                  ]}
                  data={item.documents}
                  selectable={false}
                />
              </>,
            ],
          },
        ],
      })
    );
  };

  const options = (row) => {
    if (!row) return [];
    const [buttonId, rowId] = actionLoading;
    return [
      <Tooltip
        title={t("button.edit", {
          context: "male",
          element: t("material"),
        })}
      >
        <IconButton
          onClick={(ev) => {
            ev.stopPropagation();
            handleEditClick(row.original);
          }}
        >
          <Icon>edit</Icon>
        </IconButton>
      </Tooltip>,
      <Tooltip
        title={t("archive", {
          context: "male",
          element: t("material"),
        })}
      >
        <IconButton
          onClick={(ev) => {
            ev.stopPropagation();
            handleArchiveClick(row.original);
          }}
        >
          {buttonId === 2 && rowId === row.original.id ? (
            <CircularProgress size={24} />
          ) : (
            <Icon>archive</Icon>
          )}
        </IconButton>
      </Tooltip>,
      <Tooltip
        title={t("button.view", {
          context: "male",
          element: t("material"),
        })}
      >
        <IconButton
          onClick={(ev) => {
            ev.stopPropagation();
            viewItem(row.original);
          }}
        >
          <Icon>pageview</Icon>
        </IconButton>
      </Tooltip>,
    ];
  };

  const columns = React.useMemo(
    () => [
      {
        Header: t("materialsApp:name"),
        accessor: "name",
        className: "font-bold",
        sortable: true,
      },
      {
        Header: t("materialsApp:category"),
        accessor: "category",
        sortable: true,
      },
      {
        Header: t("materialsApp:supplier_name"),
        accessor: "supplier",
        sortable: true,
      },
      {
        Header: t("materialsApp:doc_number"),
        accessor: "documents",
        sortable: true,
        sortType: (a, b, columnId, desc) => {
          const x = Array.isArray(a.original[columnId])
            ? a.original[columnId].length
            : 0;
          const y = Array.isArray(b.original[columnId])
            ? b.original[columnId].length
            : 0;
          return desc ? x < y : x > y;
        },
        Cell: ({ row, cell }) => {
          const count =
            Array.isArray(cell.value) && cell.value.length;
          if (count > 0) {
            return t("materialsApp:n.document", { count });
          } else {
            return (
              <SecondaryText text={t("materialsApp:no.documents")} />
            );
          }
        },
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
    [options]
  );

  return (
    <EnhancedTable
      classesNames="min-h-full sm:border-1"
      loading={loading}
      columns={columns}
      data={dataArray}
      onRowClick={(ev, row) => viewItem(row.original)}
      selectable={false}
    />
  );
}

export default withRouter(MaterialTable);
