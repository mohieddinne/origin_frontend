import { gql } from "@apollo/client";

function dataQuery(widget, math) {
  let parts = [];
  if (math === "income") {
    parts = ["NumeroDossier", "NumeroFacture", "MontantFacture"];
  } else {
    parts = ["NumeroDossier"];
  }

  return [
    gql`
			query ($widget: String! $math: String! $rowFilter: [kipsFiltersInput]) {
				kpi_widgets_data(
					widget: $widget
					math: $math
					rowFilter: $rowFilter
				) {
					${parts.join(" ")}
				}
			}
    `,
    parts,
  ];
}

export default dataQuery;
