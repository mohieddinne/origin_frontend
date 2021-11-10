import React from "react";
import CatuFilePageCarded from "@catu/components/PageLayouts/carded/CatuFilePageCarded";
import { useTranslation } from "react-i18next";
import HeaderForm from "@catu/components/HeaderForm";
import { makeStyles } from "@material-ui/core";
import Form from "../component/settingsPage/Form";
import { useMutation, gql, useQuery } from "@apollo/client";
import { showMessage } from "app/store/actions";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ErrorComponent from "@catu/components/Error";

const useStyle = makeStyles(() => ({
  content: {
    position: "static !important",
  },
}));

const gQl = gql`
  mutation billingProjectSettings($data: ProjectSettingsInput) {
    billingProjectSettings(data: $data) {
      id
    }
  }
`;

const folderQuery = gql`
  query folders($ids: [ID]) {
    folders(ids: $ids) {
      NumeroDossier
      Responsable
      settings {
        id
        daysWithoutActivity
        nbrDaysWithoutActivity
        budgetBeforeFirstInvoice
        minBudgetBeforeFirstInvoice
        maxPourcentagesOfBudget
        maxOfTecAmount
        submissionProcess
        isMentor
        mentor
        budgetVsTec
      }
    }
  }
`;

const SettingPage = React.memo((props) => {
  const dispatch = useDispatch();
  const url = "/app";
  const params = useParams();
  const NumeroDossier = params.id;

  const { data, loading, error } = useQuery(folderQuery, {
    variables: {
      ids: [NumeroDossier],
    },
  });

  const [formRef, setformRef] = React.useState(null);
  const [exec] = useMutation(gQl);

  const handleResponse = ({ response, error, isNew, exit }) => {
    let variant = "success";
    if (error) {
      variant = "error";
    }
    const message = t(
      `dApp:${variant}.${isNew ? "create_setting" : "edit_setting"}`
    );

    dispatch(
      showMessage({
        message,
        autoHideDuration: 3000,
        variant,
      })
    );
    exit && props.history.push(url || "/app/activities");
  };

  const { t } = useTranslation();
  const classes = useStyle();

  const handleSubmit = (model) => {
    const data = model;
    data.nbrDaysWithoutActivity = parseInt(
      data.nbrDaysWithoutActivity
    );
    data.budgetVsTec = parseInt(data.budgetVsTec);
    data.minBudgetBeforeFirstInvoice = parseFloat(
      data.minBudgetBeforeFirstInvoice
    );
    data.maxOfTecAmount = parseFloat(data.maxOfTecAmount);
    data.projectId = NumeroDossier;
    data.maxPourcentagesOfBudget = data.maxPourcentagesOfBudget.toString();
    data.mentor = parseInt(data.mentor);
    const isNew = !!parseInt(data.id);
    exec({
      variables: {
        data,
      },
    })
      .then((response) => {
        // refetch();
        handleResponse({ response, isNew: !isNew });
      })
      .catch((error) => {
        handleResponse({ error, isNew: !isNew });
        if (process.env.NODE_ENV !== "production") console.log(error);
      });
  };

  if (
    error ||
    (!loading &&
      (!Array.isArray(data?.folders) ||
        (Array.isArray(data?.folders) && data.folders.length > 1)))
  ) {
    return <ErrorComponent />;
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
            caption: t("dApp:invoice_setting.subtitle"),
            defaultTitle: t(
              data && data.folders[0]?.settings?.id
                ? "dApp:invoice_setting.edit_title"
                : "dApp:invoice_setting.create_title"
            ),
            list_name: t("dApp:list_of_folders", { count: 2 }),
          }}
          options={{
            goBack: true,
            showIconEditor: false,
            defaultGoBackLink: "/app/folders",
          }}
        />
      }
      content={
        <Form
          data={data?.folders[0]}
          loading={loading}
          setFormRef={setformRef}
          formRef={formRef}
          handleSubmit={handleSubmit}
        />
      }
      innerScroll
    />
  );
});

export default SettingPage;
