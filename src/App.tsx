/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useState, useEffect, useContext } from "react";
import { app, db } from "firebaseApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from "./components/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader";
import { ThemeContext } from "context/ThemeContext";

function App() {
  const context = useContext(ThemeContext);

  const auth = getAuth(app);

  //auth를 체크하기 전에 initialize 전 에는 loader를 띄어주는 용도
  const [init, setInit] = useState<boolean>(false);

  //auth의 currentUser가 있으면 authentiacted로 변경
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <div className={context.theme === "light" ? "white" : "dark"}>
      <ToastContainer />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </div>
  );
}

export default App;
