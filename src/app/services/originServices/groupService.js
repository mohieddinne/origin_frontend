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
          operation: "create" || "update",
        },
        mutation: gql`
          mutation($data: ClientGroupsInput!, $operation: String) {
            clientGroup(data: $data, operation: $operation) {
              id
              name
              color
              fallback
              clientCount
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
        resolve(data.clientGroup);
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
