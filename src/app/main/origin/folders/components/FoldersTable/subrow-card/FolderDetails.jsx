import React from "react";
import { useTranslation } from "react-i18next";
import TextTrimer from "@catu/components/TextTrimer";
import DateFormatter from "@catu/components/formatters/DateFormatter";
import MoneyFormatter from "@catu/components/formatters/MoneyFormatter";
import LinearProgress from "@material-ui/core/LinearProgress";

function Details({ item, loading }) {
  const { t } = useTranslation();

  if (loading)
    return (
      <>
        <div className="text-center mb-16">{t("loading")}</div>
        <LinearProgress variant="query" />
      </>
    );

  return (
    <>
      <div className="my-8">
        <div className="font-bold mb-4">{t("dApp:reference")}:</div>
        <TextTrimer string={item.Reference} length="150" />
      </div>
      <div className="flex flex-wrap w-full">
        <div className="my-8 w-1/2 sm:w-1/3 md:w-1/5">
          <div className="font-bold mb-4">{t("dApp:DateFerme")}:</div>
          <DateFormatter date={item.DateFerme} />
        </div>

        <div className="my-8 w-1/2 sm:w-1/3 md:w-1/5">
          <div className="font-bold mb-4">{t("dApp:DatePerte")}:</div>
          <DateFormatter date={item.DatePerte} />
        </div>

        <div className="my-8 w-1/2 sm:w-1/3 md:w-1/5">
          <div className="font-bold mb-4">
            {t("dApp:DateLivraison")}:
          </div>
          <DateFormatter date={item.DateLivraison} />
        </div>

        <div className="my-8 w-1/2 sm:w-1/3 md:w-1/5">
          <div className="font-bold mb-4">{t("dApp:budget")}:</div>
          <MoneyFormatter data={item.Budget} digit={0} />
        </div>

        <div className="my-8 w-1/2 sm:w-1/3 md:w-1/5">
          <div className="font-bold mb-4">{t("dApp:RecuPar")}:</div>
          <TextTrimer string={item.RecuPar} length="45" />
        </div>
      </div>
    </>
  );
}
export default Details;
