import React, { useEffect, useState } from 'react';
import { Snackbar, SnackbarContent, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useAuthCheck from '../../hooks/useAuth.js';
import { useNavigate } from "react-router-dom"
import { TarjetaProducto } from '../../Productos/TarjetaProducto.js';

import Axios from "axios";
import "../../../css/style.css"

export const MisProductosPedidos = () => {
    const [productos, setProductos] = useState([])
    const [mensajeAlert, setMensajeAlert] = useState("No existen pedidos")
    const [tipoMensaje, setTipoMensaje] = useState("error")
    // const [contadores, setContadores] = useState({});
    const { autenticacion, checked } = useAuthCheck();
    const [snackbar, setSnackbar] = useState({open:false, message:""})
    const navigate = useNavigate()

    const top = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }

    const getProductosPedidos = () => {
        Axios.get("http://localhost:3001/getproductospedidos")
        .then((response) => {
            console.log(response)            
            if (response.data.success) {
                setProductos(response.data.productoPedidos);
                // const datosIniciales = {};
                // response.data.productoPedidos.forEach(producto => {
                //     datosIniciales[producto.c_produ] = 0;
                // });
                // setContadores(datosIniciales);
            } else {
                if (response.data.auth) {
                    setMensajeAlert(response.data.message)
                    setTipoMensaje("error")
                } else {
                    navigate("/perfil")
                }
            }
        })
    }

    const showSnackbar = (message) => {
        setSnackbar({open:true, message})
        setTimeout(() => {
            setSnackbar({ open: false, message: '' });
        }, 3000);
    }

    useEffect(()=>{
        if (autenticacion && checked) {
            getProductosPedidos()
        }
     },[autenticacion, checked])

    return (
        <div className='body'>
            <h1>¿Quieres repetir?</h1>
            <div className="contenedorColumnas">
            {
                productos.length > 0 ? (

                    productos.map((prod, index) => (
                        <TarjetaProducto key={index} prod={prod} index={index} showSnackbar= {showSnackbar}/>
                ))
            ) : (
                <Alert className="mensajeAlert" severity={tipoMensaje} onClose={() => { setMensajeAlert(null) }}>{mensajeAlert}</Alert>
            )}
        </div>
        <img className='btnToTop' src={"images/flecha-arriba.png"} alt="top" onClick={top} />

        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ open: false, message: '' })}
        >
            <SnackbarContent
                message={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon />
                        {snackbar.message}
                    </span>
                }
                style={{ backgroundColor: "#aad8a6" }}
            />
        </Snackbar>
    </div>
    )
}
 