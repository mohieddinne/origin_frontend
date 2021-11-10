import { ApolloClient, from, split } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import jwtService from "../originServices/jwtService";

// Set Origin Apollo Server link
const uri = process.env.REACT_APP_GRAPHQL_URL;
const wsUri = process.env.REACT_APP_GRAPHQL_WS;

// Set the Apollo Server http link
const httpLink = createUploadLink({ uri });

const token = window.localStorage.getItem("jwt_access_token");
const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: {
      authorization: "Bearer " + token,
    },
  },
});

const middlewares = getMiddlewares();
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  from([...middlewares, httpLink])
);

// Creat the Apollo Client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    addTypename: true,
    possibleTypes: {
      AsyncDataNode: ["Activity"],
      ActivityFilterData: [
        "ActivityFilterEmployee",
        "ActivityFilterFolder",
        "ActivityFilterComment",
        "ActivityFilterInsurer",
        "ActivityFilterType",
        "ActivityFilterCategory",
        "ActivityFilterCustomer",
      ],
    },
  }),
});

function getMiddlewares() {
  const authMiddleware = setContext((_, props) => {
    let { headers } = props;
    const authHeaders = jwtService.getAuthHeaders();
    if (authHeaders) {
      headers = { headers, ...authHeaders };
    }
    return { headers };
  });

  const errorMiddleware = onError(
    ({ response, graphQLErrors, networkError }) => {
      // If the error comes from the graphQL
      if (Array.isArray(graphQLErrors)) {
        const grantError = graphQLErrors.find((error) => {
          return (
            error.extensions.code.toUpperCase() === "GRANT_ERROR"
          );
        });
        if (grantError) {
          jwtService.emit("onAutoLogout", grantError.message);
          jwtService.setSession(null);
          client?.resetStore();
          response.errors = null;
        }
      }
      if (networkError) {
        // Log
      }
    }
  );

  return [authMiddleware, errorMiddleware];
}

export default client;
