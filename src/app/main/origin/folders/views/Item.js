import React, { useState, useEffect } from "react";
import CatuFilePageCarded from "@catu/components/PageLayouts/carded/CatuFilePageCarded";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import * as Actions from "../store/actions";
import withReducer from "app/store/withReducer";
import { useDispatch } from "react-redux";
import reducer from "../store/reducer";
import { useTranslation } from "react-i18next";
import HeaderForm from "@catu/components/HeaderForm";
import { showMessage } from "app/store/actions";
import Folder from "../component/tabs/Folder";
import ClientContacts from "../components/tabs/ClientContactsUI";
import InvoicesTab from "../components/tabs/Invoices";
import ClientsAndInsurersTab from "../components/tabs/ClientsAndInsurers";
import { withRouter } from "react-router-dom";
// import FolderDetails from "../component/misc/FolderDetails";

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
  const url = "/app/folders/list";

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [formRef, setFormRef] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event, tabValue) => setTabValue(tabValue);

  const handleResponse = ({ response, error, isNew, exit }) => {
    let variant = "success";
    if (error) {
      variant = "error";
    }
    dispatch(
      showMessage({
        message: t(
          `itemsApp:${variant}.${isNew ? "create" : "update"}`,
          {
            name: response && response.name,
          }
        ),
        autoHideDuration: 3000,
        variant, // success error info warning null
      })
    );
    exit && (history.goBack() || history.push(url));
    //  exit && history.push(history.location.pathname || "/app");
    // exit && history.push(history.goBack() || "/app");
  };

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
            defaultTitle: t("dApp:folder_details"),
            caption: t("dApp:dossier_details"),
            list_name: t("dApp:folder_back_to_list", { count: 2 }),
          }}
          submitAction={handleSubmit}
          reduxStore="folderApp"
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
            label={t("dApp:clients_and_insurers")}
          />
          <Tab
            className="h-64 normal-case"
            label={t("dApp:clients_contacts")}
          />
          <Tab
            className="h-64 normal-case"
            label={t("dApp:factures_details", { count: 2 })}
          />
          {/*<Tab
            className="h-64 normal-case"
            label={t("dApp:other_details")}
          />*/}
        </Tabs>
      }
      headerCardContent={<Folder setFormRef={setFormRef} />}
      content={
        <div className="">
          {tabValue === 0 && <ClientsAndInsurersTab />}
          {tabValue === 1 && <ClientContacts />}
          {tabValue === 2 && <InvoicesTab />}
          {/*tabValue === 3 && <FolderDetails />*/}
        </div>
      }
      innerScroll
    />
  );
}

export default withRouter(withReducer("folderApp", reducer)(Handler));
