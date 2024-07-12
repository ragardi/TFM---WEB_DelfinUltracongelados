import React, {useState, useContext, useEffect} from "react"
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material"
import { Link } from "react-router-dom"
import  Axios  from "axios"
import { AuthContext } from "../../Context/AuthContext.js";

import "../../css/style.css"

const PAGES_1 = ["conocenos","productos", "recetas", "contacto"]
const PAGES_2 = ["perfil","cesta"]

export const MenuHamburguesa = () => {
    const {autenticacion, setAutenticacion, pedidoPendiente, setPedidoPendiente} = useContext(AuthContext)
    const [openHamburguesa,setOpenhamburguesa] = useState(false)

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

    useEffect(() => {
        buscaPedidoPendiente()
        getAtenticacion()
    },[])
    
    const cerrarSesion = () => {
        Axios.post("http://localhost:3001/logout")
            .then((response) => {
            if (response.data.success){
                setAutenticacion(false)
                setOpenhamburguesa(!openHamburguesa)
            } 
        }) 
    }

    return(
        <>
            <Drawer open={openHamburguesa} onClose = {() => {setOpenhamburguesa(false)}}>
                <List>

                    {
                        PAGES_1.map((page, index) => (
                            <ListItemButton onClick ={() => setOpenhamburguesa(!openHamburguesa)} key={index}>
                                <ListItemIcon>
                                    <Link to= {`/${page}`}>
                                        <ListItemText>
                                            {page.toUpperCase()}
                                        </ListItemText>
                                    </Link>
                                </ListItemIcon>
                            </ListItemButton>                            
                        ))
                    }
                    <Divider/>
                    {       
                        PAGES_2.map((page, index) => (
                            <ListItemButton onClick ={() => setOpenhamburguesa(!openHamburguesa)} key={index}>
                                <ListItemIcon>
                                    <Link to= {`/${page}`}>
                                        <ListItemText>
                                            {page.toUpperCase()}
                                        </ListItemText>
                                    </Link>
                                </ListItemIcon>
                            </ListItemButton>                            
                        ))
                    }
                </List>
                <button className = "boton" onClick={()=>{cerrarSesion()}}>Desconectar</button>
            </Drawer>
            
            <img src="images/menu.png" className="icono" alt="hamburguesa" onClick = {()=>setOpenhamburguesa(!openHamburguesa)}/>

        </>
    )
}