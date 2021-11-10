import { useSubscription, gql } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";
import { useEffect } from "react";
import * as MainActions from "app/store/actions";

const query = gql`
  subscription onChatMessage {
    chatMessage {
      id
      content
      type
      room {
        id
      }
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
  }
`;

function ChatMessage(props) {
  const dispatch = useDispatch();
  const { data } = useSubscription(query);

  const userEmail = useSelector(({ auth }) => auth.user.data.email);

  useEffect(() => {
    const chatMessage = data?.chatMessage;
    if (chatMessage && chatMessage.room) {
      if (chatMessage.user.courriel !== userEmail) {
        // Add +1 to room
        dispatch(
          Actions.incrimentRoomUnreadMessage(chatMessage.room.id)
        );
        dispatch(MainActions.updateCountOnItem("/app/chat"));
      }
      dispatch(Actions.addMessage(chatMessage.room.id, chatMessage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return null;
}

export default ChatMessage;
