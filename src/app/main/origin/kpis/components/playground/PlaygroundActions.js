import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import * as Actions from "../../store/actions";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";
import PdfButton from "../pdf/PdfButton";

function PlaygroundActions({ index, hideOptions }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector(({ kpisApp }) => kpisApp.loading > 0);

  const handleResetFilters = () => {
    dispatch(Actions.resetFilters(index));
  };

  const handlePlayground = () => {
    dispatch(
      Actions[index === 0 ? "addPlayground" : "removePlayground"](
        index
      )
    );
  };

  return (
    <Card
      className="w-full rounded-8 shadow-none border-1 py-0 px-8"
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      <div className="flex flex-wrap p-8">
        {!hideOptions && (
          <div className="flex w-full flex-wrap justify-between items-center p-6">
            <Title index={index} />
            <div className="flex items-center justify-between md:justify-start flex-wrap w-full md:w-auto">
              <div className="mr-4 hidden sm:flex">
                <Typography className="text-gray" component="span">
                  {t("kpisApp:to_calculate")}:
                </Typography>
              </div>
              <div className="py-0 sm:py-4 mb-8 sm:mb-0 mr-0 sm:mr-4 w-full sm:w-auto">
                <MathMethodButtonGroup index={index} />
              </div>
              <div className="py-4 mr-0 sm:mr-4">
                <Button
                  size="small"
                  variant="outlined"
                  className="h-32"
                  onClick={handleResetFilters}
                  disabled={loading}
                >
                  {t("reset_filters")}
                </Button>
              </div>
              <div className="py-4 mr-0 sm:mr-4">
                <PdfButton index={index} />
              </div>
              <div className="py-4 hidden sm:flex">
                <Tooltip
                  title={t(
                    `kpisApp:${
                      index === 0
                        ? "split_screen_on_half"
                        : "remove_this_side_of_screen"
                    }`
                  )}
                  aria-label="split"
                >
                  <Button
                    size="small"
                    variant="outlined"
                    className="h-32"
                    onClick={handlePlayground}
                    disabled={loading}
                  >
                    <Icon fontSize="small">
                      {index === 0 ? "add_circle" : "remove_circle"}
                    </Icon>
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function Title({ index }) {
  const { t } = useTranslation();
  const show = useSelector(({ kpisApp }) => {
    return (kpisApp.filters || []).length > 1;
  });

  return (
    <Typography className="h3 sm:h2 w-full sm:w-auto mb-8 font-bold hidden sm:flex">
      {show && `${t("kpisApp:comparative")} #${index + 1}`}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  selected: {
    background: theme.palette.primary.main + " !important",
    color: theme.palette.primary.contrastText + " !important",
  },
}));

function MathMethodButtonGroup({ index }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector(({ kpisApp }) => kpisApp.loading > 0);
  const math = useSelector(({ kpisApp }) => kpisApp.math[index]);

  const handleMathChange = (value) => {
    dispatch(Actions.setMath(value, index));
  };

  return (
    <ButtonGroup size="small" className="h-32 w-full">
      <Button
        size="small"
        disabled={math === "income" || loading}
        classes={{
          root: "w-1/3 sm:w-auto",
          disabled: !loading && classes.selected,
        }}
        onClick={() => handleMathChange("income")}
      >
        <span className="hidden sm:block">{t(`kpisApp:income`)}</span>
        <span className="block sm:hidden">
          {t(`kpisApp:income_small`)}
        </span>
      </Button>
      <Button
        size="small"
        disabled={math === "number" || loading}
        classes={{
          root: "w-1/3 sm:w-auto",
          disabled: !loading && classes.selected,
        }}
        onClick={() => handleMathChange("number")}
      >
        <span className="hidden sm:block">{t(`kpisApp:number`)}</span>
        <span className="block sm:hidden">
          {t(`kpisApp:number_small`)}
        </span>
      </Button>
      <Button
        size="small"
        disabled={math === "delays" || loading}
        classes={{
          root: "w-1/3 sm:w-auto",
          disabled: !loading && classes.selected,
        }}
        onClick={() => handleMathChange("delays")}
      >
        {t(`kpisApp:delays`)}
      </Button>
    </ButtonGroup>
  );
}

export default PlaygroundActions;
