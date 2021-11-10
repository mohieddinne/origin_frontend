import React from "react";
import { useDispatch } from "react-redux";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import { useTranslation } from "react-i18next";
import { contentService } from "app/services/originServices";
import * as FuseActions from "app/store/actions";
import * as Actions from "../store/actions";

function ContentPageToolbar(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { edit, loading, setLoading, content, setContentId } = props;

  function handleFormSubmit() {
    setLoading(true);
    let data = {
      id: content.id,
      title: content.title,
      content: content.content,
      status: content.status,
      publishedAt: content.publishedAt,
    };
    contentService
      .up(data)
      .then((response) => {
        setLoading(false);
        // Show a message
        dispatch(
          FuseActions.showMessage({
            message: t("success.content_saved"),
            autoHideDuration: 3000,
            variant: "success", //success error info warning null
          })
        );
        // Dispatch data
        if (content.id > 0) {
          dispatch(
            Actions.updateContent(content.id, data.title, "title")
          );
          dispatch(
            Actions.updateContent(content.id, data.content, "content")
          );
          dispatch(
            Actions.updateContent(content.id, data.status, "status")
          );
          dispatch(
            Actions.updateContent(content.id, Date.now(), "updatedAt")
          );
          dispatch(
            Actions.updateContent(
              content.id,
              content.publishedAt,
              "publishedAt"
            )
          );
        } else {
          setContentId(response);
          dispatch(
            Actions.addContent(
              {
                ...content,
                id: response,
                createdAt: Date.now(),
              },
              true
            )
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        dispatch(
          FuseActions.showMessage({
            message:
              error[0] !== undefined
                ? error[0].message
                : t("error.saving"),
            variant: "error", //success error info warning null
          })
        );
      });
  }

  if (!edit) return null;

  return (
    <div className="flex flex-1 relative overflow-hidden">
      <div
        className={"p-24 w-full max-w-lg rounded-8 overflow-hidden "}
        style={{ margin: "auto" }}
      >
        <FormControl>
          <Button
            variant="outlined"
            color="primary"
            disabled={loading}
            onClick={handleFormSubmit}
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
                <SaveIcon
                  style={{
                    width: "25px",
                    height: "25px",
                  }}
                />
              </>
            )}
            <span style={{ marginLeft: "5px" }}>{t("save")}</span>
          </Button>
        </FormControl>
      </div>
    </div>
  );
}

export default ContentPageToolbar;
