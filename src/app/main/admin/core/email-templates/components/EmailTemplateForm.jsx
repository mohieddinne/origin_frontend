import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularProgress from "@material-ui/core/CircularProgress";
import { TextFieldFormsy, CheckboxFormsy } from "@fuse";
import Formsy from "formsy-react";
import ReactHtmlParser from "react-html-parser";
import CKEditorFormsy from "@catu/components/formsy/CKEditorFormsy";
import { useMutation, gql } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  card: {
    background: "#fafafa",
    border: "1px solid #e2e2e2",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const query = gql`
  mutation emailTemplateContent($data: TemplateContentInput) {
    emailTemplateContent(data: $data)
  }
`;

function EmailTemplateForm(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const [update, { loading }] = useMutation(query);

  const [item, setItem] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [isEditable, setEditable] = useState(false);
  const [isPlainText, setPlaintext] = useState(false);
  const [isValid, setValid] = useState(true);

  useEffect(() => {
    setItem(props.item);
    setPlaintext(props.item.plaintext);
  }, [props.item]);

  const handleEdit = () => {
    setEditable(!isEditable);
  };

  const handleSubmit = (model) => {
    if (isValid)
      update({
        variables: {
          data: {
            ...model,
            id: item.id,
            emailTemplateId: parseInt(props.id),
            plaintext: isPlainText,
          },
        },
      })
        .then(() => {
          setEditable(false);
          setItem({ ...item, ...model });
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production")
            console.error(error);
        });
  };

  const handleExpandClick = () => {
    if (!loading) setExpanded(!expanded);
  };

  return (
    <div className="m-12">
      <div
        className={clsx(
          "flex items-center rounded-8 p-16",
          classes.card,
          {
            "cursor-pointer": !loading,
          }
        )}
        onClick={handleExpandClick}
      >
        <Typography
          variant="subtitle1"
          component="h3"
          className="leading-none m-0 p-0"
        >
          {t("language")}: {item.language}
        </Typography>
        <IconButton
          disabled={loading}
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Formsy
          onSubmit={handleSubmit}
          preventDefaultSubmit={true}
          onValid={() => setValid(true)}
          onInvalid={() => setValid(false)}
          className="py-24 px-8 max-w-2xl"
        >
          <div className="flex justify-between">
            <div>
              {isEditable ? (
                <TextFieldFormsy
                  disabled={loading}
                  className="mb-16"
                  label={t("emltmp:subject")}
                  autofocus
                  validationErrors={{
                    required: t("error.form.required"),
                  }}
                  required
                  id="subject"
                  name="subject"
                  fullWidth
                  variant="outlined"
                  value={item.subject}
                />
              ) : (
                <div className="mb-8">
                  <span className="font-bold">
                    {t("emltmp:subject")}:{" "}
                  </span>
                  {item.subject}
                </div>
              )}

              {isEditable ? (
                <TextFieldFormsy
                  disabled={loading}
                  className="mb-8"
                  label={t("emltmp:from_name")}
                  autofocus
                  id="fromName"
                  name="fromName"
                  fullWidth
                  variant="outlined"
                  value={item.fromName}
                />
              ) : (
                <div className="mb-8">
                  <span className="font-bold">
                    {t("emltmp:from_name")}:{" "}
                  </span>
                  {item.fromName || t("emltmp:default_sender")}
                </div>
              )}

              {isEditable ? (
                <CheckboxFormsy
                  disabled={loading}
                  className="mb-8"
                  label={t("emltmp:html_in_mail")}
                  autofocus
                  validationErrors={{
                    required: t("error.form.required"),
                  }}
                  onChange={() => setPlaintext(!isPlainText)}
                  id="plaintext"
                  name="plaintext"
                  fullWidth
                  variant="outlined"
                  value={!isPlainText}
                />
              ) : (
                <div className="mb-8">
                  <span className="font-bold">
                    {t("emltmp:html_in_mail")}:{" "}
                  </span>
                  {!isPlainText ? t("yes") : t("no")}
                </div>
              )}
            </div>
            <div>
              {isEditable ? (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    disableElevation
                    className="mr-4"
                    disabled={loading}
                    onClick={() => setEditable(false)}
                  >
                    {t("button.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !isValid}
                    disableElevation
                    style={{ width: "140px" }}
                  >
                    {loading ? (
                      <CircularProgress
                        style={{
                          width: "20px",
                          height: "20px",
                        }}
                      />
                    ) : (
                      t("save")
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={handleEdit}
                  disabled={loading}
                >
                  {t("edit")}
                </Button>
              )}
            </div>
          </div>
          <div className="mb-8">
            <div className="font-bold mb-4">
              {t("emltmp:message")}:{" "}
            </div>
            {isEditable ? (
              !isPlainText ? (
                <CKEditorFormsy
                  disabled={loading}
                  name="message"
                  value={item.message}
                />
              ) : (
                <TextFieldFormsy
                  disabled={loading}
                  className="mb-8"
                  autofocus
                  validationErrors={{
                    required: t("error.form.required"),
                  }}
                  required
                  rows={16}
                  multiline
                  id="message"
                  name="message"
                  fullWidth
                  variant="outlined"
                  value={item.message}
                />
              )
            ) : (
              <div className="px-16 py-24 bg-gray-100 rounded-8">
                {!isPlainText
                  ? ReactHtmlParser(item.message)
                  : item.message}
              </div>
            )}
          </div>
        </Formsy>
      </Collapse>
    </div>
  );
}

export default EmailTemplateForm;
