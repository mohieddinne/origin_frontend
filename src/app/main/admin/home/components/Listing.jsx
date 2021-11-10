import React from "react";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimateGroup } from "@fuse";
import { NavLinkAdapter } from "@fuse";
import adminMenuHelper from "../helper";
import { useTranslation } from "react-i18next";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  almostHidden: {
    opacity: "0.4",
  },
}));

function Listing() {
  const { t } = useTranslation();
  const classes = useStyles();
  const data = adminMenuHelper();

  if (!Array.isArray(data) || data.length <= 0) {
    return (
      <div className="w-full max-w-512 pb-24 md:w-1/2 md:p-16">
        {t("error.access")}
      </div>
    );
  }

  return (
    <FuseAnimateGroup
      enter={{ animation: Transition.slideUpBigIn }}
      className="flex flex-wrap justify-center max-w-xl w-full mx-auto px-16 sm:px-24 py-32"
    >
      {data.map((category) => (
        <div
          className="w-full max-w-512 pb-24 md:w-1/2 md:p-16"
          key={category.id}
        >
          <Card elevation={1}>
            <CardContent>
              <Typography
                className="font-bold px-16 pb-16 pt-8 strong"
                color="textPrimary"
              >
                {category.title}
              </Typography>
              <List component="nav">
                {category.elements.map((item) => (
                  <ListItem
                    key={item.id}
                    button
                    to={item.url ? item.url : "#"}
                    component={NavLinkAdapter}
                    className={item.url ? "" : classes.almostHidden}
                  >
                    <ListItemIcon className="mr-0 min-w-40">
                      <Icon>
                        {item.icon ? item.icon : "settings"}
                      </Icon>
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </div>
      ))}
    </FuseAnimateGroup>
  );
}

export default Listing;
