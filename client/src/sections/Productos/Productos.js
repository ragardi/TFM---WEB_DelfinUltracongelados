import React, { useEffect, useState, useContext} from 'react';
import { Snackbar, SnackbarContent, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Axios from "axios";
import "../../css/style.css";
import { FiltroProdutos } from './FiltroProductos';
import { TarjetaProducto } from './TarjetaProducto';

export const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [contadores, setContadores] = useState({});
    const [filtro, setFiltro] = useState(0);
    const [buscar, setBuscar] = useState("")
    const [snackbar, setSnackbar] = useState({open:false, message:""})
    
    const top = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    Axios.defaults.withCredentials = true;

    const getProductos = () => {
        Axios.get("http://localhost:3001/getProductos")
        .then((response) => {
            setProductos(response.data);
            const datosIniciales = {};
            response.data.forEach(producto => {
                datosIniciales[producto.c_produ] = 0;
            });
            setContadores(datosIniciales);
        });
    };

    const filtroProductos = (productos) => {
       return productos.filter(producto => 
            (filtro === 0 || producto.c_tipo === filtro) &&
            (buscar === "" || producto.d_produ.toLowerCase().includes(buscar.toLowerCase())) 
        );
    };

    const buscarProducto = (event) => {
        setBuscar(event.target.value)
    }

    const showSnackbar = (message) => {
        setSnackbar({open:true, message})
        setTimeout(() => {
            setSnackbar({ open: false, message: '' });
        }, 3000);
    }

    useEffect(() => {
        getProductos();
    }, [filtro]);

    return (
        <div className='body'>
                <h1>Nuestros productos</h1>
                <TextField className='tfBuscar' id="buscar" label="Buscar Artículo" type='text' onChange={buscarProducto} size="small"/>
                <FiltroProdutos nuevoFiltro={setFiltro} filtro={filtro}/>
                <div className="contenedorColumnas">
             
                    {
                        filtroProductos(productos).map((prod, index) => (
                            <TarjetaProducto prod={prod} index={index} showSnackbar= {showSnackbar}/>
                        ))
                    }

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
    );
};
