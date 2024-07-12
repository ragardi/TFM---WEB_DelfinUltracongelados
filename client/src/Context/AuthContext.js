import { createContext, useState } from "react";

//CREO EL CONTEXTO
export const AuthContext = createContext()

//CREO EL PROVIDER PARA PROVEER EL CONTEXTO
export function AuthProvider ({children}) {
    const [autenticacion, setAutenticacion] = useState(false)
    const [pedidoPendiente, setPedidoPendiente] = useState(false)

    return(
        <AuthContext.Provider value ={{
            autenticacion, setAutenticacion, pedidoPendiente, setPedidoPendiente
        }}>
            {children}
        </AuthContext.Provider>
    )
}