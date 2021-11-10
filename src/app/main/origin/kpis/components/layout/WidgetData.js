import React, { useEffect } from "react";
import FusePageCarded from "@fuse/components/FusePageLayouts/carded/FusePageCarded";
import withReducer from "app/store/withReducer";
import reducer from "../../store/reducer";
import { useTranslation } from "react-i18next";
import DataTableHandler from "../tables/WidgetDataContainer";
import ListHeader from "@catu/components/HeaderList";
import SearchInput from "../SearchInput";
import * as Actions from "../../store/actions";
import { useDispatch } from "react-redux";

function Page({ match, history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => () => dispatch(Actions.setEditable(false)));
  const { math, widget } = match.params;
  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        contentCard: "rounded-8 overflow-hidden",
        contentWrapper: "mb12",
      }}
      header={
        <ListHeader
          icon=" multiline_chart chevron_right"
          title={t(`kpisApp:dt_page_title.${math}.${widget}`)}
          options={{
            goBack: true,
            defaultGoBackLink: "/app/kpis",
            goBack_string: t("kpisApp:key_performance_indicators"),
          }}
          Input={SearchInput}
        />
      }
      content={<DataTableHandler math={math} widget={widget} />}
    />
  );
}

export default withReducer("kpisApp", reducer)(Page);
