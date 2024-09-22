import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";
import "../../styles/home.css";

export const LogoutPage = () => {
    const { store, actions } = useContext(Context);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const redirectTimeout = setTimeout(() => {
            setRedirect(true);
        }, 3000);

        return () => clearTimeout(redirectTimeout);
    }, []);

    return (
        <>
            {redirect ? <Navigate to="/" /> : null}
            <div className="container text-center">
                <div className="row align-items-start mt-5">
                    <div className="col"></div>
                    <div className="col-10">
                        <h2 className="display-6">Has cerrado sesión</h2>
                        <h5>Redirigiendo a la página de inicio de sesión...</h5>
                        <br />
                    </div>
                    <div className="col"></div>
                </div>
            </div>
        </>
    );
};
