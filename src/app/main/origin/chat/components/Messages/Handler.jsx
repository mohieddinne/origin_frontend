import ChatMessage from "./ChatMessage";
import RoomCreated from "./RoomCreated";
import UserInvited from "./UserInvited";

function MessageHandler(props) {
  const { item } = props;
  let Component = ChatMessage;
  if (item.type === 2) {
    if (item.content === "room_created") {
      Component = RoomCreated;
    } else if (item.content.indexOf("user_invited") === 0) {
      Component = UserInvited;
    }
  }
  return <Component {...props} />;
}

export default MessageHandler;
