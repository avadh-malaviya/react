import React from "react";
import {
  BrowserRouter,
  Routes as ReactRoutes,
  Route,
  Navigate,
} from "react-router-dom";

import routes from "./routes";
import Main from "../layouts/Main";
import Default from "../layouts/Default";

import { useAuthState } from "../store/context";

const Routes = (props) => {
  const userDetails = useAuthState();
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      {/* <AuthProvider> */}
      <ReactRoutes>
        <Route element={<Main />}>
          {routes
            .filter((el, i) => !el.auth)
            .map((route, i) => {
              const { element: Component, ...rest } = route;
              return (
                <Route
                  key={i}
                  {...rest}
                  element={
                    <>
                      {!Boolean(userDetails.isAuthenticated) ? (
                        <Navigate to="/login" />
                      ) : (
                        <Component />
                      )}
                      {/* <Component /> */}
                    </>
                  }
                />
              );
            })}
        </Route>
        <Route element={<Default />}>
          {routes
            .filter((el, i) => el.auth)
            .map((route, i) => {
              const { element: Component, ...rest } = route;
              return (
                <Route
                  key={i}
                  {...rest}
                  element={
                    <>
                      {Boolean(userDetails.isAuthenticated) ? (
                        <Navigate to="/" />
                      ) : (
                        <Component />
                      )}
                      {/* <Component /> */}
                    </>
                  }
                />
              );
            })}
        </Route>
      </ReactRoutes>
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
};

export default Routes;
