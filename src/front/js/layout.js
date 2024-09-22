import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { LoginOk } from "./pages/loginOk";
import { PaginaPrivada } from "./pages/paginaPrivada";
import Signup from "./pages/signup";
import { SignupOk } from "./pages/signupOk";
import { LogoutPage } from "./pages/logoutOk"; // Importa la nueva página de despedida
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<LoginOk />} path="/loginok" />
                        <Route element={<PaginaPrivada />} path="/paginaprivada" />
                        <Route element={<Signup />} path="/signup" />
                        <Route element={<SignupOk />} path="/signupok" />
                        <Route element={<LogoutPage />} path="/logoutOk" /> {/* Ruta para la página de despedida */}
                    </Routes>
                    {/* <Footer /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
