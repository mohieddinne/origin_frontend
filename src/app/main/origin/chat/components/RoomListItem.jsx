import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
// import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
// import moment from "moment";
import React from "react";
import StatusIcon from "./StatusIcon";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import RoomIcon from "./RoomIcon";
import { useMutation, gql } from "@apollo/client";
import * as Actions from "../store/actions";
import * as MainActions from "app/store/actions";

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
const query = gql`
  mutation marckMessage($roomId: ID) {
    marckMessage(roomId: $roomId)
  }
`;

function RoomListItem(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles(props);
  const { room } = props;
  const [update] = useMutation(query);

  const userEmail = useSelector(({ auth }) => auth.user.data.email);

  const isActive = false;
  const roomMembers = room.users.filter((user) => {
    return user.courriel !== userEmail;
  });

  // room name
  let roomName = room.name;
  const noName = !roomName || roomName === "no_name_group";
  if (noName) {
    roomName = roomMembers
      .map((member) => {
        if (roomMembers.length > 2) return member.prenom;
        return member.prenom + " " + member.nomFamille;
      })
      .join(", ");
    if (roomName.length > 36)
      roomName = roomName.substr(0, 35) + "...";
  }

  const handleClick = () => {
    dispatch(Actions.updateUnreadMessages(0));
    let roomId = room.id > 0 ? room.id : "n" + -room.id;
    if (room.unreadMessages > 0) {
      update({ variables: { roomId: room.id } }).then(({ data }) => {
        dispatch(Actions.resetRoomUnreadMessage(room.id));
        dispatch(
          MainActions.updateCountOnItem(
            "/app/chat",
            -room.unreadMessages
          )
        );
      });
    }
    history.push("/app/chat/r/" + roomId);
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
          <StatusIcon status={room.status} />
        </div>

        <RoomIcon roomMembers={roomMembers} name={roomName} />
      </div>

      <ListItemText
        classes={{
          root: "min-w-px px-16",
          secondary: "truncate",
        }}
        primary={roomName}
        secondary={room.lastMessage || t("chat:nothing_yet")}
      />
      {room?.unreadMessages > 0 && (
        <div
          className={clsx(
            classes.unreadBadge,
            "flex items-center justify-center min-w-24 h-24 rounded-full text-14 text-center"
          )}
        >
          {room?.unreadMessages}
        </div>
      )}
    </ListItem>
  );
}

export default RoomListItem;
