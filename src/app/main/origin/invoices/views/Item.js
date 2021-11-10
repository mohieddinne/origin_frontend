import React, { useState } from "react";
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
import Header from "../components/tabs/Header";
import { withRouter } from "react-router-dom";

function Item(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [formRef, setFormRef] = useState(null);
  const [tabValue] = useState(0);

  const { history, match } = props;
  //const history = useHistory();

  const url = "/app/invoices/list";
  // const prevpath = window.history.state.prevUrl;
  const handleResponse = ({ response, error, isNew, exit }) => {
    let variant = "success";
    if (error) {
      variant = "error";
    }
    dispatch(
      showMessage({
        message: t(
          `itemsApp:${variant}.${
            isNew ? "creation" : "modification"
          }`,
          { name: response && response.name }
        ),
        autoHideDuration: 3000,
        variant, //success error info warning null
      })
    );
    //exit && history.goBack();
    exit && history.push(history.location.pathname || "/app");
    // exit && history.push(history.goBack() || "/app");
  };

  const handleSubmit = (exit) => {
    dispatch(
      Actions.submit(formRef.getModel(), handleResponse, exit)
    );
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
            defaultTitle: match.params.id
              ? t("fApp:edit_facture")
              : t("fApp:create_new_facture"),
            caption: t("fApp:facture_info"),
          }}
          submitAction={handleSubmit}
          options={{
            goBack: true,
            defaultGoBackLink: url,
            showIconEditor: false,
          }}
          reduxStore="factureApp"
        />
      }
      contentToolbar={
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: "w-full h-64" }}
        >
          <Tab
            className="h-64 normal-case"
            label={t("materialsApp:documents", { count: 2 })}
          />
        </Tabs>
      }
      headerCardContent={
        <Header
          tabValue={tabValue}
          setFormRef={setFormRef}
          handleSubmit={handleSubmit}
        />
      }
      //content={<DocumentForm tabValue={tabValue} setFormRef={setFormRef} handleSubmit={handleSubmit} />}
      innerScroll
    />
  );
}

export default withRouter(withReducer("factureApp", reducer)(Item));
