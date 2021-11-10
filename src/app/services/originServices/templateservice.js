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
          mutation($data: TemplateContentInput!) {
            TemplateContent(data: $data) {
              TemplateContentId
              language
              object
              message
              from_name
              plaintext
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
