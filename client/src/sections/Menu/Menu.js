import React, { useEffect, useState, useContext } from "react"
import { MenuHamburguesa } from "./MenuHamburguesa";
import { AppBar, Toolbar, Tabs, Tab, useMediaQuery, useTheme} from "@mui/material";
import { Link, Outlet } from "react-router-dom"
import  Axios  from "axios"
import { AuthContext } from "../../Context/AuthContext.js";

import "../../css/style.css"

const PAGES = ["conocenos","productos", "recetas", "contacto"]

export const Menu = () => {
   const {autenticacion, setAutenticacion, pedidoPendiente, setPedidoPendiente} = useContext(AuthContext)
   const theme = useTheme()
   const isHamburguesa = useMediaQuery(theme.breakpoints.down("md"))

   Axios.defaults.withCredentials = true;
   const getAtenticacion = () => {
      Axios.get("http://localhost:3001/autenticacion")
      .then((response) => {
         if (response.data.success) setAutenticacion(response.data.success)
      }) 
   }

   const buscaPedidoPendiente = () => {
      Axios.get("http://localhost:3001/pedidopendiente")
         .then((response) =>{  
            if (response.data.success) {
               setPedidoPendiente(true)
            }}
         )
   }
   const cerrarSesion =() =>{
      Axios.post("http://localhost:3001/logout")
        .then((response) => {
         if (response.data.success){
            setAutenticacion(false)
        } 
      }) 
   }

   useEffect(() => {
      buscaPedidoPendiente()
      getAtenticacion()
   },[])

   return (
      <div>
         <AppBar className="appBar" style={{backgroundColor:"#004899"}}> 

            <Toolbar style={{justifyContent:"space-evenly", margin:"auto 20px"}}>
               {
                  isHamburguesa ? (
                     <>
                        <MenuHamburguesa/> 
                        <Link to= "" className="link">
                           <img src="images/logo_delfin.png" className="logo" alt="logo" />
                        </Link>
                     </>
                  )
                  : (
                     <>  
                        <Link to= "" className="link">
                           <img src="images/logo_delfin.png" className="logo" alt="logo" />
                        </Link>

                        <Tabs sx = {{margin: "auto"}} >                            
                              {
                                 PAGES.map((page,index) => (
                                    <Link key = {index} to= {`/${page}`} className="link">
                                       <Tab sx = {{fontSize: "1rem"}} label = {page} />
                                    </Link>
                                 ))
                              }                     
                        </Tabs>            
                     </>
                  )
               }
               
               {
                  autenticacion ? (
                     <>
                        <Link to= "perfil" className="link">
                           <img src="images/usuario.png" className="icono" alt="usuario"/>
                        </Link>
      
                        <Link to= "cesta" className="link">
                           <img src={pedidoPendiente ? "images/cesta_llena.png": "images/cesta.png"} className="icono" alt="cesta"/>
                        </Link>
                        <Link to="" className="link">
                           <img src="images/cerrar-sesion.png" className="icono" alt="salir" onClick={() => {cerrarSesion()}}/>
                        </Link>
                     </>
                  ) : (
                     <Link to= "sesion" className="link">
                        <img src="images/usuario.png" className="icono" alt="usuario"/>
                     </Link>
                  )
               }

            </Toolbar> 
               
         </AppBar>
         
         <Outlet />              
      </div>
   )
}
