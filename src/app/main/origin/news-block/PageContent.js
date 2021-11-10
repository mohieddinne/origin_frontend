import React, { useEffect, useState } from "react";
import withReducer from "app/store/withReducer";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import { FusePageSimple } from "@fuse";
import ContentPageHeader from "./components/ContentPageHeader";
import ContentPageToolbar from "./components/ContentPageToolbar";
import ContentPageContent from "./components/ContentPageContent";

function Page(props) {
  const dispatch = useDispatch();

  const { match } = props;

  const { data } = useSelector(({ newsBlockApp }) => newsBlockApp);
  const user = useSelector(({ auth }) => auth.user);

  const [content, setContent] = useState(null);
  const [id, setContentId] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(Actions.getContents());
  }, [dispatch]);

  useEffect(() => {
    const { url, params } = match;
    const { contentId } = params;
    const edit =
      url.indexOf("news-block/edit/") >= 0 ||
      url.indexOf("news-block/create") >= 0;
    setEdit(edit);
    setContentId(parseInt(contentId));
  }, [match]);

  useEffect(() => {
    // Handle toBePublished flag
    if (content) {
      const today = new Date();
      const publishedAt = new Date(content.publishedAt);
      content.toBePublishedFlag =
        publishedAt.getTime() > today.getTime();
    }
    // Handle content text
    if (content && content.id !== 0 && !content.content) {
      dispatch(Actions.getContentText(content.id));
    }
  }, [content, dispatch]);

  useEffect(() => {
    if (data && id > 0) {
      const content_ = data.find((el) => el.id === id);
      if (content_) {
        setContent(content_);
      }
    } else if (edit) {
      setContent({
        id: 0,
        featured_image: null,
        title: "",
        content: "",
        status: 2,
        author: {
          prenom: user.data.firstName,
          nomFamille: user.data.lastName,
        },
      });
    }
  }, [id, data, user, edit]);

  return (
    <FusePageSimple
      header={
        <ContentPageHeader
          edit={edit}
          title={(content && content.title) || null}
        />
      }
      contentToolbar={
        <ContentPageToolbar
          {...{ edit, loading, setLoading, content, setContentId }}
        />
      }
      content={
        <ContentPageContent
          {...{ content, edit, loading, setContent }}
        />
      }
    />
  );
}

export default withReducer("newsBlockApp", reducer)(Page);
