import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Axios from "axios";import { Alert } from '@mui/material';
import { useNavigate } from "react-router-dom"

export const DetallePedido = () => {
    const {c_pedido} = useParams()
    const [detallePedido, setDetallePedido] = useState([])
    const [mensajeAlert, setMensajeAlert] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const navigate = useNavigate()
    const [totalPrecio, setTotalPrecio] = useState(0)

    const top = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }

    const getProductos = (pedido) => {
        return Axios.get("http://localhost:3001/productospedido", {
            params: { pedido }
        }).then((response) => {
            if (response.data.success) {
                setDetallePedido(response.data.detalle_pedido)
            } else {
                if (!response.data.auth) navigate("/perfil")
            }
        });
    }

    useEffect(() =>{
        getProductos(c_pedido)
    },[])

    useEffect(() => {
        const total = detallePedido.reduce((acc, det) => acc + det.precio * det.cantidad, 0);
        setTotalPrecio(total.toFixed(2));
    }, [detallePedido]);
    
    return(
        <div className="body">
            <h1>Nº Pedido: {c_pedido}</h1>

            <div className="contenedorCesta">
                {
                    detallePedido.length > 0 && tipoMensaje !== "error" ? (
                        <>
                            <div className="listaProductosCes">
                            {
                                detallePedido.map((det, index) => {
                                    return(
                                        <section key={index} className="productosCes">
                                            <header className="imagenProductoCesta">
                                                <img src={`/images/${det.url_foto}`} alt={det.d_produ} height="130" style={{borderRadius:20}}/>
                                            </header>

                                            <article className="detProductoCes">
                                                <h4>{det.d_produ}</h4>
                                                <h4>{det.formato}</h4>
                                                <h5>({det.precio.toFixed(2)}€/und)</h5>
                                            </article>

                                            <article className="precioProductoCesta">
                                                <h4>x {det.cantidad}</h4> 
                                            </article>
                                            
                                            <article className="precioProductoCesta">
                                                <h3>{(det.precio * det.cantidad).toFixed(2)} €</h3> 
                                            </article>


                                        </section>
                                    )
                                })  
                            } 
                            </div>
                            <div style={{border:"1px solid", borderRadius:10, padding:5, height:80, margin:10}}>
                                <h2>TOTAL: {totalPrecio}€</h2>
                            </div>
                             
                        </>
                    ) : (
                        <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                    )
                }

            </div>
            <img className='btnToTop' src={"/images/flecha-arriba.png"} alt="top" onClick={top} />
        </div>
    )
}