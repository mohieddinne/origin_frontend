import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row({ row, onRowClick, options }) {
  const classes = useRowStyles();
  const hasRowFnc = typeof onRowClick === "function";
  const hasSubrow = typeof options.subRow === "function";

  const handleClick = (ev) => {
    if (hasRowFnc) onRowClick(ev, row);
    else if (typeof row.toggleRowExpanded === "function")
      row.toggleRowExpanded();
  };

  let rowProps = { ...row.getRowProps() };
  if (typeof options.rowProps === "function") {
    rowProps = options.rowProps(row, rowProps);
  }

  return (
    <>
      <TableRow
        {...rowProps}
        onClick={handleClick}
        className={clsx({
          [rowProps.className]: rowProps.className,
          [classes.root]: hasSubrow,
          "cursor-pointer": hasRowFnc,
        })}
      >
        {row.cells.map((cell) => {
          return (
            <TableCell
              {...cell.getCellProps()}
              className={clsx({
                "p-12": !options.cellPadding,
                [options.cellPadding]: !!options.cellPadding,
                [options.cellClassname]: options.cellClassname,
                [cell.column.responsive]: cell.column.responsive,
                [cell.column.className]: cell.column.className,
              })}
            >
              {cell.render("Cell")}
            </TableCell>
          );
        })}
      </TableRow>
      {hasSubrow && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={row.cells.length}
          >
            <Collapse
              in={row.isExpanded}
              timeout="auto"
              unmountOnExit
            >
              {options.subRow(row)}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default Row;
