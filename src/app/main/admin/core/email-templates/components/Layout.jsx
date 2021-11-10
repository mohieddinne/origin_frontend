import React from "react";
import EmailTemplatesCategoriesWidget from "./CategoriesWidget";
import EmailTemplatesList from "./EmailTemplatesList";

function EmailTemplatesLayout() {
  return (
    <div className="flex flex-wrap">
      <div className="w-3/12 p-16">
        <EmailTemplatesCategoriesWidget />
      </div>
      <div className="w-9/12">
        <EmailTemplatesList />
      </div>
    </div>
  );
}

export default EmailTemplatesLayout;
