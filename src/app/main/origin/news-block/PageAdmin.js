import React, { useEffect, useMemo, useCallback } from "react";
import NewsCardItem from "./components/listItems/NewsCardItem";
import withReducer from "app/store/withReducer";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import { makeStyles } from "@material-ui/styles";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { FusePageSimple, FuseAnimateGroup } from "@fuse";
import FuseUtils from "@fuse/FuseUtils";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  header: {
    background:
      "linear-gradient(to right, " +
      theme.palette.primary.dark +
      " 0%, " +
      theme.palette.primary.main +
      " 100%)",
    color: theme.palette.getContrastText(theme.palette.primary.main),
  },
  headerIcon: {
    position: "absolute",
    top: -64,
    left: 0,
    opacity: 0.04,
    fontSize: 512,
    width: 512,
    height: 512,
    pointerEvents: "none",
  },
  actionsHeader: {
    textAlign: "right",
    width: "100%",
    padding: "0px 24px",
  },
}));

function PageAuth(props) {
  const history = useHistory();

  const canEdit = FuseUtils.hasPermission({
    slug: "content",
    permission: "can_edit",
  });
  const canCreate = FuseUtils.hasPermission({
    slug: "content",
    permission: "can_create",
  });

  if (!canEdit && !canCreate) {
    history.push("/news-block");
    return null;
  }

  return <Page {...props} />;
}

function Page(props) {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const contents = useSelector(({ newsBlockApp }) => {
    return newsBlockApp.data;
  });
  const loading = useSelector(({ newsBlockApp }) => {
    return newsBlockApp.loading;
  });

  const classes = useStyles(props);

  const editContent = useCallback(
    (content) => {
      const url = "/news-block/edit/" + content.id;
      history.push(url);
    },
    [history]
  );

  const createContent = () => {
    history.push("/news-block/create/");
  };

  useEffect(() => {
    dispatch(Actions.getContents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FusePageSimple
      classes={{
        root: classes.layoutRoot,
      }}
      header={
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
                component={Link}
                role="button"
                to="/admin"
                color="textSecondary"
              >
                {t("administration")}
              </Typography>
              <span
                style={{
                  margin: "0px 5px",
                }}
              >
                /
              </span>
              <Typography color="textSecondary">
                <strong>{t("news_block")}</strong>
              </Typography>
            </div>
          </div>
        </div>
      }
      contentToolbar={
        FuseUtils.hasPermission({
          slug: "content",
          permission: "can_create",
        }) && (
          <div className={classes.actionsHeader}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={createContent}
            >
              {t("create")}
            </Button>
          </div>
        )
      }
      content={
        <div className="p-24 pt-0">
          {useMemo(
            () =>
              !loading ? (
                Array.isArray(contents) && contents.length > 0 ? (
                  <FuseAnimateGroup
                    enter={{
                      animation: "transition.slideUpBigIn",
                    }}
                    className="flex flex-wrap pb-24"
                  >
                    {contents.map((content) => {
                      return (
                        <NewsCardItem
                          editContent={editContent}
                          key={content.id}
                          content={content}
                          isAdmin={true}
                          className="w-full rounded-8 shadow-none border-1 mb-16"
                        />
                      );
                    })}
                  </FuseAnimateGroup>
                ) : (
                  <div className="flex flex-1 items-center justify-center">
                    <Typography
                      color="textSecondary"
                      className="text-24 mb-24"
                    >
                      {t("no_content_found")}
                    </Typography>
                  </div>
                )
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <Typography
                    color="textSecondary"
                    className="text-24 mb-24"
                  >
                    {t("loading")}
                  </Typography>
                </div>
              ),
            [contents, editContent, t, loading]
          )}
        </div>
      }
    />
  );
}

export default withReducer("newsBlockApp", reducer)(PageAuth);
