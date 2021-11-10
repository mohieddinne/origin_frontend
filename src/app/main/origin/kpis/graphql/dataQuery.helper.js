import { gql } from "@apollo/client";

function dataQuery(widget, math) {
  let parts = [];
  switch (widget) {
    case "lossesandoffices":
      parts.push("offices", "types", "value");
      break;
    case "customergroupsquery":
      parts.push("name", "value");
      break;
    case "customers":
      parts.push("name", "value");
      break;
    case "folderstypes":
      parts.push("name", "value");
      break;
    case "offices":
      parts.push("name", "value");
      break;
    default:
      break;
  }

  // if (
  //   math === "income" &&
  //   widget !== "lossesandoffices" &&
  //   widget !== "folderstypes"
  // ) {
  //   parts = [
  //     "NumeroDossier",
  //     // "DateFacturation",
  //     "NumeroFacture",
  //     ...parts,
  //     "MontantFacture",
  //   ];
  // } else if (
  //   math !== "income" &&
  //   widget !== "lossesandoffices" &&
  //   widget !== "folderstypes"
  // ) {
  //   parts = ["NumeroDossier", "DateMandat", ...parts];
  // }

  return [
    gql`
			query ($widget: String! $math: String! $filters: [kipsFiltersInput]) {
				kpi_widgets_data(
					widget: $widget
					math: $math
					filters: $filters
				) {
					${parts.join(" ")}
				}
			}
    `,
    parts,
  ];
}

export default dataQuery;
