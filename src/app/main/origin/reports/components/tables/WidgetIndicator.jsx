import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";

function WidgetIndicator({ list, loading }) {
  const { t } = useTranslation();

  const data = {
    invoiceAmount: 0,
    budget: 0,
    totalAmount: 0,
    toComplete: 0,
  };

  for (const item of list) {
    data.invoiceAmount += item.invoiceAmount;
    data.budget += item.budget;
    data.totalAmount += item.totalAmount;
    data.toComplete += item.toComplete;
  }

  const items = Object.entries(data);

  return (
    <div className="w-full flex flex-wrap">
      {items.map(([name, value]) => {
        return (
          <RenderWidget
            loading={loading}
            name={t(`Reports:${name}`)}
            value={
              <MoneyFormatter
                data={Math.round(value)}
                noWrap={true}
                digit={0}
              />
            }
            key={name}
          />
        );
      })}
    </div>
  );
}

function RenderWidget({ name, value, loading }) {
  return (
    <div className="p-16 w-1/2 md:w-1/4">
      <div className="rounded-8 border-1 py-16">
        <Typography className="text-14 font-medium text-center">
          {name}
        </Typography>
        <Divider className="mx-32 my-16" />
        <div className="text-center mt-28 mb-16">
          {loading ? (
            <CircularProgress />
          ) : (
            <Typography className="text-xl sm:text-2xl bold leading-none text-blue-500">
              {value}
            </Typography>
          )}

          <Typography className="text-12 mt-6" color="textSecondary">
            $ CAN
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default React.memo(WidgetIndicator);
