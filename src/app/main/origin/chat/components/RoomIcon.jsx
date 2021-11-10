import React from "react";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Avatar from "@material-ui/core/Avatar";

function RoomIcon(props) {
  const { roomMembers, name } = props;

  if (roomMembers.length > 1 || roomMembers.length === 0) {
    return (
      <Avatar src="/assets/images/logos/round-logo.svg" alt={name}>
        {name && name[0]}
      </Avatar>
    );
  }

  return (
    <AvatarGroup max={2}>
      {roomMembers.map((contact) => {
        const fullName = contact.prenom + " " + contact.nomFamille;
        return (
          <Avatar
            src={contact.picture}
            alt={fullName}
            key={contact.id_Emp}
          >
            {!contact.picture ? contact.prenom[0] : ""}
          </Avatar>
        );
      })}
    </AvatarGroup>
  );
}

export default RoomIcon;
