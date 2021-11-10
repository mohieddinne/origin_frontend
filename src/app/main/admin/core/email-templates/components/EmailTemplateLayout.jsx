import React from "react";
import EmailTemplateHeader from "./EmailTemplateHeader";
import EmailTemplateForm from "./EmailTemplateForm";

function EmailTemplateLayout({ data }) {
  return (
    <>
      <EmailTemplateHeader data={data} />
      {data.contents.map((item) => (
        <EmailTemplateForm key={item.id} id={data.id} item={item} />
      ))}
    </>
  );
}

export default EmailTemplateLayout;
