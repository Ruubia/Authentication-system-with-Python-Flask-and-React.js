import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
  const { store } = useContext(Context);

  return (
    <div className="text-center mt-5">
      {store.user ? (
        <>
          <h1>Welcome, {store.user.email}!</h1>
          <p>Great, now you can access the private area.</p>
        </>
      ) : (
        <>
          <h1>Please log in to see your dashboard</h1>
        </>
      )}
    </div>
  );
};
