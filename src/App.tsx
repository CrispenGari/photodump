import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "./actions";
import { auth } from "./firebase";
import { Routes } from "./routes";
import { StateType } from "./types";
import "./App.css";
import { pick } from "lodash";

export const App = () => {
  const user = useSelector((state: StateType) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // user logged in
        const _user = pick(user, [
          "displayName",
          "email",
          "phoneNumber",
          "emailVerified",
          "photoURL",
          "uid",
        ]);
        dispatch(setUser(_user));
      } else {
        // user in not logged in
        dispatch(setUser(null));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, navigate]);
  return (
    <div className="app">
      <Routes user={user} />
    </div>
  );
};
