import React, { useEffect, useContext } from 'react'
import  Axios  from "axios"
import { AuthContext } from "../../Context/AuthContext.js";
import { PanelCliente } from './PanelCliente.js';
import { Sesion } from '../Sesion/Sesion.js';

export const Perfil = () => {
    const {autenticacion, setAutenticacion} = useContext(AuthContext)

    Axios.defaults.withCredentials = true;
    const getAtenticacion = () => {
      Axios.get("http://localhost:3001/autenticacion")
      .then((response) => {
         if (response.data.success) setAutenticacion(response.data.success)
      }) 
   }

    useEffect(()=>{
        getAtenticacion()
    },[])


    return (        
        autenticacion ? (
            <PanelCliente/>
        ) : (
            <Sesion/>
        )

    )
 }