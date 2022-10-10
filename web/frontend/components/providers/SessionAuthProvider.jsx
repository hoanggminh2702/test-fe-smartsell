import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch, getSessionToken } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import axios from "axios";
import { useContext, useEffect } from "react";
import { ApolloProvider } from "react-apollo";
import { OAuthContext } from "./OAthProvider";

const userLoggedInFetch = (app) => {
  const fetchFunction = authenticatedFetch(app);
  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);

      redirect.dispatch(Redirect.Action.APP, authUrlHeader || "/auth");
      return null;
    }

    return response;
  };
};

const SessionAuthProvider = ({ children }) => {
  const app = useAppBridge();
  const { auth } = useContext(OAuthContext);

  useEffect(() => {
    if (auth) {
      if (app) {
        getSessionToken(app)
          .then((token) => {
            // axios
            //   .post(
            //     `${
            //       import.meta.env.VITE_HOST
            //     }/test`,
            //     {
            //       shop: import.meta.env.VITE_SHOP,
            //       sessionToken: token,
            //     }
            //   )
            //   .then((res) => {
            //     console.log(res.data);
            //   });
            axios
              .get(`${import.meta.env.VITE_HOST}/test-controller/test-authen`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                console.log(res.data);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [auth, app]);

  const client = new ApolloClient({
    link: new HttpLink({
      credentials: "same-origin",
      fetch: userLoggedInFetch(app),
    }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default SessionAuthProvider;
