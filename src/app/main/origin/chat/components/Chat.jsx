import FuseScrollbars from "@fuse/components/FuseScrollbars";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ChatForm from "./ChatForm";
import MessageHandler from "./Messages/Handler";

function Chat(props) {
  const { room } = props;
  const { t } = useTranslation();

  const roonHasMessages =
    Array.isArray(room.messages) && room.messages.length > 0;

  const chatRef = useRef(null);

  useEffect(() => {
    if (room) scrollToBottom();
  }, [room]);

  function scrollToBottom() {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }

  function isFirstMessageOfGroup(item, i) {
    if (i === 0) return true;
    const beforeMessage = room.messages[i - 1];
    if (beforeMessage.type === 2) return true;
    return item.user.courriel !== beforeMessage.user.courriel;
  }

  function isLastMessageOfGroup(item, i) {
    if (i === room.messages.length - 1) return true;
    const nextMessage = room.messages[i + 1];
    if (nextMessage.type === 2) return true;
    return item.user.courriel !== nextMessage.user.courriel;
  }

  return (
    <div className={clsx("flex flex-col relative", props.className)}>
      <FuseScrollbars
        ref={chatRef}
        className="flex flex-1 flex-col overflow-y-auto"
      >
        {roonHasMessages ? (
          <div className="flex flex-col pt-16 px-16 pl-56 pb-40">
            {room.messages.map((item, i) => (
              <MessageHandler
                key={item.id}
                item={item}
                i={i}
                isFirstOfGroup={isFirstMessageOfGroup(item, i)}
                isLastOfGroup={isLastMessageOfGroup(item, i)}
                isLastMessage={i + 1 === room.messages.length}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 items-center justify-center">
              <Icon className="text-128" color="disabled">
                chat
              </Icon>
            </div>
            <Typography
              className="px-16 pb-24 text-center"
              color="textSecondary"
            >
              {t("chat:start_a_conversation")}
            </Typography>
          </div>
        )}
      </FuseScrollbars>
      {room && <ChatForm room={room} />}
    </div>
  );
}

export default Chat;
