import { useParams } from "react-router-dom";
import ChatStarter from "./ChatStarter";
import DiscussionHandler from "./DiscussionHandler";

function ChatWrapper() {
  const { roomId } = useParams();
  if (roomId) return <DiscussionHandler roomId={roomId} />;
  return <ChatStarter />;
}

export default ChatWrapper;
