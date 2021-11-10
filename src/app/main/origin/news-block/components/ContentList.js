import React from "react";
import { FuseAnimateGroup } from "@fuse";
import List from "@material-ui/core/List";
import NewsCardItem from "./listItems/NewsCardItem";
import NewsListItem from "./listItems/NewsListItem";
import { withRouter } from "react-router-dom";
import { DISPLAY_TYPES } from "../ContentConst";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, gql } from "@apollo/client";
import * as MainActions from "app/store/actions";
import * as Actions from "../store/actions";
import clsx from "clsx";

const marckNewsQuery = gql`
  mutation updateContent($content: ContentInput!) {
    content(content: $content)
  }
`;

function ContentList(props) {
  const dispatch = useDispatch();
  const displayType = useSelector(({ newsBlockApp }) => {
    return newsBlockApp.displayType;
  });

  const [deleteUnreadNews] = useMutation(marckNewsQuery);

  const { data, history } = props;

  const openContent = (content) => {
    deleteUnreadNews({
      variables: { content: { id: content.id, read: false } },
    }).then(() => {
      dispatch(MainActions.updateCountOnItem("/news-block", -1));
      dispatch(Actions.updateContent(content.id, true, "read"));
    });
    const url = content.id + (content.slug ? "-" + content.slug : "");
    history.push("/news-block/content/" + url);
  };

  const editContent = (content) => {
    history.push("/news-block/edit/" + content.id);
  };

  const isGrid = displayType === DISPLAY_TYPES.GRID;

  const W = isGrid ? React.Fragment : List;

  return (
    <W>
      <FuseAnimateGroup
        enter={{
          animation: "transition.slideUpBigIn",
        }}
        className={clsx({ "flex flex-wrap py-24": isGrid })}
      >
        {data.map((content) => {
          const Comp = isGrid ? NewsCardItem : NewsListItem;
          return (
            <Comp
              onOpenContent={openContent}
              editContent={editContent}
              content={content}
              key={content.id}
              isAdmin={false}
              className={clsx({
                "w-full rounded-8 shadow-none border-1 mb-16": isGrid,
              })}
            />
          );
        })}
      </FuseAnimateGroup>
    </W>
  );
}

export default withRouter(ContentList);
