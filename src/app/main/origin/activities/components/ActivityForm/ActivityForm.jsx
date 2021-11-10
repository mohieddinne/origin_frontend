import React, {
  useState,
  useEffect,
  useRef,
  // useContext,
} from "react";
import Formsy from "formsy-react";
import { TextFieldFormsy, RadioGroupFormsy } from "@fuse";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Comment from "./components/Comment/index";
import ActivityDateFormsy from "./components/DateFormsy";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import timeToDecimal from "../../misc/timeToDecimal";
import { useParams } from "react-router-dom";
import Folder from "./components/Folder";
import EmployeeSelect from "./components/Employee";
import CategoriesSelect from "./components/Categories";
import TypeSelect from "./components/Type";
import { useQuery, useMutation, gql } from "@apollo/client";
import Loading from "./Loading";
import CircularProgress from "@material-ui/core/CircularProgress";
// import FormContext from "./Context";
import { showMessage } from "app/store/actions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    gap: "2rem",
    "& > div": {
      width: "100%",
    },
  },
}));

const QUERY = gql`
  query activity($ids: [ID]) {
    activities(ids: $ids) {
      nodes {
        id
        ... on Activity {
          employeeName
          date
          category
          activiteType
          folderId
          hours
          hourlyRate
          comment
        }
      }
    }
  }
`;

const MUTATE = gql`
  mutation activity($data: [ActivityInput], $operation: String) {
    activityAction(data: $data, operation: $operation)
  }
`;

function ActivityForm() {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ref = useRef();
  const { id: paramsId } = useParams();
  // const { folder } = useContext(FormContext);

  const [isFormValid, setIsFormValid] = useState(false);

  let itemId = (paramsId !== "new" && paramsId) || null;
  const { data, loading } = useQuery(QUERY, {
    variables: { ids: [itemId] },
    skip: !paramsId || paramsId === "new",
  });

  const [exec, { loading: mLoading }] = useMutation(MUTATE);

  const activity = data?.activities?.nodes[0] || null;

  useEffect(() => {
    if (activity) {
      const model = {
        recordingType: "1",
        employee: activity.employeeName,
        date: new Date(parseInt(activity.date)),
        category: activity.category,
        activity: activity.activiteType,
        folderId: activity.folderId,
        hours: activity.hours,
        hourlyRate: activity.hourlyRate,
        comment: activity.comment,
      };
      ref?.current?.updateInputsWithValue(model);
    }
  }, [activity]);

  const handleSubmit = (model) => {
    let time = model.hours;
    if (time.includes(":")) {
      time = timeToDecimal(time);
    }
    const activity = {
      user: model.employee,
      comment: model.comment,
      recordingType: "1",
      time: time.toString(),
      rate: model.hourlyRate.toString(),
      activity: model.activity,
      category: model.category,
      project: model.folderId || null,
      date: model.date.toString(),
    };
    if (itemId) {
      activity.id = itemId.toString();
    }

    // Check folder budget
    //const actValue = parseFloat(model.rate) * parseFloat(model.time);
    //const newTotalValue = actValue + parseFloat(folder?.consummated);
    //const showConfirmationPopup = newTotalValue > folder?.budget;

    let variant = "success";
    // TODO add the confirmation modal
    exec({
      variables: {
        data: [activity],
        operation: activity.id ? "update" : "create",
      },
    })
      .then(() => {})
      .catch(() => {
        variant = "error";
      })
      .finally(() => {
        dispatch(
          showMessage({
            message: t(`activities:${variant}.create`),
            autoHideDuration: 3000,
            variant, //success error info warning null
          })
        );
      });
  };

  if (loading) return <Loading />;

  return (
    <Formsy
      ref={ref}
      className={clsx(
        classes.root,
        "flex flex-wrap w-full p-10 lg:w-2/3"
      )}
      onValidSubmit={handleSubmit}
      onValid={() => setIsFormValid(true)}
      onInvalid={() => setIsFormValid(false)}
    >
      <div className="flex items-center justify-start gap-8">
        <FormLabel className="">
          {t("activities:form.record_type")}
        </FormLabel>

        <RadioGroupFormsy
          className="block"
          variant="outlined"
          name="recordingType"
          value="1"
          row
        >
          <FormControlLabel
            value="1"
            control={<Radio />}
            label={t("activities:form.time")}
            className="text-gray-500"
          />
          <FormControlLabel
            value="0"
            disabled={true}
            control={<Radio />}
            label={t("activities:form.fresh")}
            className="text-gray-500"
          />
        </RadioGroupFormsy>
      </div>

      <EmployeeSelect disabled={mLoading} name="employeeName" />

      <ActivityDateFormsy disabled={mLoading} name="date" />

      <CategoriesSelect disabled={mLoading} name="category" />

      <TypeSelect disabled={mLoading} name="activity" />

      <Folder disabled={mLoading} name="folderId" />

      <div className={"flex gap-16"}>
        <TextFieldFormsy
          disabled={mLoading}
          className="w-1/4"
          variant="outlined"
          fullWidth={true}
          updateImmediately
          name="hours"
          required
          validationErrors={{
            required: t("error.form.required"),
          }}
          label={t("activities:form.time")}
        />
        <TextFieldFormsy
          disabled={mLoading}
          className="w-1/4"
          variant="outlined"
          type="number"
          fullWidth={true}
          validations={{
            isFloat: true,
          }}
          required
          name="hourlyRate"
          label={t("activities:form.rate")}
        />
      </div>

      <Comment name="comment" />

      <Button
        variant="contained"
        color="primary"
        disableElevation
        disabled={!isFormValid || mLoading}
        type="submit"
      >
        {loading && <CircularProgress size={24} />}
        {t("activities:form.confirm")}
      </Button>
    </Formsy>
  );
}

export default ActivityForm;
