import { gql } from "@apollo/client";
import apolloService from "../apolloService";

import { jwtService } from "app/services/originServices";

class FactureService {
  get = (ids = [], search = "", filtersObj = {}, splited = false) => {
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
            splited,
          },
          query: gql`
            query factures(
              $ids: [ID]
              $search: String
              $filters: [ArrayFilterInput]
              $splited: Boolean
            ) {
              factures(
                ids: $ids
                search: $search
                filters: $filters
                splited: $splited
              ) {
                NumeroFacture
                NumeroDossier
                DateFacturation
                MontantHonoraires
                MontantAdm
                MontantDepenses
                MontantFacture
                folders {
                  Bureau
                }
                ratio
                reviser
                customer {
                  NomClient
                  NumeroClient
                }
              }
              options(
                slugs: [
                  "dbrd_wgt5_prctg_color"
                  "customers_type_color"
                ]
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
          fetchPolicy: "no-cache",
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
  // Add New Facture
  mutate = (data) => {
    return new Promise((resolve, reject) => {
      delete data.id;
      apolloService
        .mutate({
          variables: {
            data: data,
          },
          mutation: gql`
            mutation($data: FactureInput!) {
              facture(data: $data) {
                NumeroFacture
                NumeroDossier
              }
            }
          `,
          context: {
            headers: {
              authorization: "Bearer " + jwtService.getAccessToken(),
            },
          },
        })
        .then((response) => {
          resolve(parseInt(response.data.facture));
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
  delete = (id) => {
    return new Promise((resolve, reject) => {
      apolloService
        .mutate({
          variables: {
            data: {
              NumeroFacture: id,
            },
          },
          mutation: gql`
            mutation facture($data: FactureInput!) {
              facture(data: $data, operation: "delete") {
                NumeroFacture
                NumeroDossier
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
          resolve(data.facture);
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
}

const instance = new FactureService();

export default instance;
