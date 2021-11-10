import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import * as kpisSrvs from "app/services/originServices/kpis.service";
import * as Actions from "../../store/actions";
import { colors } from "../../misc/colors.js";
import { useHistory } from "react-router-dom";
import viewFolders from "../buttons/Projects";

import WidgetsActions from "./WidgetsActions";

const useStyles = makeStyles(() => ({
  doughnut: {
    height: "350px",
  },
}));

function Widget(props) {
  // Props
  const { index } = props;

  // Hooks
  const classes = useStyles(props);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  // Redux data
  const math = useSelector(({ kpisApp }) => kpisApp.math[index]);
  const filters = useSelector(
    ({ kpisApp }) => kpisApp.filters[index]
  );

  // Local states
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    dispatch(Actions.queueLoading());
    kpisSrvs
      .offices(math, filters)
      .then((response) => {
        let _total = 0;
        const d = {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: [],
            },
          ],
        };
        for (let { name, value } of response) {
          if (name === null) name = t("kpisApp:not_specified");
          d.labels.push(name);
          d.datasets[0].data.push(value || 0);
          if (math !== "income") _total = _total + (value || 0);
          d.datasets[0].backgroundColor.push(
            colors[d.labels.length * 2]
          );
        }
        if (math !== "income") setTotal(_total);
        setData(d);
        setLoading(false);
        dispatch(Actions.dequeueLoading());
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        dispatch(Actions.dequeueLoading());
      });
  }, [math, filters, dispatch, t]);

  const widget = {
    options: {
      cutoutPercentage: 75,
      spanGaps: false,
      maintainAspectRatio: false,
      legend: {
        position: "bottom",
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, { datasets, labels }) {
            let label = labels[tooltipItem.index] || "";
            if (label) {
              label += ": ";
            }
            const value =
              datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ];
            label += formatter.format(value);
            if (math !== "income") {
              const p = (value / total) * 100;
              label += ` (${formatter.format(p)} %)`;
            }

            return label;
          },
        },
      },
    },
  };

  // Formatter
  const options = {};
  if (math === "income") {
    options.style = "currency";
    options.currency = "CAD";
  }
  const formatter = new Intl.NumberFormat("fr-CA", options);

  return (
    <Card
      className="w-full rounded-8 shadow-none border-1 p-16 flex flex-wrap flex-col justify-between"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <div>
        <Typography className="h3 sm:h2">
          {t(`kpisApp:${math}_titles.by_offices`)}
        </Typography>
      </div>

      <div className={`w-full py-24 relative ${classes.doughnut}`}>
        <Doughnut
          data={data}
          options={widget.options}
          ref={props.reference || null}
        />
      </div>
      <WidgetsActions
        index={index}
        widgetName={"offices"}
        seeDataHandler={() => viewFolders({ history, filters })}
      />
    </Card>
  );
}

export default React.memo(Widget);
