import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import clsx from "clsx";
import UserSidebar from "./UserSidebar";
import ChatsSidebar from "./ChatsSidebar";
import { makeStyles } from "@material-ui/core/styles";
import { drawerWidth } from "../consts";
import { useQuery, gql } from "@apollo/client";
import * as Actions from "../store/actions";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: drawerWidth,
    maxWidth: "100%",
    overflow: "hidden",
    height: "100%",
    [theme.breakpoints.up("md")]: {
      position: "relative",
    },
  },
}));

const gQlQuery = gql`
  query {
    chatRooms {
      id
      name
      unreadMessages

      messages {
        id
        content
        type
        user {
          id_Emp
          courriel
          nomFamille
          prenom
          fonction
          picture
        }
        createdAt
      }
      users {
        id_Emp
        courriel
        nomFamille
        prenom
        fonction
        picture
      }
    }
    chatContacts {
      id_Emp
      courriel
      nomFamille
      prenom
      fonction
      picture
    }
  }
`;

function ChatsSidebarHandler(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(gQlQuery, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const openSidebar = useSelector(
    ({ chatApp }) => chatApp.openSidebar
  );

  useEffect(() => {
    if (Array.isArray(data?.chatContacts)) {
      dispatch(Actions.setContacts(data.chatContacts));
    }
    if (Array.isArray(data?.chatRooms)) {
      dispatch(Actions.setRooms(data.chatRooms));
    }
  }, [data, dispatch]);

  return (
    <>
      <Hidden mdUp>
        <SwipeableDrawer
          className="h-full absolute z-20"
          variant="temporary"
          anchor="left"
          open={openSidebar}
          onOpen={(ev) => {}}
          onClose={() => dispatch(Actions.ocSidebar(false))}
          disableSwipeToOpen
          classes={{
            paper: clsx(
              classes.drawerPaper,
              "absolute ltr:left-0 rtl:right-0"
            ),
          }}
          style={{ position: "absolute" }}
          ModalProps={{
            keepMounted: true,
            disablePortal: true,
            BackdropProps: {
              classes: {
                root: "absolute",
              },
            },
          }}
        >
          <ChatsSidebar {...{ loading, error }} />
        </SwipeableDrawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          className="h-full z-20"
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <ChatsSidebar {...{ loading, error }} />
        </Drawer>
      </Hidden>
      <SwipeableDrawer
        className="h-full absolute z-30"
        variant="temporary"
        anchor="left"
        open={false}
        onOpen={(ev) => {}}
        onClose={() => {}}
        classes={{
          paper: clsx(classes.drawerPaper, "absolute left-0"),
        }}
        style={{ position: "absolute" }}
        ModalProps={{
          keepMounted: false,
          disablePortal: true,
          BackdropProps: {
            classes: {
              root: "absolute",
            },
          },
        }}
      >
        <UserSidebar />
      </SwipeableDrawer>
    </>
  );
}

export default ChatsSidebarHandler;
