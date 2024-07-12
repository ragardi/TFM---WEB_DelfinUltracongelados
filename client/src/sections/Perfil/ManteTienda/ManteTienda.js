import React, { useState, useEffect } from 'react'
import "../../../css/style.css"
import { Alert } from '@mui/material';
import  Axios  from "axios";
import useAuthCheck from '../../hooks/useAuth.js';
import { ModalTienda} from './ModalTienda';

export const ManteTienda = () => {
    const [productos, setProductos] = useState([])
    const [tipoProducto, setTipoProducto] = useState([])
    const [mensajeAlert, setMensajeAlert] = useState("")
    const [tipoMensaje, setTipoMensaje] = useState("")
    const [abrir, setAbrir] = useState(false)
    const [productoSeleccionado, setProductoSeleccionado] = useState()
    const [tipoModal, setTipoModal] = useState()
    const { autenticacion, checked } = useAuthCheck();

    const top = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }
    
    const abrirModal = (tipo, producto = null) => {
        setTipoModal(tipo)
        setProductoSeleccionado(producto)
        setAbrir(true)
    }

    const getProductos = () => {
        Axios.get("http://localhost:3001/getProductos")
        .then((response) => {
            if (response.data.length > 0){
                setProductos(response.data)
            }else{
                setMensajeAlert(response.data.message);
                setTipoMensaje(response.data.success);
            }
        }).catch((error) =>{
            setMensajeAlert("No se han recuperado productos")
            setTipoMensaje("error");
        })
    }

    const getTipoProductos = () => {
        Axios.get("http://localhost:3001/getTipoProductos")
        .then((response) => {
            if (response.data.length > 0){
                setTipoProducto(response.data)
            }else{
                console.log("no estamos aqui")
                setMensajeAlert(response.data.message);
                setTipoMensaje(response.data.success);
            }
        }).catch((error) =>{
            setMensajeAlert("No se han recuperado productos")
            setTipoMensaje("error");
        })
    }

    useEffect(()=>{
        if (autenticacion && checked) {
            getProductos()
            getTipoProductos()
        }
     },[autenticacion, checked])

    useEffect(()=>{
        if (autenticacion && checked) {
            getProductos()
            getTipoProductos()
        }
     },[autenticacion, checked, abrir])

    const getDescripcionTipo = (codigoTipo) => {
        const tipo = tipoProducto.find(t => t.c_tipo === codigoTipo);
        return tipo ? tipo.d_tipo : "Desconocido";
    };

    return (        
        <div className="body">
            <h1>Mantenimiento Productos</h1>
            <img style={{width:100, cursor: "pointer", paddingBottom:2}} src={"images/insertar.png"}  onClick = {() =>abrirModal("nuevo")}  alt = 'Nuevo' />

            <div className="contenedor">  
            {
                productos ? (

                    <table className="tabla">
                        <thead>
                            <tr>
                                <th className="tabla-th">Código</th>
                                <th className="tabla-th">Nombre</th>
                                <th className="tabla-th">Tipo</th>
                                <th className="tabla-th">Unidades</th>
                                <th className="tabla-th">Formato</th>
                                <th className="tabla-th">Precio</th>
                                <th className="tabla-th">URL imagen</th>
                                <th className="tabla-th">Estado</th>
                            </tr>
                        </thead>
                            
                            {
                                productos.map((prod,index)=>{
                                    return(
                                        <tbody>
                                            <tr key={prod.c_produ} className = {index%2 ? "" : "trColor"}>
                                                <td className="tabla-borde-izq" style={{textAlign:"center", paddingRight:"7px"}}>{prod.c_produ}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{prod.d_produ}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{getDescripcionTipo(prod.c_tipo)}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{prod.unidad === "K" ? "Kilos" : "Envases"}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{prod.formato}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{prod.precio}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{prod.url_foto}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>
                                                    {prod.estado === "A" ? "Alta" : 
                                                     prod.estado === "B" ? "Baja" :
                                                     "Sin Stock"
                                                    }
                                                </td>
                                                <td className="tabla-td">                                                    
                                                    <img style={{width:30, cursor: "pointer", paddingBottom:2}} src={"images/editar.png"} onClick = {() =>abrirModal("editar", prod)} alt = 'Editar' />
                                                </td>
                                                <td className="tabla-borde-der">                                                    
                                                    <img style={{width:30, cursor: "pointer", paddingBottom:2}} src={"images/eliminar.png"} onClick = {() =>abrirModal("eliminar", prod)} alt = 'Eliminar' />
                                                </td>
                                            </tr>
                                        </tbody>          
                                    )
                                })
                                
                            }
                        </table>
                    ) : (
                        <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                    )
                }

                <ModalTienda
                    open={abrir}
                    onClose={() => setAbrir(false)}
                    tipo={tipoModal}
                    producto={productoSeleccionado}
                />
            </div>
            <img className='btnToTop' src={"images/flecha-arriba.png"} alt="top" onClick={() =>{top()}}/>
        </div>
    )
 }