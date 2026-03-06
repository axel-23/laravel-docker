import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { deserializeStore, serializeStore } from "@/utils/serialize";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [auth, setAuthState] = useState(() => {
        const stored = localStorage.getItem("auth");
        return stored ? JSON.parse(stored) : null;
    });

    const setAuth = useCallback((data) => {
        const serialized = serializeStore(data);
        localStorage.setItem("auth", JSON.stringify(serialized));
        setAuthState(serialized);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("auth");
        setAuthState(null);
        window.location.assign("/login");
    }, []);

    const authData = useMemo(() => {
        return auth ? deserializeStore(auth) : null;
    }, [auth]);

    const canAction = useCallback((action) => {
        if (!action) return true;
        return authData?.permissions?.includes(action);
    }, [authData]);

    const value = useMemo(() => ({
        getAuth: () => authData,
        setAuth,
        canAction,
        logout,
        isLogged: Boolean(authData?.token),
    }), [authData, setAuth, canAction, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
