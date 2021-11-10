import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import { useTranslation } from "react-i18next";
import FuseUtils from "@fuse/FuseUtils";
import Tabs from "./Tabs";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
  tabContainer: {
    maxWidth: "272px",
    overflowY: "scroll",
    "@media screen and (min-width: 425px)": {
      maxWidth: "initial",
      overflowY: "auto",
    },
  },
}));

function PageHeaderComp() {
  const classes = useStyles();
  const history = useHistory();
  const { tab } = useParams();
  const { t } = useTranslation();

  const hasKPIAccess = FuseUtils.hasPermission({
    slug: "kpis",
    permission: "can_view",
  });
  const haDashboard = FuseUtils.hasPermission({
    slug: "dashboard",
    permission: "can_view",
  });
  /*const hasAccessAllReport = FuseUtils.hasPermission({
    slug: "reports-tec",
    permission: "can_view",
  });
  const hasAccessOwnReport = FuseUtils.hasPermission({
    slug: "reports-tec",
    permission: "can_view_own",
  });

  const hasAccessReport = hasAccessAllReport || hasAccessOwnReport; */

  //toggle to hide indicators
  //const [tabs, setTabs] = useState(["report-tec"]);
  const [tabs, setTabs] = useState(["my-indicators"]);

  useEffect(() => {
    const addedTabs = ["my-indicators"];
    // KPIs: company indicators
    if (hasKPIAccess) {
      const hasCIs = addedTabs.includes("company-indicators");
      //uncomment to display indicators
      if (!hasCIs) addedTabs.push("company-indicators");
    }
    // TEC Reports
    // const hasTEC = addedTabs.includes("report-tec");
    // if (hasAccessReport && !hasTEC) addedTabs.push("report-tec");
    // Dashboard
    const hasDashboard = addedTabs.includes("dashboard");
    if (haDashboard && !hasDashboard) addedTabs.push("dashboard");
    // Handle state
    if (addedTabs.length) setTabs(addedTabs);
    // Check for rights and redirections
    const defaultBehavior = () => {
      if (hasKPIAccess) {
        if (tab) {
          history.push(`/app/kpis/t/${tab}`);
        } else {
          history.push("/app/kpis/t/my-indicators");
          //uncomment to display indicators
          //history.push(`/app/kpis/t/report-tec`);
        }
        //uncomment to display indicators
      } else history.push("/app/kpis/t/my-indicators");
    };
    if (!tab || !addedTabs.includes(tab)) defaultBehavior();
    else {
      // if (tab === "report-tec" && !hasAccessReport) defaultBehavior();
      if (tab === "company-indicators" && !hasKPIAccess)
        history.push("/app/kpis/t/my-indicators");
      else if (tab === "dashboard" && haDashboard)
        history.push("/app/kpis/t/dashboard");
    }
  }, [haDashboard, hasKPIAccess, history, tab]);

  return (
    <div className="flex flex-col justify-between flex-1 px-24 pt-24">
      <div className="flex items-center">
        <Icon className="text-18" color="action">
          multiline_chart
        </Icon>
        <Icon className="text-16" color="action">
          chevron_right
        </Icon>
        <Typography color="textSecondary">
          {t("kpisApp:key_performance_indicators")}
        </Typography>
      </div>
      <div className="flex items-end">
        <div
          className={clsx(classes.tabContainer, "flex items-center")}
        >
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  );
}

export default PageHeaderComp;
