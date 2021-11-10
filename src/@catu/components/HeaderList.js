import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FuseAnimate from "@fuse/components/FuseAnimate";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";

function ListHeader(props) {
  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();
  const { icon, title, actions, Input } = props;
  const options = props.options || {};

  const backProps = {};
  if (typeof options.goBack === "function") {
    backProps.component = "div";
    backProps.onClick = () => options.goBack();
  } else if (typeof options.goBack === "string") {
    backProps.component = Link;
    backProps.to = options.goBack;
  } else if (options.goBack === true) {
    backProps.component = "div";
    backProps.onClick = () => {
      const catu = window.catu || {};
      const historyLog = catu.history || [];
      const hasHistory = historyLog.length > 1;
      if (hasHistory) history.goBack();
      else if (options.defaultGoBackLink)
        history.push(options.defaultGoBackLink);
    };
  }

  const mainTheme = useSelector(
    ({ fuse }) => fuse.settings.mainTheme
  );

  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div>
        {backProps.component && (
          <div>
            <FuseAnimate
              animation="transition.slideRightIn"
              delay={500}
            >
              <Typography
                className="normal-case flex items-center sm:mb-12"
                role="button"
                color="inherit"
                {...backProps}
              >
                <Icon className="text-20">
                  {theme.direction === "ltr"
                    ? "arrow_back"
                    : "arrow_forward"}
                </Icon>
                <span className="mx-4">
                  {options.goBack_string || t("back")}
                </span>
              </Typography>
            </FuseAnimate>
          </div>
        )}
        <div className="flex items-center">
          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Icon className="text-32">
              {icon || "format_list_bulleted"}
            </Icon>
          </FuseAnimate>
          <FuseAnimate animation="transition.slideLeftIn" delay={300}>
            <Typography
              className="hidden sm:flex mx-0 sm:mx-12"
              variant="h6"
            >
              {title || t("list")}
            </Typography>
          </FuseAnimate>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-12">
        {Input && (
          <ThemeProvider theme={mainTheme}>
            <FuseAnimate
              animation="transition.slideDownIn"
              delay={300}
            >
              <Paper
                className="flex items-center w-full max-w-512 px-8 py-4 rounded-8"
                elevation={1}
              >
                <Icon color="action">search</Icon>
                {Input && <Input />}
              </Paper>
            </FuseAnimate>
          </ThemeProvider>
        )}
      </div>
      {Array.isArray(actions) && (
        <FuseAnimate animation="transition.slideRightIn" delay={300}>
          <>
            {actions.map((item, key) => {
              const Component = () => item;
              return <Component key={key} />;
            })}
          </>
        </FuseAnimate>
      )}
    </div>
  );
}

export default ListHeader;
