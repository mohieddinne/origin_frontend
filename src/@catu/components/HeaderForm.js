import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FuseAnimate from "@fuse/components/FuseAnimate";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTheme } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import IconEditor from "@catu/components/IconEditor";

const Actions = (props) => {
  const { t } = useTranslation();
  // Check submittable
  const {
    reduxStore,
    handleSubmit,
    toggleEditable,
    button_save,
  } = props;
  const canSubmit = useSelector(
    (state) => state[reduxStore] && state[reduxStore].form.canSubmit
  );
  const isSaved = useSelector(
    (state) => state[reduxStore] && state[reduxStore].form.isSaved
  );
  const loading = useSelector(
    (state) => state[reduxStore] && state[reduxStore].form.loading
  );
  const isNew = useSelector(
    (state) => state[reduxStore] && state[reduxStore].form.isNew
  );
  const isEditable = useSelector(
    (state) => state[reduxStore] && state[reduxStore].form.isEditable
  );

  return (
    <div>
      {!isEditable || !isNew ? (
        toggleEditable && (
          <Button
            className="whitespace-nowrap normal-case ml-10 hidden md:inline-flex"
            variant="outlined"
            color="default"
            disabled={loading}
            onClick={() => {
              if (typeof toggleEditable === "function") {
                toggleEditable();
              } else {
                console.log("not yet implemented");
              }
            }}
            style={{ width: "180px" }}
          >
            {loading ? (
              <CircularProgress
                style={{
                  width: "25px",
                  height: "25px",
                }}
              />
            ) : (
              t("edit")
            )}
          </Button>
        )
      ) : (
        <>
          <Button
            className="whitespace-nowrap normal-case ml-10 hidden md:inline-flex"
            variant="outlined"
            color="default"
            disabled={!canSubmit || isSaved || loading}
            onClick={() => handleSubmit(false)}
            style={{ width: "180px" }}
          >
            {loading ? (
              <CircularProgress
                style={{
                  width: "25px",
                  height: "25px",
                }}
              />
            ) : (
              t("save_stay")
            )}
          </Button>
          {button_save ||
            (button_save === undefined && (
              <Button
                className="whitespace-nowrap normal-case ml-10"
                variant="contained"
                color="secondary"
                disabled={!canSubmit || isSaved || loading}
                onClick={() => handleSubmit(true)}
                style={{ width: "180px" }}
              >
                {loading ? (
                  <CircularProgress
                    style={{
                      width: "25px",
                      height: "25px",
                    }}
                  />
                ) : (
                  <>
                    <span className="md:hidden">{t("save")}</span>
                    <span className="hidden md:inline-flex">
                      {t("save_exit")}
                    </span>
                  </>
                )}
              </Button>
            ))}
        </>
      )}
    </div>
  );
};

const Title = ({ reduxStore, defaultTitle }) => {
  const { t } = useTranslation();
  const loading = useSelector(
    (state) => state[reduxStore] && state[reduxStore].form.loading
  );
  const name = useSelector((state) => {
    return (
      state[reduxStore] &&
      state[reduxStore].form &&
      state[reduxStore].form.data &&
      state[reduxStore].form.data.name
    );
  });

  return (
    <Typography className="text-16 sm:text-20 truncate">
      {loading && !name
        ? t("loading")
        : name || defaultTitle || t("new_item")}
    </Typography>
  );
};

const IconEdit = ({ reduxStore, upload, removeImage }) => {
  const { data, isNew, loading } = useSelector((state) => {
    return (state[reduxStore] && state[reduxStore].form) || {};
  });

  return (
    <IconEditor
      disabled={isNew || loading}
      image={data && data.icon}
      handleUpload={upload}
      handleRemove={removeImage}
    />
  );
};

function ListHeader(props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const history = useHistory();
  const {
    strings,
    submitAction,
    reduxStore,
    handlers,
    toggleEditable,
    options,
  } = props;

  const handleSubmit = (exit) => {
    if (typeof submitAction === "function") {
      submitAction(exit);
    }
  };

  const backProps = {};
  let backString = (strings && strings.list_name) || t("back");
  if (typeof options.goBack === "function") {
    backProps.component = "div";
    backProps.onClick = () => options.goBack();
  } else if (typeof options.goBack === "string") {
    backProps.component = Link;
    backProps.to = {
      pathname: options.goBack,
      state: {
        noReset: true,
      },
    };
  } else if (options.goBack === true) {
    backProps.component = "div";
    const catu = window.catu || {};
    const historyLog = catu.history || [];
    const hasHistory = historyLog.length > 1;
    if (hasHistory) backString = t("back");
    backProps.onClick = () => {
      if (hasHistory) {
        history.goBack();
      } else if (options.defaultGoBackLink) {
        history.push(options.defaultGoBackLink);
      }
    };
  }

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex flex-col items-start max-w-full">
        <FuseAnimate animation="transition.slideRightIn" delay={300}>
          <Typography
            className="normal-case flex items-center sm:mb-12"
            role="button"
            {...backProps}
            color="inherit"
          >
            <Icon className="text-20">
              {theme.direction === "ltr"
                ? "arrow_back"
                : "arrow_forward"}
            </Icon>
            <span className="mx-4">{backString}</span>
          </Typography>
        </FuseAnimate>

        <div className="flex items-center max-w-full">
          {options.showIconEditor && (
            <FuseAnimate animation="transition.expandIn" delay={300}>
              <IconEdit reduxStore={reduxStore} {...handlers} />
            </FuseAnimate>
          )}

          <div className="flex flex-col min-w-0 mr-12 sm:mc-16">
            <Title
              reduxStore={reduxStore}
              defaultTitle={strings.defaultTitle}
            />
            <FuseAnimate
              animation="transition.slideLeftIn"
              delay={300}
            >
              <Typography variant="caption">
                {(strings && strings.caption) ||
                  t("edit_create_form_caption")}
              </Typography>
            </FuseAnimate>
          </div>
        </div>
      </div>
      {submitAction && (
        <FuseAnimate animation="transition.slideRightIn" delay={300}>
          <Actions
            button_save={options.button_save}
            reduxStore={reduxStore}
            handleSubmit={handleSubmit}
            toggleEditable={toggleEditable}
          />
        </FuseAnimate>
      )}
    </div>
  );
}

ListHeader.defaultProps = {
  options: {
    showIconEditor: false,
  },
};

ListHeader.propTypes = {
  strings: PropTypes.object.isRequired,
  submitAction: PropTypes.func,
  handlers: PropTypes.object,
  options: PropTypes.object,
};

export default ListHeader;
