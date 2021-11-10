import React, { useState, useEffect } from "react";
// import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { widgetAvrgDelais } from "app/services/originServices/kpis.service";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Icon from "@material-ui/core/Icon";

function WidgetAvrgDelais() {
  // const { t } = useTranslation();

  // Redux data
  const filters = useSelector(({ kpisApp }) => kpisApp.filters[0]);

  const [loading, setLoading] = useState([]);
  const user = useSelector(
    ({ auth }) => auth?.user?.data?.displayName
  );
  const [data, setData] = useState([
    { name: "count", value: 0, description: "count_info" },
    {
      name: "delais_examain",
      value: 0,
      description: "delais_examain_info",
    },
    {
      name: "delais_redaction",
      value: 0,
      description: "delais_redaction_info",
    },
    {
      name: "delais_facturation",
      value: 0,
      description: "delais_facturation_info",
    },
  ]);

  useEffect(() => {
    setLoading(true);
    if (filters?.Responsable && filters?.Responsable?.length > 0)
      filters.Responsable = [user];
    widgetAvrgDelais(filters)
      .then((response) => {
        const data = response.map((item) => ({
          name: item.name,
          description: item.description,
          value:
            Math.round((item.value + Number.EPSILON) * 100) / 100,
        }));
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") console.log(error);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="w-full flex flex-wrap self-start">
      {(data || []).map((item, key) => (
        <RenderWidget
          loading={loading}
          name={item.name}
          description={item.description}
          value={item.value}
          key={key}
        />
      ))}
    </div>
  );
}

function RenderWidget({ name, value, description, loading }) {
  // const history = useHistory();
  const { t } = useTranslation();
  const [tooltip, openTooltip] = React.useState(false);

  // const filters = useSelector(({ kpisApp }) => kpisApp.filters[0]);
  // const Responsable = useSelector(
  //   ({ kpisApp }) => kpisApp.tab === "my_indicators"
  // );

  const handleTooltipOpen = () => {
    openTooltip(true);
  };

  const handleClick = (event) => {};

  return (
    <div
      className="widget flex w-full sm:w-1/2 md:w-1/4 md p-8"
      style={{ opacity: loading ? 0.5 : 1 }}
    >
      <Paper className="w-full rounded-8 shadow-none border-1">
        <div className="text-center pt-28 pb-28">
          <Typography className="text-64 md:text-72 lg:text-48 text-blue-500">
            {value}
          </Typography>
          <Typography
            className="text-16 sm:text-14 md:text-16 lg:text-14"
            color="textSecondary"
          >
            {loading ? t("loading") : t(`kpisApp:delais_wt.${name}`)}
          </Typography>
          <Tooltip
            open={tooltip}
            onClose={() => openTooltip(false)}
            onOpen={() => openTooltip(true)}
            title={t(`kpisApp:delais_wt.${description}`)}
          >
            <IconButton
              size="small"
              onClick={handleTooltipOpen}
              disabled={!!loading}
            >
              {loading ? (
                <CircularProgress
                  style={{
                    width: "25px",
                    height: "25px",
                  }}
                />
              ) : (
                <Icon fontSize="small">
                  info
                </Icon>
              )}
            </IconButton>
          </Tooltip>
        </div>
      </Paper>
    </div>
  );
}

export default React.memo(WidgetAvrgDelais);
