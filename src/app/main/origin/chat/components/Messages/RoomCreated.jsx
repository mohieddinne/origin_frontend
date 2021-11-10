import Avatar from "@material-ui/core/Avatar";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function ChatMessage(props) {
  const { t } = useTranslation();
  const { item } = props;
  const contact = item.user;

  const loggedInEmail = useSelector(
    ({ auth }) => auth.user.data.email
  );

  const formatter = buildFormatter(frenchStrings);
  const fullName = contact.prenom + " " + contact.nomFamille;

  const isYou = contact.courriel === loggedInEmail;

  return (
    <div className="flex justify-center mb-16" key={item.id}>
      <div className="flex items-center bg-white h-28  pr-8 rounded-full shadow-1">
        <Avatar
          className="h-24 w-24 m-0 text-xs ml-1 mr-8"
          src={contact.picture}
          alt={fullName}
        >
          {!contact.picture ? contact.prenom[0] : ""}
        </Avatar>
        <div className="leading-tight whitespace-pre-wrap text-gray-600">
          {t(
            isYou
              ? "chat:chat_room_created_by_you"
              : "chat:chat_room_created_by",
            { user: fullName }
          )}
          {", "}
          <TimeAgo
            date={parseInt(item.createdAt)}
            formatter={formatter}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
