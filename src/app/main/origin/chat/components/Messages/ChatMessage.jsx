import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { useSelector } from "react-redux";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  messageRow: {
    "& .time": {
      whiteSpace: "nowrap",
    },
    "&.contact": {
      "& .bubble": {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.getContrastText(
          theme.palette.background.paper
        ),
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        "& .time": {
          marginLeft: 12,
        },
      },
      "&.first-of-group": {
        "& .bubble": {
          borderTopLeftRadius: 20,
        },
      },
      "&.last-of-group": {
        "& .bubble": {
          borderBottomLeftRadius: 20,
        },
      },
    },
    "&.me": {
      paddingLeft: 40,

      "& .avatar": {
        order: 2,
        margin: "0 0 0 16px",
      },
      "& .bubble": {
        marginLeft: "auto",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        "& .time": {
          justifyContent: "flex-end",
          right: 0,
          marginRight: 12,
        },
      },
      "&.first-of-group": {
        "& .bubble": {
          borderTopRightRadius: 20,
        },
      },

      "&.last-of-group": {
        "& .bubble": {
          borderBottomRightRadius: 20,
        },
      },
    },
    "&.contact + .me, &.me + .contact": {
      paddingTop: 20,
      marginTop: 20,
    },
    "&.first-of-group": {
      "& .bubble": {
        borderTopLeftRadius: 20,
        paddingTop: 13,
      },
    },
    "&.last-of-group": {
      "& .bubble": {
        borderBottomLeftRadius: 20,
        paddingBottom: 13,
        "& .time": {
          display: "flex",
        },
      },
    },
  },
}));

function ChatMessage(props) {
  const {
    i,
    item,
    isFirstOfGroup,
    isLastOfGroup,
    isLastMessage,
  } = props;
  const contact = item.user;

  const userCourriel = useSelector(
    ({ auth }) => auth.user.data.email
  );

  const classes = useStyles(props);

  function shouldShowContactAvatar(item, i) {
    return (
      item.user.courriel !== userCourriel &&
      (isFirstOfGroup || isLastOfGroup)
    );
  }

  const formatter = buildFormatter(frenchStrings);

  return (
    <div
      key={item.id}
      className={clsx(
        classes.messageRow,
        "flex flex-col flex-grow-0 flex-shrink-0 items-start justify-end relative px-16 pb-4",
        {
          me: contact.courriel === userCourriel,
          contact: contact.courriel !== userCourriel,
          "first-of-group": isFirstOfGroup,
          "last-of-group": isLastOfGroup,
          "pb-96": isLastMessage,
        }
      )}
    >
      {shouldShowContactAvatar(item, i) && (
        <Tooltip title={contact.prenom + " " + contact.nomFamille}>
          <Avatar
            className="avatar absolute left-0 m-0 -mx-32"
            src={contact.picture}
            alt={contact.prenom + " " + contact.nomFamille}
          >
            {!contact.picture ? contact.prenom[0] : ""}
          </Avatar>
        </Tooltip>
      )}
      <div className="bubble flex relative items-center justify-center p-12 max-w-full shadow">
        <div className="leading-tight whitespace-pre-wrap">
          {item.content}
        </div>
        <Typography
          className="time absolute hidden w-full text-11 mt-8 -mb-24 left-0 bottom-0 whitespace-nowrap"
          color="textSecondary"
        >
          <TimeAgo
            date={parseInt(item.createdAt)}
            formatter={formatter}
          />
        </Typography>
      </div>
    </div>
  );
}

export default ChatMessage;
