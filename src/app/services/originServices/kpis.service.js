import { jwtService } from "app/services/originServices";
import { gql } from "@apollo/client";
import apolloService from "../apolloService";

export async function filters() {
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query kpis_filters {
              kpis_filters {
                name
                data {
                  name
                  value
                  actif
                  favorite
                }
              }
            }
          `
        )
      )
      .then(({ data }) => {
        resolve(data.kpis_filters);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function lossesAndOffices(math, filters) {
  const filters_ = handleFilters(filters);
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query kpi_losses_and_offices(
              $math: String
              $filters: [kipsFiltersInput]
            ) {
              kpi_losses_and_offices(math: $math, filters: $filters) {
                name
                data {
                  name
                  value
                }
              }
            }
          `,
          {
            math,
            filters: filters_,
          }
        )
      )
      .then(({ data }) => {
        resolve(data.kpi_losses_and_offices);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function customerGroups(math, filters) {
  const filters_ = handleFilters(filters);
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query kpi_customer_groups(
              $math: String
              $filters: [kipsFiltersInput]
            ) {
              kpi_customer_groups(math: $math, filters: $filters) {
                name
                value
                options {
                  name
                  value
                }
              }
            }
          `,
          {
            math,
            filters: filters_,
          }
        )
      )
      .then(({ data }) => {
        resolve(data.kpi_customer_groups);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function customers(math, filters, limit = 10) {
  const filters_ = handleFilters(filters);
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query kpi_customers(
              $math: String
              $filters: [kipsFiltersInput]
              $limit: Int
            ) {
              kpi_customers(
                math: $math
                filters: $filters
                limit: $limit
              ) {
                name
                value
              }
            }
          `,
          {
            math,
            filters: filters_,
          }
        )
      )
      .then(({ data }) => {
        resolve(data.kpi_customers);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function types(math, filters) {
  const filters_ = handleFilters(filters);
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query kpi_folders_types(
              $math: String
              $filters: [kipsFiltersInput]
            ) {
              kpi_folders_types(math: $math, filters: $filters) {
                name
                value
              }
            }
          `,
          {
            math,
            filters: filters_,
          }
        )
      )
      .then(({ data }) => {
        resolve(data.kpi_folders_types);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function offices(math, filters) {
  const filters_ = handleFilters(filters);
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query kpi_offices(
              $math: String
              $filters: [kipsFiltersInput]
            ) {
              kpi_offices(math: $math, filters: $filters) {
                name
                value
              }
            }
          `,
          {
            math,
            filters: filters_,
          }
        )
      )
      .then(({ data }) => {
        resolve(data.kpi_offices);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function bestCustomers(math, filters, limit) {
  const filters_ = handleFilters(filters);
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query kpi_best_clients(
              $limit: Int
              $order: String
              $filters: [kipsFiltersInput]
            ) {
              kpi_best_clients(
                order: $order
                filters: $filters
                limit: $limit
              ) {
                NumeroClient
                NomClient
                TypeClient
                income
                folders
              }
              options(slugs: ["customers_type_color"]) {
                name
                value
              }
            }
          `,
          {
            order: math,
            filters: filters_,
            limit,
          }
        )
      )
      .then(({ data }) => {
        const options = {};
        (data.options || []).map(
          ({ name, value }) => (options[name] = JSON.parse(value))
        );
        resolve({
          data: data.kpi_best_clients,
          options,
        });
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export async function getpdf({ math, filters }, pdfOptions) {
  const options = Object.keys(pdfOptions || {}).map((name) => ({
    name,
    value: pdfOptions[name],
  }));
  return apolloService.query({
    variables: {
      math,
      filters,
      options,
    },
    query: gql`
      query kpi_pdf(
        $options: [PdfOptions]
        $math: String
        $filters: [kipsFiltersInput]
      ) {
        kpi_pdf(math: $math, filters: $filters, options: $options)
      }
    `,
    context: {
      headers: {
        authorization: "Bearer " + jwtService.getAccessToken(),
      },
    },
  });
}

// TODO change it to useQuery (see with Bilel)
export async function getWidgetsDatafor_excel(options) {
  return apolloService.query({
    variables: options,
    query: gql`
      query kpi_xls(
        $widget: String!
        $math: String!
        $filters: [kipsFiltersInput]
      ) {
        kpi_xls(widget: $widget, math: $math, filters: $filters)
      }
    `,
    context: {
      headers: {
        authorization: "Bearer " + jwtService.getAccessToken(),
      },
    },
  });
}

export async function widgetAvrgDelais(filters) {
  const filters_ = handleFilters(filters);
  return new Promise((resolve, reject) => {
    apolloService
      .query(
        queryGen(
          gql`
            query widgetAvrgDelais($filters: [kipsFiltersInput]) {
              widgetAvrgDelais(filters: $filters) {
                name
                value
                description
              }
            }
          `,
          { filters: filters_ }
        )
      )
      .then(({ data }) => {
        resolve(data.widgetAvrgDelais);
      })
      .catch((error) => {
        handleError(error, reject);
      });
  });
}

export function handleFilters(raw) {
  const filters = [];
  for (const name in raw) {
    let value = raw[name];
    // special treatments
    switch (name) {
      case "date_start":
      case "date_end":
        if (value) {
          const date = new Date(value);
          value =
            date.getFullYear() +
            "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getDate()).slice(-2);
        } else {
          value = null;
        }
        break;
      default:
        // slience is gold
        break;
    }
    // Transforme value in an array if is not
    if (!Array.isArray(value)) value = [value];
    // Push to the filters array
    filters.push({
      name,
      value,
    });
  }
  return filters;
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
