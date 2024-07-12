import React, {useState, useEffect, useContext} from "react"
import { Radio, Alert } from "@mui/material"
import Axios from "axios";
import PaymentIcon from '@mui/icons-material/Payment';
import EuroIcon from '@mui/icons-material/Euro';
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext.js";

export const Pago = () => {
    const [datosCliente, setDatosCliente] = useState([])
    const [mensajeAlert, setMensajeAlert] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState("")
    const [formaPago, setFormaPago] = useState("T")
    const [reembolso, setReembolso] = useState(false)
    const { setPedidoPendiente } = useContext(AuthContext);
    const navigate = useNavigate()

    const actualizaFormaPago = (event) => {
        setFormaPago(event.target.value)
    }

    Axios.defaults.withCredentials = true;
    const getDatosCliente = () =>{
        Axios.get("http://localhost:3001/getdatoscliente")
        .then((response) => {
            if (!response.data.auth) {
                navigate("/perfil")
            }
            
            setDatosCliente(response.data)
        })
        .catch((err) =>{
            console.log(err)
            console.log("Algo ha ido mal")
        })
        
    }

    const pagarPedidoContrareembolso = () => {
        Axios.put("http://localhost:3001/actualizapedidocontrareembolso") 
        .then((response)=>{
            if (response.data.auth) {
                if(response.data.success) {
                    setPedidoPendiente(false)
                }else{
                    setMensajeAlert(response.data.message);
                    setTipoMensaje("error")
                }
            } else {
                navigate("/perfil")
            }

        })
    }

    const pagarPedido = (formaPago) =>{
        if (formaPago === "T") {
            navigate("/tarjeta")
        } else {
            setReembolso(true)
            setPedidoPendiente(false)
            pagarPedidoContrareembolso()
        }
    }

    useEffect(() => {
        getDatosCliente()
    },[])

    useEffect(() => {
        getDatosCliente()
    },[reembolso])

    return(
        <div className="body">
            <div className="contenedorFormulario">
                {
                    mensajeAlert && (
                        <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                    )      
                }
                
                {
                    reembolso  ? (
                        <section className="tarjetaFormulario">
                            <h1>GRACIAS POR TU COMPRA</h1>
                            <img src="images/logo_delfin.png" className="logoPago" alt="logo" />
                            <p style={{fontSize:15, marginBottom:30, cursor:"pointer"}} onClick={()=>{navigate("/mispedidos")}}><b>Pincha aquí </b>para ver la factura</p>
                            <button className = "boton" onClick = {() => navigate("/")}>Volver a la Web</button>
                        </section>
                    ) : (
                        <>
                        <section className="tarjetaFormulario">
                            <h1 style={{textAlign:"center"}}>SELECCIONE UN MÉTODO DE PAGO</h1>
                            {
                                datosCliente.length > 0 && (
                                    datosCliente.map((dat,index) => {
                                        return(
                                            <div style={{display:"flex", alignItems:"center"}}>
                                                <div>
                                                    <h4>{dat.d_cliente}</h4>
                                                    <p>{dat.direccion}, {dat.poblacion} ({dat.codigo_postal}) {dat.provincia}</p>
                                                </div>
                                            </div>
                                        )

                                    })
                                ) 
                            }
                            
                            <section className="sectionRadio">
                                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                    <Radio
                                        checked={formaPago==="T"} //tarjeta
                                        onChange={actualizaFormaPago}
                                        value="T"
                                        name="radio-buttons"
                                    />
                                    <PaymentIcon/>
                                    <h4>Pago con tarjeta bancaria</h4>
                                </div>

                                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                    <Radio
                                        checked={formaPago==="R"} //contrareembolso
                                        onChange={actualizaFormaPago}
                                        value="R"
                                        name="radio-buttons"
                                    />
                                    <EuroIcon/>
                                    <h4>Pago a contrareembolso</h4>
                                </div>

                            </section>
                            <button className = "boton" onClick={() => pagarPedido(formaPago)}>Siguiente</button>
                        </section>
                        </>
                    )
                }
                
            </div>
        </div>
    )
}