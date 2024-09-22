// src/front/js/store/flux.js

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      user: null,
      token: localStorage.getItem("token") || null, // Initialize from localStorage
    },
    actions: {
      setUser: (user) => setStore({ user }),
      setToken: (token) => {
        setStore({ token });
        if (token) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
      },
      logout: () => {
        setStore({ token: null, user: null });
        localStorage.removeItem("token");
      },
      login: async (email, password) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(
              data.message || "An error occurred. Please try again."
            );
          }

          const data = await response.json();
          setStore({ token: data.token });
          localStorage.setItem("token", data.token);
          return data;
        } catch (error) {
          console.log("Error during login:", error);
          throw error;
        }
      },
      signup: async (email, username, password) => {
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/signup`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, username, password }),
            }
          );

          if (!response.ok) {
            const data = await response.json();
            throw new Error(
              data.message || "An error occurred. Please try again."
            );
          }

          const data = await response.json();
          setStore({ user: data.user });
          return data;
        } catch (error) {
          console.log("Error during signup:", error);
          throw error;
        }
      },
      getMessage: async () => {
        try {
          const resp = await fetch(`${process.env.BACKEND_URL}/api/hello`);
          if (!resp.ok) {
            throw new Error("Network response was not ok.");
          }
          const data = await resp.json();
          setStore({ message: data.message });
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
          return null; // or throw error if you want to propagate it
        }
      },
      // Add more actions here
    },
  };
};

export default getState;
