import React from "react"
import { Alert } from '@mui/material';

export const Error = () => {
    return(
        <Alert className="mensajeAlert" severity="error">Lo sentimos, esta ventana no existe</Alert>
    )
}