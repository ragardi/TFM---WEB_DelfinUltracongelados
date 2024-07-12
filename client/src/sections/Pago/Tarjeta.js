import React, {useState, useContext} from "react";
import { TextField, Alert  } from "@mui/material";
import  Axios  from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../Context/AuthContext.js";

export const Tarjeta = () => {
    const [tarjeta, setTarjeta] = useState()
    const [fecha, setFecha] = useState()
    const [cvv, setCvv] = useState()
    const [mensajeAlert, setMensajeAlert] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState("")
    const [pedidoPagado, setPedidoPagado] = useState(false)
    const navigate = useNavigate()
    const { setPedidoPendiente } = useContext(AuthContext);

    // PENSAR SI GUARDAR DATOS TARJETA
    Axios.defaults.withCredentials = true;
    const pagarPedido = () => {
        Axios.put("http://localhost:3001/actualizaestadopedido", {
            tarjeta, fecha, cvv
        }) 
        .then((response)=>{
            if (response.data.auth) {
                if(response.data.success) {
                    setPedidoPendiente(false)
                    setPedidoPagado(true)
                }else{
                    setMensajeAlert(response.data.message);
                    setTipoMensaje("error")
                }
            } else {
                navigate("/perfil")
            }

        })
    }

    return(
        <div className="body">
            <div className="contenedorFormulario">
                {
                    mensajeAlert && (
                        <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                    )      
                }
                
                {
                    pedidoPagado ? (
                        <section className="tarjetaFormulario">
                            <h1>GRACIAS POR TU COMPRA</h1>
                            <img src="images/logo_delfin.png" className="logoPago" alt="logo" />
                            <p style={{fontSize:15, marginBottom:30, cursor:"pointer"}} onClick={()=>{navigate("/mispedidos")}}><b>Pincha aquí </b>para ver la factura</p>
                            <button className = "boton" onClick = {() => navigate("/")}>Volver a la Web</button>
                        </section>
                    ) : (
                        <section className="tarjetaFormulario">
                            <h1>DATOS BANCARIOS</h1>
                            <TextField sx={{m:2, width:"20em"}}id="tarjeta" label="Número Tarjeta" type='number' variant="outlined" onChange={(event) => setTarjeta(event.target.value)}/>
                            <TextField sx={{m:2, width:"20em"}} id="fecha" label="MM/AA" type='text' variant="outlined" onChange={(event) => setFecha(event.target.value)}/>
                            <TextField sx={{m:2, width:"20em"}} id="cvv" label="CVV" type='number' variant="outlined" onChange={(event) => setCvv(event.target.value)}/>

                            <button className = "boton" onClick = {() => pagarPedido(tarjeta, fecha, cvv)}>Pagar</button>
                        </section>
                    )
                }
            </div>
        </div>
    )
}