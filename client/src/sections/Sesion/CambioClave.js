import React, { useState } from 'react'
import "../../css/style.css"
import  Axios  from "axios"
import { useNavigate } from "react-router-dom"
import { TextField, Alert } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export const CambioClave = () => {
    const [email, setEmail] = useState()
    const [clave, setClave] = useState()
    const [clave2, setClave2] = useState()
    const [verClave, setVerClave] = useState(false)
    const [mensajeAlert, setMensajeAlert] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState("")
    const navigate = useNavigate()

    Axios.defaults.withCredentials = true;
    const cambioClave = () => {
        Axios.put("http://localhost:3001/cambioClave", {
            email, clave, clave2
        })
        .then((response)=>{
            if(response.data.success) {
                navigate("/sesion")
            }else{
                setMensajeAlert(response.data.message);
                setTipoMensaje("error")
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
            
                <section className="tarjetaFormulario" style={{ maxWidth: 500,  boxShadow: "0px 0px 20px #9E9E9E", border: 1, borderRadius: 20}}>
                    <h2>Reestablecer contraseña</h2>
                    <TextField id="email" label="Email" type='email' variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
                    <TextField id="clave" label="Contraseña" type={verClave ? 'text' : 'password'} 
                        onChange={(event) => setClave(event.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                onClick={()=>{setVerClave(true)}}
                                onMouseDown={()=>{setVerClave(false)}}
                                edge="end"
                                >
                                {verClave ? <VisibilityOff /> : <Visibility />} {/*para mostrar u ocultar la clave*/}
                                </IconButton>
                            </InputAdornment>
                            )
                        }}
                    />
                    <TextField id="clave2" label="Repetir Clave" type='password' onChange={(event) => setClave2(event.target.value)}/>
                    <button className = "boton" onClick={cambioClave}>Guardar</button>

                </section>
            </div>

        </div>
    )
 }