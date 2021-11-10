import { gql } from "@apollo/client";
import apolloService from "../apolloService";
import { jwtService } from "app/services/originServices";

// Get All Clients
export const list = (ids = [], search = "", filtersObj = {}) => {
  const filters = Object.keys(filtersObj).map((key) => {
    const a = filtersObj[key];
    const value = Array.isArray(a) ? a : [a];
    return {
      name: key,
      value,
    };
  });
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          ids,
          search,
          filters,
        },
        query: gql`
          query clients(
            $ids: [ID]
            $search: String
            $filters: [ArrayFilterInput]
          ) {
            clients(ids: $ids, search: $search, filters: $filters) {
              NumeroClient
              NomClient
              Inactif
              TypeClient
              Adresse
              Ville
              folders {
                TypeDePerte
              }

              group {
                name
                color
              }
            }

            options(
              slugs: ["dbrd_wgt5_prctg_color", "customers_type_color"]
            ) {
              name
              value
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        const options = {};
        (data.options || []).map(({ name, value }) => {
          try {
            options[name] = JSON.parse(value);
          } catch {
            options[name] = value;
          }
          return options[name];
        });
        resolve({ ...data, options });
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
};
export function filters(slugs = []) {
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          slugs,
        },
        query: gql`
          query filtersclient($slugs: [String]) {
            filtersclient(slugs: $slugs) {
              name
              data {
                name
                value
                favorite
              }
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        resolve(data.filtersclient);
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
}
export const groups = (ids = []) => {
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          ids,
        },
        query: gql`
          query groupClient($ids: [ID]) {
            groupClient(ids: $ids) {
              id
              name
              color
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        resolve(data.groupClient);
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
};
export const get = (ids = [], search = "", filters = []) => {
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          ids,
          search,
          filters,
        },
        query: gql`
          query clients($ids: [ID], $search: String, $filters: [ArrayFilterInput]) {
            clients(ids: $ids, search: $search, filters: $filters) {
              ${GQL_CLIENT}
            }
            options(slugs: ["dbrd_wgt5_prctg_color", "customers_type_color"]) {
              name
              value
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        const options = {};
        (data.options || []).map(({ name, value }) => {
          try {
            options[name] = JSON.parse(value);
          } catch {
            options[name] = value;
          }
          return options[name];
        });
        resolve({ ...data, options });
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
};

// Delete a Client by PK (NumeroClient)
export const remove = (id) => {
  return new Promise((resolve, reject) => {
    apolloService
      .mutate({
        variables: {
          data: {
            NumeroClient: id,
          },
        },
        mutation: gql`
          mutation client($data: ClientInput!) {
            client(data: $data, operation: "delete") {
              NumeroClient
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        resolve(data.client);
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
};

// Create or update an item
export const mutate = (data) => {
  return new Promise((resolve, reject) => {
    apolloService
      .mutate({
        variables: {
          data,
        },
        mutation: gql`
          mutation($data: ClientInput!) {
            client(data: $data) {
              ${GQL_CLIENT}
            }
          }
        `,
        context: {
          headers: {
            authorization: "Bearer " + jwtService.getAccessToken(),
          },
        },
      })
      .then(({ data }) => {
        resolve(data.client);
      })
      .catch((error) => {
        const r = [];
        for (const e of error.graphQLErrors) {
          r.push({
            code: e.extensions.code,
            message: e.message,
          });
        }
        reject(r);
      });
  });
};

const GQL_CLIENT = `
  NumeroClient
  Inactif
  NomClient
  TypeClient
  Adresse
  Ville
  CodePostal
  Courriel
  TelBureau
  TelFax
  TelCellulaire
  TelDomicile
  TelAutre
  SiteWeb
  Langue
  Commentaires
  Directives
  createdAt
  updatedAt
  group {
    id
    name
    color
  }
  folders {
    NumeroDossier
    RecuPar
    TypeBatiment
    Responsable
    Bureau
    VillePerte
    Reference
    Repertoire
    TypeDePerte
    DateFerme
    DateMandat
  }`;
