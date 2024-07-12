import React, {useState, useEffect} from "react"
import { Alert, Radio } from "@mui/material"
import Axios from "axios";
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import { useNavigate } from "react-router-dom"

export const FormaEnvio = () => {
    const [datosCliente, setDatosCliente] = useState([])
    const [formaEnvio, setFormaEnvio] = useState("N")
    const [mensajeAlert, setMensajeAlert] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState("")
    const navigate = useNavigate()

    const actualizaFormaEnvio = (event) => {
        setFormaEnvio(event.target.value)
    }

    const abrirMisDatos = () =>{
        navigate("/misdatos")
    }

    Axios.defaults.withCredentials = true;
    const getDatosCliente = () =>{
        Axios.get("http://localhost:3001/getdatoscliente")
        .then((response) => {
            if (!response.data.auth) navigate("/perfil")
            if (response.data.success) {
                setDatosCliente(response.data.result)
            }else{
                setMensajeAlert(response.data.message);
                setTipoMensaje("error")
            }
        })
        .catch(() =>{
            console.log("Algo ha ido mal")
        })
        
    }

    useEffect(() => {
        getDatosCliente()
    },[])

    return(
        <div className="body">
            <div className="contenedorFormulario">
                {
                    mensajeAlert && (
                        <Alert className='mensajeAlert' severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                    )              
                }
                <section className="tarjetaFormulario">
                    <h1>FORMA DE ENVIO</h1>

                    {
                        datosCliente.length > 0 && (
                            datosCliente.map((dat,index) => {
                                return(
                                    <>
                                        <div className="direccionPago">
                                            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                                                <h3>Mi dirección</h3>
                                                <img className="editarDireccion" src={"images/editar.png"} onClick = {() =>abrirMisDatos()} alt = 'Editar' />
                                            </div>
                                            <div>
                                                <h4 style={{margin:0}}>{dat.d_cliente}</h4>
                                                <p style={{marginTop:4}}>{dat.direccion}, {dat.poblacion} ({dat.codigo_postal}) {dat.provincia}</p>
                                            </div>
                                        </div>
                                    </>
                                )

                            })
                        )
                    }
                    
                    <section className="sectionRadio">
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <Radio
                                checked={formaEnvio==="N"} //normal
                                onChange={actualizaFormaEnvio}
                                value="N"
                                name="radio-buttons"
                            />
                            <HomeWorkRoundedIcon/>
                            <h4 style={{width:190}}>Entrega a domicilio</h4>
                            <p>(Gratis)</p>

                        </div>
                        <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                            <Radio
                                checked={formaEnvio==="E"} //express
                                onChange={actualizaFormaEnvio}
                                value="E"
                                name="radio-buttons"
                            />
                            <FlashOnRoundedIcon/>
                            <h4 style={{width:190}}>Entrega express a domicilio</h4>
                            <p> (Gratis) </p>
                        </div>

                    </section>
                    <button className = "boton" onClick={() => navigate("/pago")}>Siguiente</button>
                </section>
            </div>
        </div>
    )
}