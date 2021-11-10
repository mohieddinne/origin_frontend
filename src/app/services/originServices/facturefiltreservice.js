import { gql } from "@apollo/client";
import apolloService from "../apolloService";

import { jwtService } from "app/services/originServices";

export function filters(slugs = []) {
  return new Promise((resolve, reject) => {
    apolloService
      .query({
        variables: {
          slugs,
        },
        query: gql`
          query filtersinvoice($slugs: [String]) {
            filtersinvoice(slugs: $slugs) {
              name
              data {
                name
                value
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
        resolve(data.filtersinvoice);
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
