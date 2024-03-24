import {createContext, ReactNode, useContext, useEffect} from "react";
import {api} from "../app/api";
import {useLocalStorageState} from "../hook/LocalStorage";
import {useQueryClient} from "@tanstack/react-query";
import {AxiosError} from "axios";

interface AuthContextType {
    setToken: (v: string) => void,
    logout: () => void,
}
const AuthContext = createContext<AuthContextType>({
    setToken: () => void 0,
    logout: () => void 0,
})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider(props: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [token, setToken] = useLocalStorageState("token", "", true);

    handleTokenChange()
    useEffect(handleEffectAxiosInterceptor, [queryClient])

    return (
        <AuthContext.Provider value={{setToken: setTokenEncrypt, logout}}>
            {props.children}
        </AuthContext.Provider>
    )

    function setTokenEncrypt(v: string){
        setToken(window.btoa(v))
    }

    function logout(){
        setToken("")
    }

    // NOTE: we cannot use effect here, because it will render after initial render, and it will
    // cause in initial load info load twice
    function handleTokenChange() {
        if (token) api.defaults.headers.common["Authorization"] = `Bearer ${window.atob(token)}`
        else delete api.defaults.headers.common["Authorization"]
        queryClient.refetchQueries({queryKey: ["info"]}).then()
    }

    // NOTE: with React.StrictMode we will have two of them because it makes rerender twice
    // only for development env
    function handleEffectAxiosInterceptor() {
        const id = api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    queryClient.refetchQueries({queryKey: ["info"]}).then()
                }
                return Promise.reject(error)
            },
        )
        return () => api.interceptors.response.eject(id)
    }
}
