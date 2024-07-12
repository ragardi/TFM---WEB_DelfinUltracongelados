import React, { useState, useEffect } from 'react';
import "../../../css/style.css";
import Axios from "axios";
import { Alert } from '@mui/material';
import { format } from 'date-fns';
import { PDF } from "./PDF.js";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useNavigate, Link } from "react-router-dom"
import useAuthCheck from '../../hooks/useAuth.js';

export const MisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [detallePedido, setDetallePedido] = useState([])
    const [mensajeAlert, setMensajeAlert] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("");
    const [abrirPDF, setAbrirPDF] = useState(false);
    const { autenticacion, checked } = useAuthCheck();
    const navigate = useNavigate()
    
    const top = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    Axios.defaults.withCredentials = true;
    const getMispedidos = () => {
        Axios.get("http://localhost:3001/mispedidos")
        .then((response) => {
            if (response.data.success) {
                setPedidos(response.data.result);
            } else {
                if (!response.data.auth) navigate("/perfil")
                
                setMensajeAlert(response.data.message);
                setTipoMensaje("error");
            }
        }).catch(() => {
            setMensajeAlert("No se han recuperado pedidos");
            setTipoMensaje("error");
        });
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

    const abrirPDFNuevo = async (pedido) => {
        await getProductos(pedido);
        setAbrirPDF(true);
    }

    useEffect(() => {
        if (autenticacion && checked){
            getMispedidos()
        }
    }, [autenticacion && checked]);

    return (
        <div className="body">
            <h1>Mis pedidos</h1>
            <div className="contenedor">
            {
                mensajeAlert && (
                    <Alert className="mensajeAlert" severity={tipoMensaje} onClose={() => { setMensajeAlert(null) }}>{mensajeAlert}</Alert>
                )
            }
            {
                pedidos && (
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th className="tabla-th">Código</th>
                                <th className="tabla-th">Fecha</th>
                                <th className="tabla-th">Estado</th>
                                <th className="tabla-th">Forma Pago</th>
                                <th className="tabla-th">Pedido</th>
                                <th className="tabla-th">PDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pedidos.map((ped, index) => (
                                    <tr key={ped.c_pedido} className={index % 2 ? "" : "trColor"}>
                                        <td className="tabla-borde-izq" style={{ textAlign: "center", paddingRight: "7px" }}>{ped.c_pedido}</td>
                                        <td className="tabla-td" style={{ textAlign: "center" }}>{format(ped.fecha, "dd-MM-yyyy")}</td>
                                        <td className="tabla-td" style={{ textAlign: "center" }}>{ped.estado === "F" ? "Finalizado" : "Pendiente"}</td>
                                        <td className="tabla-td" style={{ textAlign: "center" }}>{ped.formaPago === "T" ? "Tarjeta" : "Contrareembolso"}</td>
                                        <td className="tabla-td">
                                            <Link to= {`/detallepedido/${ped.c_pedido}`} className="link">
                                                <img style={{ width: 30, cursor: "pointer", paddingBottom: 2 }} src={"images/ver.png"} alt='Ver'/>
                                            </Link>

                                        </td>
                                        <td className="tabla-borde-der">
                                            <img style={{ width: 30, cursor: "pointer", paddingBottom: 2 }} src={"images/descargar.png"} alt='Descarga' onClick={() => abrirPDFNuevo(ped.c_pedido)} />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )
            }
            </div>
            {console.log(detallePedido)}
            {
                abrirPDF && (
                    <PDFDownloadLink
                        document={<PDF detallePedido={detallePedido}/>}
                        fileName="pedido.pdf"
                    >
                        {({ blob, url, loading }) => {
                            if (!loading && url) {
                                window.open(url, '_blank');
                                setAbrirPDF(false);
                            }
                        }}
                    </PDFDownloadLink>
                )
            }
            <img className='btnToTop' src={"images/flecha-arriba.png"} alt="top" onClick={() => { top() }} />
        </div>
    )
}
