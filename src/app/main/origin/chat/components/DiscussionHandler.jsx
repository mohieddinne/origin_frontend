import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Chat from "./Chat";
import StatusIcon from "../components/StatusIcon";
import { useSelector, useDispatch } from "react-redux";
import ChatStarter from "./ChatStarter";
import { useHistory } from "react-router-dom";
import RoomIcon from "./RoomIcon";
import * as Actions from "../store/actions";

const useStyles = makeStyles((theme) => ({
  content: {
    display: "flex",
    flex: "1 1 100%",
    minHeight: 0,
  },
}));

function DiscussionLinkHandler(props) {
  const history = useHistory();
  const { roomId } = props;

  const room = useSelector(({ chatApp }) => {
    if (roomId === "last") return chatApp.rooms[0];
    const rId = parseInt(roomId.replace("n", "-"));
    // eslint-disable-next-line eqeqeq
    return chatApp.rooms.find((room) => room.id == rId);
  });

  if (!room) return <ChatStarter />;

  if (roomId === "last") {
    const rId = room.id > 0 ? room.id : "n" + -room.id;
    history.push("/app/chat/r/" + rId);
  }

  return <DiscussionHandler room={room} {...props} />;
}

function DiscussionHandler({ room }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userEmail = useSelector(({ auth }) => auth.user.data.email);

  const roomMembers = room.users.filter((user) => {
    return user.courriel !== userEmail;
  });

  let roomName = room.name;
  const noName = !roomName || roomName === "no_name_group";
  if (noName) {
    roomName = roomMembers
      .map((member) => {
        return member.prenom + " " + member.nomFamille;
      })
      .join(", ");
    if (roomName.length > 36)
      roomName = roomName.substr(0, 80) + "...";
  }

  return (
    <>
      <AppBar className="w-full shadow-md" position="static">
        <Toolbar className="px-16">
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => dispatch(Actions.toggleSidebar())}
            className="flex md:hidden"
          >
            <Icon>chat</Icon>
          </IconButton>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {}}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
          >
            <div className="relative mx-8">
              <div className="absolute right-0 bottom-0 -m-4 z-10">
                <StatusIcon status={room.status} />
              </div>

              <RoomIcon roomMembers={roomMembers} name={roomName} />
            </div>
            <Typography
              color="inherit"
              className="text-18 font-600 px-4"
            >
              {roomName}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>

      <div className={classes.content}>
        <Chat room={room} className="flex flex-1 z-10" />
      </div>
    </>
  );
}

export default DiscussionLinkHandler;
