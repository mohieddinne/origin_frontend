import { gql } from "@apollo/client";
import apolloService from "../apolloService";
import { jwtService } from "app/services/originServices";

// Add Or Update New groupe
export const mutate = (data) => {
  return new Promise((resolve, reject) => {
    apolloService
      .mutate({
        variables: {
          data: data,
        },
        mutation: gql`
          mutation($data: HolidaysInput!) {
            holiday(data: $data) {
              id
              name
              date
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
        resolve(data.holiday);
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
