import FuseAnimateGroup from "@fuse/components/FuseAnimateGroup";
import FuseScrollbars from "@fuse/components/FuseScrollbars";
import FuseUtils from "@fuse/FuseUtils";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
//import ContactItem from "./ContactItem";
import { useTranslation } from "react-i18next";
import ChatsSidebarHeader from "./ChatsSidebarHeader";
import RoomListItem from "./RoomListItem";

function ChatsSidebar() {
  const { t } = useTranslation();

  //const contacts = useSelector(({ chatApp }) => chatApp.contacts);
  const rooms = useSelector(({ chatApp }) => chatApp.rooms);

  /*const usersInOneToOneRooms = useSelector(({ chatApp, auth }) => {
    const userIds = new Set();
    for (const room of chatApp.rooms) {
      if (room.users.length <= 2) {
        room.users
          .filter((user) => {
            return user.courriel !== auth.user.data.email;
          })
          .map((user) => {
            userIds.add(user.courriel);
            return user.courriel;
          });
      }
    }
    return userIds;
  });*/

  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex flex-col flex-auto h-full">
      <ChatsSidebarHeader {...{ searchText, setSearchText }} />

      <FuseScrollbars className="overflow-y-auto flex-1">
        <List className="w-full">
          {useMemo(() => {
            const getFilteredArray = (arr, _searchText) => {
              if (_searchText.length === 0) return arr;
              return FuseUtils.filterArrayByString(arr, _searchText);
            };

            const filteredRooms = getFilteredArray(
              [...rooms],
              searchText
            );

            return (
              <FuseAnimateGroup
                enter={{ animation: "transition.expandIn" }}
                className="flex flex-col flex-shrink-0"
              >
                {filteredRooms.length > 0 && (
                  <Typography
                    className="font-300 text-20 px-16 py-24"
                    color="secondary"
                  >
                    {t("chat:conversation", {
                      count: filteredRooms.length,
                    })}
                  </Typography>
                )}

                {filteredRooms.map((room) => (
                  <RoomListItem
                    key={room.id}
                    room={room}
                    onContactClick={(roomId) => {}}
                  />
                ))}
              </FuseAnimateGroup>
            );
          }, [searchText, rooms, t])}

          {/*useMemo(() => {
            const getFilteredContact = (arr, _searchText) => {
              const contacts = arr.filter((contact) => {
                return !usersInOneToOneRooms.has(contact.courriel);
              });
              if (_searchText.length === 0) return contacts;
              return FuseUtils.filterArrayByString(
                contacts,
                _searchText
              );
            };

            const filteredContacts = getFilteredContact(
              [...contacts],
              searchText
            );

            return (
              <FuseAnimateGroup
                enter={{ animation: "transition.expandIn" }}
                className="flex flex-col flex-shrink-0"
              >
                {filteredContacts.length > 0 && (
                  <Typography
                    className="font-300 text-20 px-16 py-24"
                    color="secondary"
                  >
                    {t("chat:contact", {
                      count: filteredContacts.length,
                    })}
                  </Typography>
                )}

                {filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.courriel}
                    contact={contact}
                  />
                ))}
              </FuseAnimateGroup>
            );
          }, [contacts, searchText, t, usersInOneToOneRooms])*/}
        </List>
      </FuseScrollbars>
    </div>
  );
}

export default ChatsSidebar;
