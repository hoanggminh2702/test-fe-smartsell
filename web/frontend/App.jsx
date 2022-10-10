import { NavigationMenu } from "@shopify/app-bridge-react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  PolarisProvider,
  QueryProvider,
} from "./components";
import OAthProvider from "./components/providers/OAthProvider";
import SessionAuthProvider from "./components/providers/SessionAuthProvider";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <PolarisProvider>
      <BrowserRouter>
        <OAthProvider>
          <AppBridgeProvider>
            <SessionAuthProvider>
              <QueryProvider>
                <NavigationMenu
                  navigationLinks={[
                    {
                      label: "Page name",
                      destination: "/pagename",
                    },
                  ]}
                />
                <Routes pages={pages} />
              </QueryProvider>
            </SessionAuthProvider>
          </AppBridgeProvider>
        </OAthProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
