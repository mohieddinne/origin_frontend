import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useMutation, gql } from "@apollo/client";
import * as Actions from "../store/actions";
import { useHistory } from "react-router-dom";
import * as MainActions from "app/store/actions";

const query = gql`
  mutation postMessageInNewRoom($content: String!, $usersId: [Int]!) {
    postMessageInNewRoom(content: $content, usersId: $usersId)
  }
`;

const queryNR = gql`
  mutation postMessage($roomId: ID!, $content: String!) {
    postMessage(roomId: $roomId, content: $content)
  }
`;

const deleteUnreadMessagesQuery = gql`
  mutation marckMessage($roomId: ID) {
    marckMessage(roomId: $roomId)
  }
`;

function ChatForm(props) {
  const { room } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [deleteUnreadMessages] = useMutation(
    deleteUnreadMessagesQuery
  );

  const [postInNewRoom, { loading: loading_NR }] = useMutation(query);
  const [post, { loading: loading_R }] = useMutation(queryNR);

  const loading = loading_NR || loading_R;
  const courriel = useSelector(({ auth }) => auth?.user?.data?.email);
  const [messageText, setMessageText] = useState("");

  function onInputChange(ev) {
    setMessageText(ev.target.value);
  }

  function onMessageSubmit(ev) {
    ev.preventDefault();
    if (messageText === "") return;
    const content = messageText;
    const chatMessage = {
      id: "M" + Math.random().toString(36).substr(2, 9),
      content,
      room: { id: room.id },
      user: { courriel },
    };
    dispatch(Actions.addMessage(room.id, chatMessage));
    // Send a message to store
    if (room.id < 0) {
      const usersId = room.users.map((user) => user.id_Emp);
      postInNewRoom({
        variables: { content, usersId },
      }).then(({ postMessageInNewRoom }) => {
        const roomId = postMessageInNewRoom;
        setMessageText("");
        dispatch(Actions.updateRoomId(room.id, roomId));
        history.push("/app/chat/r/" + roomId);
      });
    } else {
      post({
        variables: { roomId: room.id, content },
      }).then(() => {
        setMessageText("");
      });
    }
  }

  function handleClick() {
    if (room.unreadMessages > 0) {
      deleteUnreadMessages({ variables: { roomId: room.id } }).then(
        ({ data }) => {
          dispatch(Actions.resetRoomUnreadMessage(room.id));
          dispatch(
            MainActions.updateCountOnItem(
              "/app/chat",
              -room.unreadMessages
            )
          );
        }
      );
    }
  }

  return (
    <form
      onSubmit={onMessageSubmit}
      className="absolute bottom-0 right-0 left-0 py-16 px-8"
    >
      <Paper className="flex items-center relative rounded-24 shadow">
        <TextField
          autoFocus={false}
          id="message-input"
          className="flex-1"
          InputProps={{
            disableUnderline: true,
            classes: {
              root: "flex flex-grow flex-shrink-0 mx-16 mr-48 my-8",
              input: "",
            },
            placeholder: t("chat:type_your_message"),
          }}
          InputLabelProps={{ shrink: false }}
          onChange={onInputChange}
          value={messageText}
          disabled={loading}
          onClick={() => handleClick()}
          // onFocus={() => handleClick()}
        />
        <IconButton type="submit" className="mr-8" disabled={loading}>
          <Icon className="text-24" color="action">
            send
          </Icon>
        </IconButton>
      </Paper>
    </form>
  );
}

export default ChatForm;
