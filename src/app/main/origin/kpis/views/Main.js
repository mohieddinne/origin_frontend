import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FusePageSimple from "@fuse/components/FusePageLayouts/simple/FusePageSimple";
import withReducer from "app/store/withReducer";
import reducer from "../store/reducer";
import PagesHandler from "../components/layout/PagesHandler";
import PageHeaderComp from "../components/layout/PageHeaderComp";

const useStyles = makeStyles((theme) => ({
  content: {
    "& canvas": {
      maxHeight: "100%",
    },
  },
  header: {
    height: "11rem",
  },
}));

function Page() {
  const classes = useStyles();

  return (
    <FusePageSimple
      classes={{
        header: classes.header,
        rightSidebar: "w-288",
        content: classes.content,
      }}
      header={<PageHeaderComp />}
      content={<PagesHandler />}
    />
  );
}

export default withReducer("kpisApp", reducer)(Page);
