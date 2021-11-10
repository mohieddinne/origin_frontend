import React, { useState, useEffect } from "react";
import CatuFilePageCarded from "@catu/components/PageLayouts/carded/CatuFilePageCarded";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import withReducer from "app/store/withReducer";
import { useDispatch } from "react-redux";
import reducer from "../store/reducer";
import * as Actions from "../store/actions";
import { useTranslation } from "react-i18next";
import HeaderForm from "@catu/components/HeaderForm";
import { showMessage } from "app/store/actions";
import Client from "../components/tabs/Client";
import FoldersTab from "../components/tabs/Folders";
import Facture from "../components/tabs/Facture";
import Contacts from "../components/tabs/Contacts";
import { withRouter } from "react-router-dom";

function Handler(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    return function cleanup() {
      dispatch(Actions.setEditable(false));
    };
  });

  return <Item {...props} />;
}

function Item(props) {
  //const history = useHistory();
  const { history } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [formRef, setFormRef] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  function handleChangeTab(e, tabValue) {
    setTabValue(tabValue);
  }

  const url = "/clients/list";
  const handleResponse = ({ response, error, isNew, exit }) => {
    let variant = "success";
    if (error) {
      variant = "error";
    }
    dispatch(
      showMessage({
        message: t(
          `cApp:${variant}.${isNew ? "creation" : "modification"}`,
          { name: response && response.name }
        ),
        autoHideDuration: 3000,
        variant, //success error info warning null
      })
    );
    exit && (history.goBack() || history.push(url));
    // exit && history.push(history.location.pathname || "/app");

    //exit && history.push(history.goBack() || "/app");
  };

  // Disclamer: to be used when edit;
  const handleSubmit = (exit) => {
    dispatch(
      Actions.submit(formRef.getModel(), handleResponse, exit)
    );
  };

  const toggleEditable = () => {
    dispatch(Actions.setEditable(true));
  };

  return (
    <CatuFilePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        <HeaderForm
          strings={{
            defaultTitle: t("cApp:customer_details"),
            caption: t("cApp:client_details"),
            list_name: t("cApp:client_back_to_list", { count: 2 }),
          }}
          submitAction={handleSubmit}
          reduxStore="clientApp"
          options={{
            goBack: true,
            defaultGoBackLink: url,
            showIconEditor: false,
            button_save: true,
          }}
          toggleEditable={toggleEditable}
        />
      }
      contentToolbar={
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: "w-full h-64" }}
        >
          <Tab
            className="h-64 normal-case"
            label={t("cApp:folder")}
          />
          <Tab
            className="h-64 normal-case"
            label={t("cApp:factures")}
          />
          <Tab
            className="h-64 normal-case"
            label={t("cApp:contacts.index")}
          />
        </Tabs>
      }
      headerCardContent={<Client setFormRef={setFormRef} />}
      content={
        <div className="">
          {tabValue === 0 && <FoldersTab />}
          {tabValue === 1 && <Facture />}
          {tabValue === 2 && <Contacts />}
        </div>
      }
      innerScroll
    />
  );
}

export default withRouter(withReducer("clientApp", reducer)(Handler));
