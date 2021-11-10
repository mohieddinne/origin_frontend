function viewFolders({ filters, history }) {
  const folderBeginWith00 = "00";
  filters.default_filter = folderBeginWith00;
  history.push("/app/folders/list", {
    filters,
    title: "kpisApp:key_performance_indicators",
  });
}

export default viewFolders;
