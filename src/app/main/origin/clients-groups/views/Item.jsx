import React, { useRef, useEffect } from "react";
import CatuFilePageCarded from "@catu/components/PageLayouts/carded/CatuFilePageCarded";
import withReducer from "app/store/withReducer";
import { useDispatch } from "react-redux";
import reducer from "../store/reducer";
import * as Actions from "../store/action";
import { useTranslation } from "react-i18next";
import HeaderForm from "@catu/components/HeaderForm";
import { showMessage } from "app/store/actions";
import { useParams } from "react-router-dom";
import DocumentsTab from "../component/tabs/DocumentsTab";
import { makeStyles } from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query clientGroups($ids: [ID]) {
    clientGroups(ids: $ids) {
      id
      name
      color
      clientCount
      fallback
    }
  }
`;
const useStyle = makeStyles(() => ({
  content: {
    position: "static !important",
  },
}));

function StateHandler(props) {
  const dispatch = useDispatch();
  const { itemId } = useParams();

  let ids = null;
  if (itemId !== "new" && parseInt(itemId)) ids = [parseInt(itemId)];

  const { data, loading } = useQuery(query, {
    variables: { ids },
    skipe: !ids,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    dispatch(Actions.setLoading(loading));
  }, [dispatch, loading]);

  useEffect(() => {
    return () => dispatch(Actions.updateFormData(null));
  }, [dispatch]);

  useEffect(() => {
    if (!ids) {
      dispatch(Actions.updateFormData(null));
    } else if (
      data &&
      Array.isArray(data.clientGroups) &&
      data.clientGroups[0]
    ) {
      dispatch(Actions.setEditable(false));
      dispatch(Actions.updateFormData(data.clientGroups[0]));
    }
  }, [dispatch, data, ids]);

  return <DocumentFormPage {...props} />;
}

const DocumentFormPage = React.memo((props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyle();
  const formRef = useRef();
  const url = "/app/clients/groups";

  const toggleEditable = () => dispatch(Actions.setEditable(true));

  const handleResponse = ({ response, error, isNew, exit }) => {
    let variant = "success";
    if (error) {
      variant = "error";
    }
    const messsage = t(
      `gApp:${variant}.${isNew ? "create" : "edit"}`,
      {
        name: response && response.name,
      }
    );
    dispatch(
      showMessage({
        messsage,
        autoHideDuration: 3000,
        variant,
      })
    );
    exit && props.history.push(url || "/groupe");
  };

  const handleSubmit = (exit) => {
    const model = formRef.current.getModel();
    dispatch(Actions.submit(model, handleResponse, exit));
  };

  return (
    <CatuFilePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        content: classes.content,
      }}
      header={
        <HeaderForm
          strings={{
            defaultTitle: t("gApp:new"),
            caption: t("gApp:group"),
            list_name: t("gApp:group", { count: 2 }),
          }}
          submitAction={handleSubmit}
          reduxStore="ClientsGroupsApp"
          options={{
            goBack: true,
            defaultGoBackLink: url,
            showIconEditor: false,
          }}
          toggleEditable={toggleEditable}
        />
      }
      content={<DocumentsTab formRef={formRef} />}
      innerScroll
    />
  );
});

export default withReducer("ClientsGroupsApp", reducer)(StateHandler);
