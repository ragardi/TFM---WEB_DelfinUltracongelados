import React, { useState, useContext } from 'react'
import "../../css/style.css"
import  Axios  from "axios"
import { Link, useNavigate } from "react-router-dom"
import { TextField, Alert } from '@mui/material';



import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { AuthContext } from "../../Context/AuthContext.js";

export const Sesion = () => {
    const [email, setEmail] = useState()
    const [clave, setClave] = useState()
    const [verClave, setVerClave] = useState(false)
    const [mensajeAlert, setMensajeAlert] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState("")
    const navigate = useNavigate()
    const { setAutenticacion } = useContext(AuthContext);

    Axios.defaults.withCredentials = true; //Esto es necesario para enviar cookies con cada solicitud
    const loginCliente = () => {
        Axios.post("http://localhost:3001/login", {
            email, clave
        })
        .then((response)=>{
            if(!response.data.success) {
                setMensajeAlert(response.data.message);
                setTipoMensaje("error")
                
            }else{
                setAutenticacion(true)
                navigate("/perfil")
            }
        })
    }


    return (        
        <div className="body">
            <div className="contenedorFormulario">
                {
                    mensajeAlert && (
                        <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                    )                
                }
                        
                <section className="tarjetaFormulario">
                    <h2>Ya Soy Cliente</h2>
                    <div>                        
                        <TextField sx={{m:2, width:"20em"}} id="email" label="Email" type='email' variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
                        <TextField sx={{m:2, width:"20em"}} id="clave" label="Contraseña" type={verClave ? 'text' : 'password'} 
                            onChange={(event) => setClave(event.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                    onClick={()=>{setVerClave(true)}}
                                    onMouseDown={()=>{setVerClave(false)}}
                                    edge="end"
                                  >
                                    {verClave ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                                )
                            }}
                        />
                        
                    </div>
                    
                    <button className = "boton" onClick={loginCliente}>Iniciar Sesión</button>

                    <Link to= {"/olvidaClave"} className="link">
                        <p style={{fontSize:12}}>¿Has olvidado tu contraseña? <b>Pincha aquí</b></p>
                    </Link>
                    
                    <h2>Nuevo Cliente</h2>
                    <p>Tu cuenta cliente registra el contenido de tu cesta y te permite consultar tus favoritas y el historial de tus pedidos. </p>
                    
                    <Link to= {"/registro"} className="link">
                        <button className = "boton" >Registrarse</button>
                    </Link>

                </section>
            </div>

        </div>
    )
 }