import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import Input from "@material-ui/core/Input";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import StatusIcon from "./StatusIcon";
import { useTranslation } from "react-i18next";

function ChatsSidebarHeader({ searchText, setSearchText }) {
  const { t } = useTranslation();
  const user = useSelector(({ auth }) => auth.user);

  return (
    <div className="flex bg-gray-200 py-12">
      <div className="relative w-40 h-40 p-0 mx-12">
        {user.data.photoURL ? (
          <Avatar
            className="w-40 h-40"
            alt={user.data.displayName}
            src={user.data.photoURL}
          />
        ) : (
          <Avatar className="w-40 h-40">
            {user.data.displayName[0]}
          </Avatar>
        )}
        <div className="absolute right-0 bottom-0 -m-4 z-10">
          <StatusIcon status="online" />
        </div>
      </div>
      {useMemo(
        () => (
          <div className="flex p-4 items-center w-full px-8 ml-4 mr-8 bg-white py-4 rounded-8 shadow">
            <Icon color="action">search</Icon>
            <Input
              placeholder={t("chat:search_or_start_new_chat")}
              className="flex flex-1 px-8"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                "aria-label": t("chat:search"),
              }}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        ),
        [searchText, setSearchText, t]
      )}
    </div>
  );
}

export default ChatsSidebarHeader;
