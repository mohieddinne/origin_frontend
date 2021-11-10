// import Avatar from "@material-ui/core/Avatar";
// import TimeAgo from "react-timeago";
// import frenchStrings from "react-timeago/lib/language-strings/fr";
// import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
// import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function ChatMessage(props) {
  // const { t } = useTranslation();
  const { item } = props;
  // const contact = item.user;
  const uId2 = item.content.replace("user_invited_", "");

  const user = useSelector(({ auth }) => auth.user.data);

  const u2 = useSelector(({ chatApp }) =>
    // eslint-disable-next-line eqeqeq
    chatApp.contacts.find((contact) => contact.id_Emp == uId2)
  );

  if (!u2 || u2.courriel === user.email) return null;

  // const formatter = buildFormatter(frenchStrings);
  // const fullNameU1 = contact.prenom + " " + contact.nomFamille;
  // const fullNameU2 = u2.prenom + " " + u2.nomFamille;

  // const isYou = contact.courriel === user.email;
  return null;
  /* return (
    <div className="flex justify-center mb-16" key={item.id}>
      <div className="flex items-center bg-white h-28  pr-8 rounded-full shadow-1">
        <Avatar
          className="h-24 w-24 m-0 text-xs ml-1 mr-8"
          src={contact.picture}
          alt={fullNameU1}
        >
          {!contact.picture ? contact.prenom[0] : ""}
        </Avatar>
        <div className="leading-tight whitespace-pre-wrap text-gray-600">
          {t(
            isYou
              ? "chat:you_invited_u2_to_join"
              : "chat:u1_invited_u2_to_join",
            {
              user_1: fullNameU1,
              user_2: fullNameU2,
            }
          )}
          {", "}
          <TimeAgo
            date={parseInt(item.createdAt)}
            formatter={formatter}
          />
        </div>
      </div>
    </div>
  ); */
}

export default ChatMessage;
