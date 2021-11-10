import { useSubscription, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import * as Actions from "../store/actions";
import { useEffect } from "react";
import * as MainActions from "app/store/actions";

const query = gql`
  subscription onChatRoom {
    chatRoom {
      id
      name
      lastMessage
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
  }
`;

function ChatRoom(props) {
  const dispatch = useDispatch();
  const { data } = useSubscription(query);

  useEffect(() => {
    const chatRoom = data?.chatRoom;
    if (chatRoom) {
      dispatch(MainActions.updateCountOnItem("/app/chat"));
      dispatch(Actions.addNewRoom(chatRoom));
    }
  }, [data, dispatch]);

  return null;
}

export default ChatRoom;
