import React, {useState, useEffect} from "react"
import Axios from "axios";
import { TextField, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom"
import provinciasJson from "../../provincias.json"
import poblacionesJson from "../../poblaciones.json"

export const MisDatos = () => {
    const [cliente, setCliente] = useState()
    const [nombre, setNombre] = useState()
    const [email, setEmail] = useState()
    const [provincia, setProvincia] = useState()
    const [poblacion, setPoblacion] = useState()
    const [codpos, setCodpos] = useState()
    const [direccion, setDireccion] = useState()
    const [telefono, setTelefono] = useState()
    const [mensajeAlert, setMensajeAlert] = useState(null)
    const [tipoMensaje, setTipoMensaje] = useState("error")
    const navigate = useNavigate()
    
    const [poblacionesFiltradas, setPoblacionesFiltradas] = useState([])
    const provincias = provinciasJson && Array.isArray(provinciasJson.provincias) ? provinciasJson.provincias : [];
    const provinciasOrdenadas = [...provincias].sort((a, b) => a.label.localeCompare(b.label));

    const poblaciones = poblacionesJson && Array.isArray(poblacionesJson.poblaciones) ? poblacionesJson.poblaciones : [];

    Axios.defaults.withCredentials = true; 
    const getCliente =()=>{
        Axios.get("http://localhost:3001/getcliente")
        .then((response)=>{
            if (response.data.success) {
                setCliente(response.data.result[0].c_cliente)
                setNombre(response.data.result[0].d_cliente)
                setEmail(response.data.result[0].email)
                setProvincia(response.data.result[0].provincia)
                setPoblacion(response.data.result[0].poblacion)
                setCodpos(response.data.result[0].codigo_postal)
                setDireccion(response.data.result[0].direccion)
                setTelefono(response.data.result[0].telefono)
    
                if (response.data.result[0].provincia) {
                    const c_provincia = provinciasOrdenadas.find((prov) => prov.label === response.data.result[0].provincia);
                    if (c_provincia) {
                        const poblacionesFiltradas = poblaciones.filter((pob) => pob.parent_code === c_provincia.code);
                        setPoblacionesFiltradas(poblacionesFiltradas);
                    }
                }
            } else {
                if(!response.data.auth) {
                    console.log("Tenosmo que navegar")
                    navigate("/perfil")}
            }
        })
    }

    const cambioProvincia = (e) => {
        const {value} = e.target;
        setProvincia(value)
        const c_provincia = provinciasOrdenadas.filter((prov) => prov.label === value);
        const poblacionesFiltradas = poblaciones.filter((pob) => pob.parent_code === c_provincia[0].code);
        setPoblacionesFiltradas(poblacionesFiltradas); 
    }

    const updateCliente=()=>{
        Axios.put("http://localhost:3001/actualizacliente", {
            cliente, nombre, email, provincia, poblacion, codpos, direccion,telefono
        })
        .then((response)=>{
            if(response.data.success){                
                setTipoMensaje("success")
            }
            setMensajeAlert(response.data.message)
        })
    }

    //se ejecuta cada vez que hay cambios
    useEffect(()=>{
        getCliente()
    },[])

    return(
        <div className='body'> 
            <div className="contenedorFormulario">
            {
                mensajeAlert && (
                    <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                )              
            }

            {
                cliente ? (
                    <section className="tarjetaFormulario">                      
                        <h2>Mis Datos</h2>
                        <TextField sx={{m:2, width:"20em"}} id="nombre" label="Nombre" type='text' variant="outlined" defaultValue={nombre} onChange={(event) => {setNombre(event.target.value)}}/>
                        
                        <TextField sx={{m:2, width:"20em"}} id="email" label="Email" type='email' variant="outlined" defaultValue={email} onChange={(event) => {setEmail(event.target.value)}}/>
                        
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Provincia</InputLabel>
                            <Select
                                label="Provincia"
                                name="provincia"
                                value={provincia}
                                onChange={(e)=>{cambioProvincia(e)}}
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
                                name="poblacion"
                                value={poblacion}
                                onChange={(event) => {setPoblacion(event.target.value)}}
                            >
                                {
                                    poblacionesFiltradas.map((pob, index) => (
                                        <MenuItem key={index} value={pob.label}>{pob.label}</MenuItem>
                                    ))

                                }
                            </Select>
                        </FormControl>

                        <TextField sx={{m:2, width:"20em"}} id="codpos" label="Código postal" type='number' variant="outlined" defaultValue={codpos}onChange={(event) => {setCodpos(event.target.value)}}/>
                        
                        <TextField sx={{m:2, width:"20em"}} id="direccion" label="Dirección" type='tex' variant="outlined" defaultValue={direccion} onChange={(event) => {setDireccion(event.target.value)}}/>
                        
                        <TextField sx={{m:2, width:"20em"}} id="telefono" label="Teléfono" type='number' variant="outlined" defaultValue={telefono} onChange={(event) => {setTelefono(event.target.value)}}/>

                        <button className = "boton" onClick={updateCliente}>Guardar</button>
                    </section>
                        
                    
                ) : (
                    <Alert className="mensajeAlert" severity="error">Error al recuperar los datos del cliente</Alert>
                )
            }
            </div>
        </div>
    )
}