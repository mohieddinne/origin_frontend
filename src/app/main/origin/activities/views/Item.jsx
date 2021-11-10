import React from "react";
import { FusePageCarded } from "@fuse";
import withReducer from "app/store/withReducer";
import reducer from "../store/reducer";
import { useTranslation } from "react-i18next";
import HeaderForm from "@catu/components/HeaderForm";
import { useHistory } from "react-router-dom";
import ActivityForm from "../components/ActivityForm";

function ActivityItemStateHandler(props) {
  // const { itemId } = useParams();
  // let ids = null;
  //if (itemId !== "new" && parseInt(itemId)) ids = [parseInt(itemId)];

  return <ActivityItemPage {...props} />;
}

function ActivityItemPage(props) {
  const { t } = useTranslation("activities");
  const history = useHistory();

  const path = history.location?.pathname || "";
  const isNew = path.includes("new");
  const url = "/app/activities/list";

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "py-24",
        contentCard: "rounded-8 overflow-hidden h-auto",
        contentWrapper: "mb12",
      }}
      header={
        <HeaderForm
          strings={{
            defaultTitle: t(isNew ? "new_activity" : "edit_activity"),
            caption: t(
              isNew ? "new_activity_details" : "activity_details"
            ),
            list_name: t("back_to_activity_list"),
          }}
          options={{
            goBack: true,
            defaultGoBackLink: url,
            showIconEditor: false,
            button_save: false,
          }}
        />
      }
      content={<ActivityForm />}
      innerScroll
    />
  );
}

export default withReducer(
  "activityApp",
  reducer
)(ActivityItemStateHandler);
