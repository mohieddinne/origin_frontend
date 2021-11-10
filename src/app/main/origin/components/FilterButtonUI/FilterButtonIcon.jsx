import { useSelector } from "react-redux";
import FilterListIcon from "@material-ui/icons/FilterList";
import FilterDownIcon from "@catu/icons/FilterDownIcon";
import FilterUpIcon from "@catu/icons/FilterUpIcon";

export default function FilterButtonIcon(props) {
  const { isOpen } = props;
  const usesAdvancedFilters = useSelector(
    ({ auth }) => auth?.user?.data?.usesAdvancedFilters || false
  );

  if (!usesAdvancedFilters) return <FilterListIcon />;

  if (isOpen) return <FilterUpIcon />;
  return <FilterDownIcon />;
}
