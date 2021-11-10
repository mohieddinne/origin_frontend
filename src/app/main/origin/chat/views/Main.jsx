import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import withReducer from "app/store/withReducer";
import clsx from "clsx";
import reducer from "../store/reducer";
import ChatsSidebarHandler from "../components/ChatsSidebarHandler";
import { headerHeight } from "../consts";
import ChatWrapper from "../components/ChatWrapper";
import ChatMessageSubscriptions from "../subscriptions/ChatMessage";
import ChatRoomSubscriptions from "../subscriptions/ChatRoom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100%",
    position: "relative",
    flex: "1 1 auto",
    height: "auto",
    backgroundColor: theme.palette.background.default,
  },
  topBg: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: headerHeight,
    backgroundImage:
      'url("../../assets/images/backgrounds/header-bg.png")',
    backgroundColor: theme.palette.primary.dark,
    backgroundSize: "cover",
    pointerEvents: "none",
  },
  contentCardWrapper: {
    position: "relative",
    padding: 24,
    maxWidth: 1400,
    display: "flex",
    flexDirection: "column",
    flex: "1 0 auto",
    width: "100%",
    minWidth: "0",
    maxHeight: "100%",
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      padding: 16,
    },
    [theme.breakpoints.down("xs")]: {
      padding: 12,
    },
  },
  contentCard: {
    display: "flex",
    position: "relative",
    flex: "1 1 100%",
    flexDirection: "row",
    backgroundImage:
      'url("/assets/images/patterns/origin-bg-grey.png")',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: 8,
    minHeight: 0,
    overflow: "hidden",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 100%",
    zIndex: 10,
    background: `linear-gradient(to bottom, ${fade(
      theme.palette.background.paper,
      0.8
    )} 0,${fade(theme.palette.background.paper, 0.6)} 20%,${fade(
      theme.palette.background.paper,
      0.8
    )})`,
  },
}));

function ChatApp(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <div className={classes.topBg} />
      <div className={clsx(classes.contentCardWrapper, "container")}>
        <div className={classes.contentCard}>
          <ChatsSidebarHandler />
          <main className={clsx(classes.contentWrapper, "z-10")}>
            <ChatWrapper />
          </main>
        </div>
        <ChatMessageSubscriptions />
        <ChatRoomSubscriptions />
      </div>
    </div>
  );
}

export default withReducer("chatApp", reducer)(ChatApp);
