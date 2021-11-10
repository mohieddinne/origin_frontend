import { ReactComponent as ReactIcon } from "./filter-down-icon.svg";
import clsx from "clsx";

export default function FilterDownIcon(props) {
  return (
    <ReactIcon
      className={clsx("MuiSvgIcon-root makeStyles-smooth-491", {
        [props.className]: props.className,
      })}
    />
  );
}
