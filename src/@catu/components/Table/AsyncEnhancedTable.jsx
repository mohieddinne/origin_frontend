import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useExpanded,
} from "react-table";
import TableToolbar from "./components/TableToolbar";
import TableHeader from "./components/TableHeader";
import TableBody from "./components/TableBodyHandler";
import TableFooter from "./components/TableFooter";
import tableHooks from "./hooks/table";

function AsyncEnhancedTable(props) {
  // Get the props
  const {
    data,
    onRowClick,
    loading,
    error,
    footer,
    calbacks,
  } = props;

  const { totalCount, pageCount } = props;

  if (calbacks) var { Filter, Export } = calbacks;

  // Get the options
  let options = props.options || {};
  options.selectable =
    options.selectable || props.selectable || false;
  options.subRow = options.subRow || false;
  options.tabfooter = options.tabfooter || false;
  options.special_filter = options.special_filter || false;

  // Detect the onRowAction
  options.defaultAction = null;
  if (
    props.options &&
    typeof props.options.defaultAction === "function"
  )
    options.defaultAction = props.options.defaultAction;
  else if (typeof onRowClick === "function")
    options.defaultAction = onRowClick;

  // React table plugins (order is important)
  const plugins = [useGlobalFilter, useSortBy];
  if (options.subRow) plugins.push(useExpanded);
  plugins.push(usePagination);
  if (options.selectable) plugins.push(useRowSelect);
  plugins.push(tableHooks(options));

  const [pageIndex, gotoPage] = useState(0);

  /**
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    setPageSize,
   */
  const {
    columns,
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    // gotoPage,
    setPageSize,
    state,
  } = useTable(
    {
      columns: props.columns,
      data,
      initialState: { pageIndex: 0, pageSize: 50 },
      manualPagination: true,
      pageCount,
    },
    ...plugins
  );

  // Table states
  const { /*pageIndex,*/ pageSize, selectedRowIds } = state;

  // Pagging handlers
  const handleChangePage = (e, newPage) => {
    // nextPage();
    gotoPage(newPage);
  };
  const handleChangeRowsPerPage = (event) =>
    setPageSize(Number(event.target.value));

  // Columns number
  let colNumber = columns.length;
  if (options.selectable) colNumber++;
  if (options.subRow) colNumber++;
  // if (options.footer) colNumber++;

  useEffect(() => {
    if (typeof props.fetchData === "function")
      props.fetchData({ pageSize, pageIndex });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex]);

  useEffect(() => {}, [state]);

  return (
    <TableContainer className={props.classesNames}>
      <TableToolbar
        Filter={Filter}
        Export={Export}
        numSelected={Object.keys(selectedRowIds || {}).length}
        refetch={options && options.refetch}
        {...props}
        options={options}
      />
      {options.subTitleComponemt}
      <Table {...getTableProps()}>
        <TableHeader
          headerGroups={headerGroups}
          border={options.border_top}
        />
        <TableBody
          error={error}
          loading={loading}
          colNumber={colNumber}
          data={page}
          columns={columns}
          refetch={options && options.refetch}
          {...{
            prepareRow,
            onRowClick: options.defaultAction,
            selectable: options.selectable,
            options,
          }}
        />
        <TableFooter
          hide={footer}
          border={options.border_bottom}
          colNumber={colNumber}
          count={totalCount}
          pageSize={pageSize}
          pageIndex={pageIndex}
          handlers={{
            handleChangePage,
            handleChangeRowsPerPage,
          }}
        />
      </Table>
      {options.FooterComponemt}
    </TableContainer>
  );
}

AsyncEnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  selectable: PropTypes.bool,
  loading: PropTypes.bool,
  classesNames: PropTypes.string,
  dense: PropTypes.bool,
  options: PropTypes.object,
};

AsyncEnhancedTable.defaultProps = {
  loading: false,
  classesNames: "min-h-full",
};

export default AsyncEnhancedTable;
