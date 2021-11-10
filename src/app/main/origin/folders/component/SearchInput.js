import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Input from "@material-ui/core/Input";
import * as Actions from "../store/actions";
import { useDebounce } from "@fuse/hooks";

function SearchInput() {
  const dispatch = useDispatch();
  const searchText = useSelector(
    ({ folderApp }) => folderApp.searchText
  );

  const handleChange = useDebounce((text) => {
    dispatch(Actions.setSearchText(text));
  }, 300);

  return (
    <SrchInput defaultValue={searchText} handler={handleChange} />
  );
}

function SrchInput({ defaultValue, handler }) {
  const { t } = useTranslation();
  const [keyWord, setKeyWord] = useState(defaultValue);

  React.useEffect(() => {
    if (defaultValue !== keyWord) {
      setKeyWord(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const handleChange = ({ target }) => {
    setKeyWord(target.value);
    if (typeof handler === "function") {
      handler(target.value);
    }
  };

  return (
    <Input
      placeholder={t("search")}
      className="flex flex-1 mx-8"
      disableUnderline
      fullWidth
      value={keyWord}
      inputProps={{
        "aria-label": t("search"),
      }}
      onChange={handleChange}
    />
  );
}

export default SearchInput;
