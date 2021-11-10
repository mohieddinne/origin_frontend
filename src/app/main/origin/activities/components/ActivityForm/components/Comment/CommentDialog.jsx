import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { useQuery, gql } from "@apollo/client";
import Divider from "@material-ui/core/Divider";
import clsx from "clsx";
import ListWrapper from "./ListWrapper";
import FormContext from "../../Context";

const QUERY = gql`
  query filtersActivity($filters: [ArrayFilterInput]) {
    filtersActivity(slugs: [COMMENTS], filters: $filters) {
      name
      data {
        id
        value
        ... on ActivityFilterComment {
          value_en
          active
          category
        }
      }
    }
  }
`;

function CommentDialog(props) {
  const { closeDialog, open, setValue } = props;
  const { activityType, category } = useContext(FormContext);

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filtredData, setFiltredData] = useState([]);

  const variables = { filters: [] };
  if (activityType) {
    variables.filters.push({
      name: "activity",
      value: [activityType],
    });
  }
  if (category) {
    variables.filters.push({
      name: "category",
      value: [category.name],
    });
  }

  const { data, loading, error } = useQuery(QUERY, {
    variables,
    fetchPolicy: "no-cache",
    skip: !open || !activityType,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchLoading(true);
      const comments = data?.filtersActivity[0]?.data || [];
      const __search = search.toLowerCase();
      if (__search === "") {
        setFiltredData(comments);
      } else {
        setFiltredData(
          comments.filter(({ value, value_en }) => {
            const string =
              (value || "").toLowerCase() +
              " " +
              (value_en || "").toLowerCase();
            return string.includes(__search);
          })
        );
      }
      setSearchLoading(false);
    }, 500);
    return () => clearTimeout(handler);
  }, [data, search]);

  const categories = {};
  for (const comment of filtredData) {
    const category = comment.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(comment);
  }

  const getHighlightedText = (text) => {
    const highlight = search.toLowerCase();
    if (!highlight || !text) {
      return text;
    }
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <>
        {parts.map((part, i) => {
          const isRegexed = part.toLowerCase() === highlight;
          return (
            <span
              key={i}
              className={clsx({
                "font-bold text-yellow-900": isRegexed,
              })}
            >
              {part}
            </span>
          );
        })}
      </>
    );
  };

  const handleClick = (text) => {
    setValue(text);
    closeDialog();
  };

  return (
    <Dialog
      onClose={closeDialog}
      open={open}
      fullWidth={true}
      maxWidth="sm"
      classes={{ paper: "p-24 flex flex-col gap-16" }}
    >
      <div className="">
        <div className="font-bold text-lg leading-tight mb-2">
          Commentaires disponibles
        </div>
        <div className="text-gray-500 text-xs">
          Choissez un commentaire
        </div>
      </div>
      <Divider className="w-full" />
      <TextField
        name="search"
        value={search}
        label="Cherchez un commentaire"
        onChange={(e) => setSearch(e.currentTarget.value)}
        inputProps={{ autoCorrect: "off", autoComplete: "off" }}
        InputProps={{ autoComplete: "off" }}
      />
      <div className="overflow-y-scroll max-h-full flex flex-col gap-8">
        <ListWrapper
          {...{
            handleClick,
            error,
            loading: loading || searchLoading,
            noData: filtredData.length === 0,
            categories,
            getHighlightedText,
          }}
        />
      </div>
    </Dialog>
  );
}

CommentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
};

function CommentDialogButton(props) {
  const { activityType, category } = useContext(FormContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="whitespace-nowrap">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpen(true)}
        disabled={!activityType || !category}
      >
        <ChevronLeftIcon />
        Liste des Commentaires
      </Button>
      <CommentDialog
        open={open}
        closeDialog={() => setOpen(false)}
        setValue={props.setValue}
      />
    </div>
  );
}

export default CommentDialogButton;
