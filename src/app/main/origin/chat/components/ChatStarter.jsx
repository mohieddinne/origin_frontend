import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import * as Actions from "../store/actions";
import { useDispatch } from "react-redux";

function ChatStarter() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-24">
      <Paper className="rounded-full p-48 md:p-64 shadow-xl">
        <Icon className="block text-64 md:text-128" color="secondary">
          chat
        </Icon>
      </Paper>
      {/*<Typography
        variant="h6"
        className="mt-24 mb-12 text-32 font-700"
      >
        {t("chat:chat_app_name")}
      </Typography>
      <Typography
        className="hidden md:flex px-16 pb-24 text-16 text-center"
        color="textSecondary"
      >
        {t("chat:select_a_contact_to_chat")}
      </Typography>*/}
      <Button
        variant="outlined"
        color="primary"
        className="flex mt-16 md:hidden"
        onClick={() => dispatch(Actions.toggleSidebar())}
      >
        {t("chat:select_a_contact_to_chat")}
      </Button>
    </div>
  );
}

export default ChatStarter;
