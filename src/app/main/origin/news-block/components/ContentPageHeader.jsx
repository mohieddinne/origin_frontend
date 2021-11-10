import React from "react";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ContentPageHeader(props) {
  const { t } = useTranslation();
  const { title, edit } = props;
  return (
    <div className="flex flex-1 items-center justify-between p-24">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Icon className="text-18" color="action">
            bookmarks
          </Icon>
          <Icon className="text-16" color="action">
            chevron_right
          </Icon>
          <Typography
            color="textSecondary"
            to={edit ? "/news-block/admin/" : "/news-block"}
            component={Link}
            style={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            {t("news_block")}
          </Typography>
          {title && (
            <>
              <Icon className="text-16" color="action">
                chevron_right
              </Icon>
              <Typography color="textSecondary">{title}</Typography>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentPageHeader;
