import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const OAuthContext = createContext();

const OAthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);

  // const shopifyParams = useState(() => {
  //   const searchParams = new URLSearchParams(location.search);
  //   console.log(location.search);
  //   const hmac = searchParams.get("hmac");
  //   const host = searchParams.get("host");
  //   const state = searchParams.get("state");
  //   const shop = searchParams.get("shop");
  //   const timestamp = searchParams.get("timestamp");
  //   return {
  //     hmac,
  //     host,
  //     state,
  //     shop,
  //     timestamp,
  //   };
  // })[0];

  // const shopifyAuthQueryParams = useMemo(() => {
  //   let resultString = "";

  //   Object.getOwnPropertyNames(shopifyParams).forEach((prop, index) => {
  //     if (shopifyParams[prop]) {
  //       resultString += `${index !== 0 ? "&" : ""}${prop}=${
  //         shopifyParams[prop]
  //       }`;
  //     }
  //   });

  //   return resultString;
  // }, [shopifyParams]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_HOST}/auth${location.search}`;
    axios
      .get(url)
      .then((result) => {
        console.log({ result });
        if (result.data.url) {
          window.location.replace(result.data.url);
        } else if ("isInstalled" in result.data) {
          console.log(result.data);
          setAuth(result.data.isInstalled);
        }
      })
      .catch((err) => {
        setAuth(false);
        console.log(err);
      });
  }, [location.search]);

  useEffect(() => {
    console.log({ auth });
  }, [auth]);
  return auth ? (
    <OAuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </OAuthContext.Provider>
  ) : (
    <></>
  );
};

export default OAthProvider;
