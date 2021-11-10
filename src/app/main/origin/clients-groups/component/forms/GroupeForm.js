import { withRouter } from "react-router-dom";
import React from "react";
import DocumentsTab from "../tabs/DocumentsTab";

function GroupeHeadForm(props) {
  const { tabValue, formRef } = props;

  return tabValue === 0 && <DocumentsTab formRef={formRef} />;
}

export default withRouter(GroupeHeadForm);
