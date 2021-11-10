import { ReactComponent as ReactIcon } from "./filter-up-icon.svg";
import clsx from "clsx";

export default function FilterUpIcon(props) {
  return (
    <ReactIcon
      className={clsx("MuiSvgIcon-root makeStyles-smooth-491", {
        [props.className]: props.className,
      })}
    />
  );
}
