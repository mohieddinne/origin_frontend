import React from "react";
import { withRouter } from "react-router-dom";
import DetailsTab from "../tabs/Header";
function FolderForm(props) {
  const { tabValue, setFormRef, setFormState, data } = props;
  return (
    tabValue === 0 && (
      <DetailsTab
        setFormRef={setFormRef}
        data={data}
        setFormState={setFormState}
      />
    )
  );
}
export default withRouter(FolderForm);
