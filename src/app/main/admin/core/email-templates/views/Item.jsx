import React from "react";
import CatuFilePageCarded from "@catu/components/PageLayouts/carded/CatuFilePageCarded";
import { useTranslation } from "react-i18next";
import HeaderForm from "@catu/components/HeaderForm";
import { useParams } from "react-router-dom";
import EmailTemplateLayout from "../components/EmailTemplateLayout";
import { makeStyles } from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";

const query = gql`
  query emailTemplates($ids: [ID]) {
    emailTemplates(ids: $ids) {
      id
      name
      slug
      active
      variables {
        name
        description
      }
      contents {
        id
        language
        subject
        message
        fromName
        plaintext
      }
      category {
        id
        name
      }
    }
  }
`;

const useStyle = makeStyles(() => ({
  content: {
    position: "static !important",
  },
}));

function Item() {
  const classes = useStyle();

  const { t } = useTranslation();
  const { id } = useParams();

  const { data, loading, error } = useQuery(query, {
    variables: {
      ids: id,
    },
  });

  let template = {};
  if (data && Array.isArray(data.emailTemplates)) {
    template = data.emailTemplates[0] || {};
  }

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
            defaultTitle:
              template.name || t("emltmp:new_email_template"),
            caption: " ", // t("emltmp:new_email_template_caption"),
            list_name: t("emltmp:email_template_list"),
          }}
          reduxStore={" "}
          options={{
            goBack: true,
            defaultGoBackLink: "/admin/email-templates/list",
          }}
        />
      }
      content={<ItemWraper {...{ loading, error, data: template }} />}
      innerScroll={false}
    />
  );
}

function ItemWraper({ data, loading, error }) {
  if (loading) return "loading";
  if (error) return "loading";
  return <EmailTemplateLayout data={data} />;
}

export default Item;
