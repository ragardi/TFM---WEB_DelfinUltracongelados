import React, { useEffect, useState, useContext} from 'react';
import { Link } from "react-router-dom";
import Axios from "axios";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext.js";
import "../../css/style.css";

export const TarjetaProducto = (props) => {
    const {prod, index, showSnackbar} = props
    const [autenticacion, setAutenticacion] = useState(false);
    const [contadores, setContadores] = useState({});
    const { setPedidoPendiente } = useContext(AuthContext);
    const navigate = useNavigate()
    
    Axios.defaults.withCredentials = true; 

    const getAtenticacion = () => {
        Axios.get("http://localhost:3001/autenticacion")
        .then((response) => {
           if (response.data.success) setAutenticacion(response.data.success);
        });
    };

    const sumar = (id) => {
        setContadores(prevContadores => ({
            ...prevContadores,
            [id]: (prevContadores[id] || 0) + 1
        }));
    };

    const restar = (id) => {
        setContadores(prevContadores => ({
            ...prevContadores,
            [id]: prevContadores[id] > 0 ? prevContadores[id] - 1 : 0
        }));
    };

    const anadirCarro = (c_produ, cantidad, precio) => {
        if (cantidad > 0) {
            Axios.post("http://localhost:3001/anadirCarro", {
                c_produ,
                cantidad,
                precio
            }).then((response) => {
                if (response.data.auth) {
                    showSnackbar(response.data.message);
                    setPedidoPendiente(true)
                } else {
                    navigate("/perfil")
                }
            });
        }
    };

    useEffect(()=>{
        getAtenticacion()
    },[])

    return(
        <section key={index} className="tarjeta">
            <header>
                <Link to={`detalleproductos/${prod.c_produ}`} className="link">
                    <img className = "imgTarjeta" src={`images/${prod.url_foto}`} alt={prod.d_produ} />
                </Link>
            </header>
            {prod.estado === "A" ? (
                <>
                    <article className='detTarjProd'>
                        <h4 className='precio'>{`${prod.precio} €`}</h4>
                        <h3 className='tituloPro'>{prod.d_produ}</h3>
                        <p className='formato'>{`${prod.formato} `}</p>

                        <div className='footerTarjeta'>
                            {
                                autenticacion && (
                                    <>
                                        <footer className='footerCantidad'>
                                            <img style={{ cursor: "pointer" }} src={"images/menos.png"} alt="menos" height={20} onClick={() => restar(prod.c_produ)} />
                                            <h2>{contadores[prod.c_produ] ?? 0}</h2>
                                            <img style={{ cursor: "pointer" }} src={"images/mas.png"} alt="mas" height={20} onClick={() => sumar(prod.c_produ)} />
                                        </footer>
                                        <button  className="botonAnadir" onClick={() => anadirCarro(prod.c_produ, contadores[prod.c_produ], prod.precio)}>AÑADIR</button>
                                    </>
                                )
                            }
                        </div>
                    </article>
                </>
            ) : prod.estado === "S" ? (
                <h4 style={{ color: "#94388c" }}>SIN STOCK</h4>
            ) : (
                <h4 style={{ color: "#f32735" }}>NO DISPONIBLE</h4>
            )}
        </section>
    )
}