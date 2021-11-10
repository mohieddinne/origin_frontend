import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import moment from "moment";
import React from "react";
import StatusIcon from "./StatusIcon";
import * as Actions from "../store/actions";

const useStyles = makeStyles((theme) => ({
  contactListItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    "&.active": {
      backgroundColor: theme.palette.background.paper,
    },
  },
  unreadBadge: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

function ContactListItem(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const { contact } = props;

  const isActive = props.selectedContactId === contact.id;
  const fullName = contact.prenom + " " + contact.nomFamille;

  const handleClick = () => {
    const room = {
      id: null,
      name: fullName,
      users: [contact],
      lastMessage: "",
      chatMessages: [],
    };
    dispatch(Actions.addNewRoom(room));
    dispatch(Actions.ocSidebar(false));
    history.push("/app/chat/r/last");
  };

  return (
    <ListItem
      button
      className={clsx(
        classes.contactListItem,
        "px-16 py-12 min-h-92",
        {
          active: isActive,
        }
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <div className="absolute right-0 bottom-0 -m-4 z-10">
          <StatusIcon status={contact.status} />
        </div>

        <Avatar src={contact.picture} alt={fullName}>
          {!contact.picture ? contact.prenom[0] : ""}
        </Avatar>
      </div>

      <ListItemText
        classes={{
          root: "min-w-px px-16",
          secondary: "truncate",
        }}
        primary={fullName}
        secondary={contact.fonction}
      />

      {props.contact.chatId && (
        <div className="flex flex-col justify-center items-end">
          {props.contact.lastMessageTime && (
            <Typography className="whitespace-nowrap mb-8">
              {moment(props.contact.lastMessageTime).format("ll")}
            </Typography>
          )}
          {props.contact.unread && (
            <div
              className={clsx(
                classes.unreadBadge,
                "flex items-center justify-center min-w-24 h-24 rounded-full text-14 text-center"
              )}
            >
              {props.contact.unread}
            </div>
          )}
        </div>
      )}
    </ListItem>
  );
}

export default ContactListItem;
