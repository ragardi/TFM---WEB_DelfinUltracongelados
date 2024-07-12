import React, { useState } from 'react'
import "../../css/style.css"
import { useNavigate } from "react-router-dom"
import Axios from "axios";
import { TextField, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import provinciasJson from "../provincias.json"
import poblacionesJson from "../poblaciones.json"

export const Registro = () => {
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [clave, setClave] = useState("")
    const [provincia, setProvincia] = useState(" ")
    const [poblacion, setPoblacion] = useState(" ")
    const [poblacionesFiltradas, setPoblacionesFiltradas] = useState([])
    const [codpos, setCodpos] = useState(0)
    const [direccion, setDireccion] = useState("")
    const [telefono, setTelefono] = useState(0)
    const [mensajeAlert, setMensajeAlert] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState("")
    const navigate = useNavigate()

    Axios.defaults.withCredentials = true;
    const newCliente = () => {
        Axios.post("http://localhost:3001/registro",{
            nombre,
            email,
            clave,
            provincia,
            poblacion,
            codpos,
            direccion,
            telefono
        })
        .then((response)=>{
            console.log(response)
            if (response.data.success){
                navigate("/sesion")
                
            }else{
                setTipoMensaje("error")
                setMensajeAlert(response.data.message);
            }
        })
        .catch((error) => {
            setTipoMensaje("error")
            alert("Error al registrar cliente");
        });
    }

    //RELLENO EL ARRAY PARA EVITAR ERRORES EN EL MAP Y LO ORDENO ALFABETICAMENTE
    const provincias = provinciasJson && Array.isArray(provinciasJson.provincias) ? provinciasJson.provincias : [];
    const provinciasOrdenadas = [...provincias].sort((a, b) => a.label.localeCompare(b.label));

    const poblaciones = poblacionesJson && Array.isArray(poblacionesJson.poblaciones) ? poblacionesJson.poblaciones : [];
    
    const guardarProvincia = (d_provincia) => {
        setProvincia(d_provincia);
        const c_provincia = provinciasOrdenadas.filter((prov) => prov.label === d_provincia);
        const poblacionesFiltradas = poblaciones.filter((pob) => pob.parent_code === c_provincia[0].code);
        setPoblacionesFiltradas(poblacionesFiltradas);
    };

    return (
        <div className='body'>
            <div className="contenedorFormulario">
                {
                    mensajeAlert && (
                        <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                    )               
                }

                <section className="tarjetaFormulario">                      
                    <h2>Nueva Cuenta</h2>
                    <TextField sx={{m:2, width:"20em"}} id="nombre" label="Nombre" type='text' variant="outlined" onChange={(event) => {setNombre(event.target.value)}}/>
                    <TextField sx={{m:2, width:"20em"}} id="email" label="Email" type='email' variant="outlined" onChange={(event) => {setEmail(event.target.value)}}/>
                    <TextField sx={{m:2, width:"20em"}} id="clave" label="Contraseña" type='text' variant="outlined" onChange={(event) => {setClave(event.target.value)}}/>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Provincia</InputLabel>
                        <Select
                            label="Provincia"
                            name="provincia"
                            onChange={(event) => guardarProvincia(event.target.value)}
                        >
                            {
                                provinciasOrdenadas.map((prov, index) => (
                                    <MenuItem key={index} value={prov.label}>{prov.label}</MenuItem>
                                ))

                            }
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Población</InputLabel>
                        <Select
                            label="Población"
                            name="población"
                            onChange={(event) => setPoblacion(event.target.value)}
                        >
                            {
                                poblacionesFiltradas.map((pob, index) => (
                                    <MenuItem key={index} value={pob.label}>{pob.label}</MenuItem>
                                ))

                            }
                        </Select>
                    </FormControl>

                    <TextField sx={{m:2, width:"20em"}} id="codpos" label="Código postal" type='number' variant="outlined" onChange={(event) => {setCodpos(event.target.value)}}/>
                    <TextField sx={{m:2, width:"20em"}} id="direccion" label="Dirección" type='tex' variant="outlined" onChange={(event) => {setDireccion(event.target.value)}}/>
                    <TextField sx={{m:2, width:"20em"}} id="telefono" label="Teléfono" type='number' variant="outlined" onChange={(event) => {setTelefono(event.target.value)}}/>

                    <button className = "boton" onClick={newCliente}>Crear Cuenta</button>
                </section>
            </div>
        </div>
    )
}