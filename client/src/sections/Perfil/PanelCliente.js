import React, { useState, useEffect } from 'react'
import "../../css/style.css"
import  Axios  from "axios"
import { TarjetaPerfil } from './TarjetaPerfil';
import useAuthCheck from '../hooks/useAuth.js';

export const PanelCliente = () => {
    const [nombre, setNombre] = useState()
    const [administrador, setAdministrador] = useState()
    const { autenticacion, checked } = useAuthCheck();

    const getAdministrador = async () => {
        try{
            await Axios.get("http://localhost:3001/datosCliente")
            .then((response) => {
                setNombre(response.data.nombre)
                setAdministrador(response.data.administrador)
            }) 
        } catch {
            console.log("Error al recoger datos del cliente")
        }
    }

    useEffect(()=>{
       if (autenticacion && checked) {
            getAdministrador()
       }
    },[autenticacion, checked])
    
    
    return (   
        <div className="body">
            <h1>Hola {nombre}!</h1>
            <div className="contenedorPanel">                
                <TarjetaPerfil imagen= "perfil" ruta= "misdatos" titulo= "Mis datos" descripcion="Aqui puedes modificar los datos de tu cuenta"/>   
                
                <TarjetaPerfil imagen= "clave" ruta= "cambioClave" titulo= "Cambio clave" descripcion="Aqui puedes modificar la clave de tu cuenta"/>   

                <TarjetaPerfil imagen= "pedidos" ruta= "mispedidos" titulo= "Mis pedidos" descripcion="Historial de todos los pedidos realizados en la plataforma"/>   

                <TarjetaPerfil imagen= "productos"  ruta="misproductospedidos" titulo= "Mis productos pedidos" descripcion="Todos los productos que ya he consumido de la tienda"/>  

                {/* SOLO LO VEN LOS ADMINISTRADORES */}
                {
                    administrador==="S" && (
                       <>
                        <TarjetaPerfil imagen= "clientes"  ruta="clientes" titulo= "Clientes" descripcion="Todos los clientes registrados en la plataforma"/>                          
                                    
        
                        <TarjetaPerfil imagen= "tienda"  ruta="mantetienda" titulo= "Mantenimiento Productos" descripcion="Alta, baja y actualizacion de los productos de la tienda"/>
        
                        <TarjetaPerfil imagen= "recetas"  ruta="manterecetas" titulo= "Mantenimiento Recetas" descripcion="Alta, baja y actualizacion de recetas de la plataforma"/>
                       </> 
                    ) 
                }
            </div>
        </div>
    )
 }