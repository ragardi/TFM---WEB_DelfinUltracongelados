import React, { useState } from 'react'
import "../../css/style.css"
import  Axios  from "axios"
import { useNavigate } from "react-router-dom"
import { TextField, Alert } from '@mui/material';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export const OlvidaClave = () => {
    const [email, setEmail] = useState()
    const [clave, setClave] = useState()
    const [clave2, setClave2] = useState()
    const [verClave, setVerClave] = useState(false)
    const [mensajeAlert, setMensajeAlert] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState("")
    const navigate = useNavigate()

    Axios.defaults.withCredentials = true;
    const olvidaClave = () => {
        Axios.put("http://localhost:3001/olvidaClave", {
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
                    mensajeAlert ? (
                        <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>

                    ) : null                   
                }
            
                <section className="tarjetaFormulario">
                    <h2>Reestablecer contraseña</h2>
                    <TextField sx={{m:2, width:"20em"}} id="email" label="Email" type='email' variant="outlined" onChange={(event) => setEmail(event.target.value)}/>
                    <TextField sx={{m:2, width:"20em"}} id="clave" label="Clave" type={verClave ? 'text' : 'password'} 
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
                    <TextField sx={{m:2, width:"20em"}} id="clave2" label="Repetir Clave" type='password' onChange={(event) => setClave2(event.target.value)}/>
                    <button className = "boton" onClick={olvidaClave}>Guardar</button>

                </section>
            </div>

        </div>
    )
 }