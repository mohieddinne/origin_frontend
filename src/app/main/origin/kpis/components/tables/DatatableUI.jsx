import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EnhancedTable from "@catu/components/Table/EnhancedTable";
import SubRow from "./SubRow";

function DatatableUI(props) {
  const { tableProps, widget, index, math } = props;
  const [data, setData] = useState([]);
  const keywords = useSelector(({ kpisApp }) =>
    kpisApp.dataTable.searchText.toLowerCase()
  );
  useEffect(() => {
    let filteredData;
    if (!keywords) filteredData = tableProps.data;
    else
      filteredData = tableProps.data.filter((item) => {
        const values = Object.values(item);
        const find = values.find((val) => {
          if (!val) return false;
          const value = val.toString().toLowerCase();
          return value.includes(keywords);
        });
        return find;
      });
    setData(filteredData);
  }, [tableProps.data, keywords]);
  return (
    <EnhancedTable
      {...tableProps}
      data={data || []}
      options={
        false
          ? {}
          : {
              subRow: (row) => (
                <SubRow
                  row={row}
                  widget={widget}
                  index={index}
                  math={math}
                />
              ),
              selectable: false,
            }
      }
    />
  );
}

export default DatatableUI;
