import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { Alert } from "@mui/material"
import useAuthCheck from '../hooks/useAuth.js';
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext.js";

export const Cesta = () => {
    const [detallePedido, setDetallePedido] = useState([])
    const [mensajeAlert, setMensajeAlert] = useState("")
    const [tipoMensaje, setTipoMensaje] = useState("")
    const [contadores, setContadores] = useState({})
    const { autenticacion, checked } = useAuthCheck();
    const navigate = useNavigate()
    const { setPedidoPendiente } = useContext(AuthContext);
    let totalCantidad = 0
    let totalPrecio = 0

    const top = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }

    const sumar = (c_produ, c_pedido) => {
        setContadores(prevContadores => {
            const cantidad = (prevContadores[c_produ] || 0) + 1;
            actualizaCesta(c_produ, c_pedido, cantidad)
            return {
                ...prevContadores,
                [c_produ]:cantidad
            }
        })
    }

    const restar = (c_produ, c_pedido) =>{
        setContadores(prevContadores => {
            const cantidad = (prevContadores[c_produ] > 0 ? prevContadores[c_produ] - 1 : 0)
            if (cantidad === 0) {
                setPedidoPendiente(false)
                eliminar(c_produ, c_pedido)
            } else {
                actualizaCesta(c_produ, c_pedido, cantidad)
            }
            return {
                ...prevContadores,
                [c_produ]:cantidad
            }
        })
    }
   
    const actualizaCesta = (c_produ, c_pedido, cantidad) => {
        Axios.put("http://localhost:3001/actualizacesta", {
            cantidad,
            c_produ, 
            c_pedido
        })
        .then(() => {
            getLineasProductos();
        })
    }

    const eliminar = (c_produ, c_pedido) => { 
        Axios.put("http://localhost:3001/eliminaproductocesta", {
            c_produ, 
            c_pedido
        })
        .then(() => {
            getLineasProductos();
        })
    }
    
    const getLineasProductos = (pedido) => {
        return Axios.get("http://localhost:3001/mispedidosdet", {
            params: { pedido }
        }).then((response) => {
            if (response.data.success) {
                if (response.data.detalle_pedido.length <= 0)  setPedidoPendiente(false)
                setDetallePedido(response.data.detalle_pedido)
               
                //Enlazo la cantidad con los contadores de la cesta
                const initialContadores = {};
                    response.data.detalle_pedido.forEach(producto => {
                    initialContadores[producto.c_produ] = producto.cantidad;
                });
                setContadores(initialContadores);
            } else {
                if (response.data.auth) {
                    setMensajeAlert(response.data.message) 
                    setTipoMensaje("error")
                } else {
                    navigate("/perfil")
                } 
            }
        }).catch(() => {
            setPedidoPendiente(false)
        });
    }

    useEffect(()=>{
        if (autenticacion && checked) {
            getLineasProductos()
        }
    },[autenticacion, checked])

    return (
        <div className="body">
            <h1>MI CESTA</h1>

            <div className="contenedorCesta">
                {
                    detallePedido.length > 0 && tipoMensaje !== "error" ? (
                        <>
                            <div className="listaProductosCes">
                            {
                                detallePedido.map((det, index) => {
                                    totalCantidad += parseFloat(det.cantidad)
                                    totalPrecio += parseFloat(det.importe)

                                    return(

                                        <section key={index} className="productosCes">
                                            <header className="imagenProductoCesta">
                                                <img src={`images/${det.url_foto}`} alt={det.d_produ} height="130" style={{borderRadius:20}}/>
                                            </header>

                                            <article className="detProductoCes">
                                                <h4>{det.d_produ}</h4>
                                                <h4>{det.formato}</h4>
                                                <h5>({det.precio.toFixed(2)}€/und)</h5>
                                            </article>

                                            <article className="cantidadCes">
                                                <img style={{cursor:"pointer"}} src={"images/menos.png"} alt="menos" height={20} onClick={() => restar(det.c_produ, det.c_pedido)}/>
                                                <h3>{contadores[det.c_produ] || 0}</h3>
                                                <img style={{cursor:"pointer"}} src={"images/mas.png"} alt="mas" height={20} onClick={() => sumar(det.c_produ, det.c_pedido)}/>
                                            </article>

                                            <article className="precioProductoCesta">
                                                <h3>{(det.precio * contadores[det.c_produ]).toFixed(2)} €</h3> 
                                            </article>

                                            <footer className="botonEliminarProducCesta">
                                                <img style={{cursor:"pointer", height:23}} src={"images/eliminar.png"} onClick = {() =>eliminar(det.c_produ, det.c_pedido)} alt = 'Eliminar' />
                                            </footer>
                                        </section>
                                    )
                                })  
                            } 
                            </div>
                           
                        
                            <div className="resumenCes">
                                <h2>Mi pedido</h2>
                                <p>Cantidad de artículos: {totalCantidad}</p>
                                <p>TOTAL (IVA incluido): {(totalPrecio.toFixed(2))} €</p>
                                <p>IVA (21%): {(totalPrecio * (0.21)).toFixed(2)} €</p>
                                <h3>TOTAL: {(totalPrecio.toFixed(2))} €</h3>
                                
                                <button className = "boton" onClick={() => navigate("/formaenvio")}>Validar mi cesta</button>
                            </div>
                        </>
                    ) : (
                        <>
                            {
                                mensajeAlert.length > 0 && (
                                    <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>

                                )
                            }
                                   
                        </>
                    )
                }

            </div>
            <img className='btnToTop' src={"images/flecha-arriba.png"} alt="top" onClick={top} />
        </div>
    )
 }

 