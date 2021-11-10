import React from "react";
import tkrUploadAdapter from "../libs/uploadAdapter";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import LinearProgress from "@material-ui/core/LinearProgress";
import CoverImageEditor from "./cover-image-editor";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import ReactHtmlParser from "react-html-parser";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/styles";

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
  displayToolbar: {
    width: "100%",
    textAlign: "right",
    paddingRight: "50px",
  },
  displayToolbarTitle: {
    fontWeight: "bold",
  },
  activeDisplayButton: {
    background: "#303030 !important",
    color: "white !important",
    margin: "0px 5px",
  },
  disactiveDisplayButton: {
    margin: "0px 5px",
  },
  toolbarElement: {
    display: "inline",
    marginLeft: "10px",
  },
  orderBySelect: {
    fontSize: "small",
    padding: "5px 5px 5px 15px",
  },
  featuredImage: {
    height: "400px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  contentDetail: {
    marginRight: "5px",
  },
}));

function ContentPageContent(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { content, edit, loading, setContent } = props;
  const formatter = buildFormatter(frenchStrings);

  const statusTxt = [
    t("content_status.published"),
    t("content_status.draft"),
    t("content_status.hidden"),
    t("content_status.planned"),
  ];

  if (!content) return null;
  return (
    <div className="flex flex-1 relative overflow-hidden">
      <div className="w-full overflow-auto">
        <div
          className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64"
          style={{ padding: edit ? "0" : "" }}
        >
          <Paper
            className="w-full max-w-lg rounded-8 overflow-hidden mb-24"
            elevation={1}
          >
            {!edit ? (
              <div
                className={classes.featuredImage}
                style={{
                  backgroundImage: `url(${
                    content.featured_image
                      ? content.featured_image
                      : "assets/images/news-block/default-image.png"
                  })`,
                }}
              ></div>
            ) : (
              content.id > 0 && (
                <div className="px-24 pt-16">
                  <CoverImageEditor
                    image={content.featured_image}
                    post_id={content?.id}
                  />
                </div>
              )
            )}
            <div className={"p-24" + (edit ? " pt-0" : "")}>
              {edit ? (
                <div className="flex flex-wrap py-24">
                  <Box className="w-full sm:w-1/1 lg:w-1/1 flex flex-col mb-16">
                    <FormControl disabled={loading}>
                      <InputLabel htmlFor="content-status">
                        {t("title")}
                      </InputLabel>
                      <Input
                        className="font-bold"
                        placeholder={t("title")}
                        type="text"
                        name="title"
                        value={content.title}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            title: e.target.value,
                          })
                        }
                        readOnly={loading}
                        fullWidth
                      />
                    </FormControl>
                  </Box>
                  <Box
                    className="w-full sm:w-1/2 lg:w-1/2 flex flex-col"
                    p={{ xs: "14px 0px 14px 0px", sm: "0" }}
                  >
                    <FormControl disabled={loading}>
                      <InputLabel htmlFor="content-status">
                        {t("status")}
                      </InputLabel>
                      <Select
                        value={content.status}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            status: e.target.value,
                          })
                        }
                        inputProps={{
                          name: "age",
                          id: "content-status",
                        }}
                      >
                        <MenuItem value={1}>{statusTxt[0]}</MenuItem>
                        <MenuItem value={2}>{statusTxt[1]}</MenuItem>
                        <MenuItem value={3}>{statusTxt[2]}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    className="w-full sm:w-1/2 lg:w-1/2 flex flex-col"
                    p={{ xs: "14px 0px 14px 0px", sm: "0" }}
                  >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <FormControl disabled={loading}>
                        <KeyboardDatePicker
                          className="font-bold"
                          disableToolbar
                          variant="inline"
                          format="yyyy-MM-dd"
                          id="publishedAt"
                          label={t("publishing_date")}
                          value={content.publishedAt || null}
                          onChange={(date) =>
                            setContent({
                              ...content,
                              publishedAt: date,
                            })
                          }
                          readOnly={loading}
                          fullWidth
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </FormControl>
                    </MuiPickersUtilsProvider>
                  </Box>
                </div>
              ) : (
                <Typography variant="h6" className="pb-12">
                  {content.title}
                </Typography>
              )}

              {!edit && (
                <div>
                  <Typography variant="caption">
                    <span className={classes.contentDetail}>
                      <strong>{t("author")}:</strong>{" "}
                      {content.author.prenom}{" "}
                      {content.author.nomFamille}
                    </span>
                    {!edit && (
                      <span className={classes.contentDetail}>
                        | <strong> {t("status")}:</strong>{" "}
                        {content.toBePublishedFlag
                          ? statusTxt[3]
                          : statusTxt[content.status - 1]}
                      </span>
                    )}
                    <div></div>
                    {content.publishedAt && (
                      <span className={classes.contentDetail}>
                        <strong>
                          {content.toBePublishedFlag
                            ? t("content_status.planned")
                            : t("content_status.published")}
                          :
                        </strong>{" "}
                        <TimeAgo
                          date={content.publishedAt}
                          formatter={formatter}
                        />
                      </span>
                    )}
                    {content.updatedAt &&
                      content.updatedAt !== content.createdAt && (
                        <span>
                          | <strong>{t("update")}:</strong>{" "}
                          <TimeAgo
                            date={content.updatedAt}
                            formatter={formatter}
                          />
                        </span>
                      )}
                  </Typography>
                </div>
              )}

              {edit ? (
                <div className="py-12 pb-12">
                  {content === null ||
                  content.content === null ||
                  content.content === undefined ? (
                    <LinearProgress variant="query" />
                  ) : (
                    <CKEditor
                      editor={ClassicEditor}
                      data={content.content ? content.content : ""}
                      onReady={(editor) => {
                        editor.plugins.get(
                          "FileRepository"
                        ).createUploadAdapter = (loader) => {
                          return new tkrUploadAdapter(loader);
                        };
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setContent({
                          ...content,
                          content: data,
                        });
                      }}
                    />
                  )}
                </div>
              ) : (
                <div
                  className="py-12 pb-12"
                  style={{
                    overflowX: "hidden",
                    overflowY: "scroll",
                  }}
                >
                  {!content.content ? (
                    <LinearProgress variant="query" />
                  ) : (
                    ReactHtmlParser(content.content)
                  )}
                </div>
              )}
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default ContentPageContent;
