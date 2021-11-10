import { jwtService } from "app/services/originServices";
import { gql } from "@apollo/client";
import apolloService from "../apolloService";

export async function widgetReceivedFolder(responsable, filters) {
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetReceivedFolder(
              $responsable: String
              $filters: [String]
            ) {
              widgetReceivedFolder(
                responsable: $responsable
                filters: $filters
              ) {
                active
                graph {
                  name
                  value
                }
                data {
                  type
                  value
                  change
                }
              }
            }
          `,
          { responsable, filters }
        )
      )
      .then(({ data }) => {
        resolve(data.widgetReceivedFolder);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function widgetIncomeVsGoals(responsable) {
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetIncomeVGoals($responsable: String) {
              widgetIncomeVGoals(responsable: $responsable) {
                billableHours {
                  value
                  date
                }
                goal
                value
                widget {
                  name
                  data {
                    value
                    name
                  }
                }
              }
            }
          `,
          { responsable }
        )
      )
      .then((res) => {
        const { data } = res;
        resolve(data.widgetIncomeVGoals);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function widgetSTEC(opts, responsable) {
  const { period } = opts || {};
  let options = [];
  if (!!period) {
    options.push({
      name: "period",
      value: `${period}`, // Force to string
    });
  }
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetSTEC(
              $options: [queryOption]
              $responsable: String
            ) {
              widgetSTEC(
                options: $options
                responsable: $responsable
              ) {
                name
                data {
                  value
                  name
                }
              }
            }
          `,
          { options, responsable }
        )
      )
      .then(({ data }) => {
        resolve(data.widgetSTEC);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function widgetBudgetAndDelais(opts, responsable) {
  const { period } = opts || {};
  let options = [];
  if (!!period) {
    options.push({
      name: "period",
      value: `${period}`, // Force to string
    });
  }
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetBudgetAndDelais(
              $options: [queryOption]
              $responsable: String
            ) {
              widgetBudgetAndDelais(
                options: $options
                responsable: $responsable
              ) {
                name
                data {
                  value
                  name
                }
              }
            }
          `,
          { options, responsable }
        )
      )
      .then(({ data }) => {
        resolve(data.widgetBudgetAndDelais);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function widgetBvNbHours(
  { rowsPerPage: count, dateSorter, operator, compareValue },
  responsable
) {
  let options = [];
  if (operator && !isNaN(compareValue)) {
    options.push({
      name: "operator",
      value: operator,
    });
    options.push({
      name: "compareValue",
      value: compareValue.toString(),
    });
  }
  options.push({
    name: "count",
    value: `${count}`, // Force to string
  });

  if (dateSorter) {
    options.push({
      name: "dateSorter",
      value: `${dateSorter}`,
    });
  }
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetBvNbHours(
              $options: [queryOption]
              $responsable: String
            ) {
              widgetBvNbHours(
                options: $options
                responsable: $responsable
              ) {
                count
                table {
                  folder
                  customerId
                  customerType
                  customerName
                  billed
                  noneBilled
                  amountBilled
                  amountNoneBilled
                  budget
                  sumExpenses
                }
              }
            }
          `,
          { options, responsable }
        )
      )
      .then(({ data }) => {
        resolve({
          data: data.widgetBvNbHours,
        });
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

function queryGen(query, variables = null) {
  return {
    variables,
    query,
    context: {
      headers: {
        authorization: "Bearer " + jwtService.getAccessToken(),
      },
    },
  };
}

function handleError(error, reject) {
  console.error(error);
  reject(error);
}
