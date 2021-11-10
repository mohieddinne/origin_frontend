import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { useTranslation } from "react-i18next";
import FilterButtonIcon from "./FilterButtonIcon";
import { useSelector } from "react-redux";

function FilterButtonUI(props) {
  const { t } = useTranslation();
  const { handleClick, toggle, isOpen, activeFilters } = props;

  const uAF = useSelector(
    ({ auth }) => auth?.user?.data?.usesAdvancedFilters || false
  );

  return (
    <>
      <Tooltip title={t("filter_the_table")}>
        <Button
          aria-label={t("filter_the_table")}
          onClick={(event) => {
            uAF && toggle();
            !uAF && handleClick(event);
          }}
        >
          <FilterButtonIcon isOpen={isOpen} />
          {activeFilters > 0 && (
            <div className="bg-blue-700 text-white w-20 h-20 text-xs rounded-full leading-8 ml-4 inline-block">
              {activeFilters}
            </div>
          )}
        </Button>
      </Tooltip>
    </>
  );
}

export default FilterButtonUI;
