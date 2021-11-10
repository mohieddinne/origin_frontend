import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import * as kpisSrvs from "app/services/originServices/kpis.service";
import * as Actions from "../../store/actions";
import { officesColors } from "../../misc/colors.js";
import { useHistory } from "react-router-dom";
import WidgetsActions from "./WidgetsActions";
import viewFolders from "../buttons/Projects";

const useStyles = makeStyles(() => ({
  h240: {
    height: "400px",
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
      .lossesAndOffices(math, filters)
      .then((response) => {
        if (!Array.isArray(response)) return;
        const d = {
          labels: [],
          datasets: [],
        };

        let _total = 0;

        const _offices = [];
        for (const item of response) {
          // Get labels
          if (!d.labels.includes(item.name)) d.labels.push(item.name);
          const lossIndex = d.labels.indexOf(item.name);
          for (const office of item.data) {
            _total = _total + office.value;
            const name = office.name || t("kpisApp:not_specified");
            const dsIndex = _offices.indexOf(name);

            if (dsIndex < 0) {
              const dataSet = {
                label: name,
                backgroundColor: officesColors[_offices.length],
                data: [],
              };
              if (lossIndex === 0) {
                dataSet.data = [office.value];
              } else {
                // Fill the table with zeros (see ChartJS docs)
                dataSet.data = new Array(lossIndex);
                for (let i = 0; i < lossIndex; ++i)
                  dataSet.data[i] = 0;
                // Set the correct data in the loss Index
                dataSet.data[lossIndex] = office.value;
              }
              d.datasets.push(dataSet);
              _offices.push(name);
            } else {
              d.datasets[dsIndex].data[lossIndex] = office.value;
            }
          }
        }

        setTotal(_total);
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
    data,
    options: {
      maintainAspectRatio: false,
      barValueSpacing: 20,

      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
            },
          },
        ],
      },
      tooltips: {
        intersect: false,
        mode: "index",
        callbacks: {
          label: function (tooltipItem, { datasets }) {
            let label =
              datasets[tooltipItem.datasetIndex].label || "";
            if (label) {
              label += ": ";
            }
            if (math === "income") {
              if (parseFloat(tooltipItem.value))
                label += formatter.format(tooltipItem.value);
              else label += t("kpisApp:type_not_exist");
            }
            if (math !== "income") {
              if (parseFloat(tooltipItem.value)) {
                label += formatter.format(tooltipItem.value);
                const p = (tooltipItem.value / total) * 100;
                label += ` (${formatter.format(p)} %)`;
              } else label += t("kpisApp:no_records");
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

  // View detailed data based on the filers

  return (
    <Card
      className="w-full rounded-8 shadow-none border-1 p-16 flex flex-wrap flex-col justify-between"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <div className="relative flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <Typography className="h3 sm:h2">
            {t(`kpisApp:${math}_titles.by_types_and_offices`)}
          </Typography>
        </div>
      </div>

      <div className={`w-full py-24 ${classes.h240}`}>
        <Bar
          data={widget.data}
          options={widget.options}
          ref={props.reference || null}
        />
      </div>
      <WidgetsActions
        index={index}
        widgetName={"lossesandoffices"}
        seeDataHandler={() => viewFolders({ history, filters })}
      />
    </Card>
  );
}

export default React.memo(Widget);
