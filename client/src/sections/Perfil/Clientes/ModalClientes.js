import React, {useState, useEffect} from 'react'
import {Modal, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem} from '@mui/material'
import Axios from "axios"

import provinciasJson from "../../provincias.json"
import poblacionesJson from "../../poblaciones.json"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '80vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 5,
    p: 4
};

export const ModalClientes = (props) =>{
    const {open, onClose, tipo, cliente} = props

    const datosIniciales = {
        c_cliente:"",
        d_cliente:"",
        email:"",
        clave:"",
        provincia:"",
        poblacion:"",
        codigo_postal:0,
        direccion:"",
        telefono:0,
        administrador:""
    }

    const [datosCliente, setDatosCliente] = useState(datosIniciales)
    const [poblacionesFiltradas, setPoblacionesFiltradas] = useState([])

    useEffect(() => {
        if (tipo === "editar" || tipo === "eliminar") {
            setDatosCliente(cliente);
            if (cliente.provincia) {
                const c_provincia = provinciasOrdenadas.find((prov) => prov.label === cliente.provincia);
                if (c_provincia) {
                    const poblacionesFiltradas = poblaciones.filter((pob) => pob.parent_code === c_provincia.code);
                    setPoblacionesFiltradas(poblacionesFiltradas);
                }
            }
        } else {
            setDatosCliente(datosIniciales);
            setPoblacionesFiltradas([]);
        }

    },[tipo, cliente])

    const cambioDatos = (e) => {
        const {name, value} = e.target;
        console.log(name)
        console.log(value)
        setDatosCliente(prev => ({
            ...prev,
            [name]:value
        }))
    }

    const cambioProvincia = (e) => {
        const {name, value} = e.target;
        setDatosCliente(prev => {
            const nuevaProvincia = { ...prev, [name]: value };
            const c_provincia = provinciasOrdenadas.filter((prov) => prov.label === value);
            const poblacionesFiltradas = poblaciones.filter((pob) => pob.parent_code === c_provincia[0].code);
            setPoblacionesFiltradas(poblacionesFiltradas);
            return nuevaProvincia;
        })
    }

    Axios.defaults.withCredentials = true;
    const eliminarCliente = () => {
        Axios.put("http://localhost:3001/eliminacliente", {
            datosCliente
        })
        .then((response) => {
            if (response.data.success){
                onClose()
            } else {
                alert("Error al eliminar el cliente")
            }
        })
    }

    const guardarCliente = () => {
        if(tipo === "nuevo"){
            Axios.post("http://localhost:3001/nuevocliente",{ 
                datosCliente
            })
            .then((response) => {
                if(!response.data.success){
                    alert("Problemas para crear el cliente")
                }
            })
            
        } else if (tipo === "editar"){
            Axios.put("http://localhost:3001/actualizacliente2",{
                datosCliente
            })
            
            .then((response) => {
                if(!response.data.success){
                    alert("Problemas para actualizar el cliente")
                }
            })
        }
        onClose()
    }

     //RELLENO EL ARRAY PARA EVITAR ERRORES EN EL MAP Y LO ORDENO ALFABETICAMENTE
     const provincias = provinciasJson && Array.isArray(provinciasJson.provincias) ? provinciasJson.provincias : [];
     const provinciasOrdenadas = [...provincias].sort((a, b) => a.label.localeCompare(b.label));
 
     const poblaciones = poblacionesJson && Array.isArray(poblacionesJson.poblaciones) ? poblacionesJson.poblaciones : [];

    return (
        
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableScrollLock={true}
        >   
            {
                tipo === "eliminar" ? (
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Eliminar Cliente
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt:2}}>
                            ¿Estas seguro de que deseas eliminar este cliente?
                        </Typography>

                        <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/aceptar.png"}  onClick={eliminarCliente} alt = 'Aceptar' />
                        <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/cancelar.png"}  onClick={onClose} alt = 'Cancelar' />
                    </Box>
                ) : (
                    
                    <Box sx={style}  className="custom-scrollbar">
                        <Typography id="modal-modal-tittle" variant="h6" component="h2">
                            {tipo === "nuevo" ? "Nuevo Cliente" : "Editar Cliente"}
                        </Typography>

                        <Box component="form" sx={{mt:2}}>
                            <TextField label="Cliente" name="d_cliente" type="text" value={datosCliente.d_cliente} onChange={cambioDatos} fullWidth margin="normal"/>

                            <TextField label="Email" name="email" type="email" value={datosCliente.email} onChange={cambioDatos} fullWidth magin="normal"/> 

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Provincia</InputLabel>
                                <Select
                                    label="Provincia"
                                    name="provincia"
                                    value={datosCliente.provincia}
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
                                    value={datosCliente.poblacion}
                                    onChange={cambioDatos}
                                >
                                    {
                                        poblacionesFiltradas.map((pob, index) => (
                                            <MenuItem key={index} value={pob.label}>{pob.label}</MenuItem>
                                        ))

                                    }
                                </Select>
                            </FormControl>

                            <TextField label="Código Postal" name="codigo_postal" type="number" value={datosCliente.codigo_postal} onChange={cambioDatos} fullWidth margin="normal"/>

                            <TextField label="Direccion" name="direccion" type="text" value={datosCliente.direccion} onChange={cambioDatos} fullWidth margin="normal"/>

                            <TextField label="Telefono" name="telefono" type="number" value={datosCliente.telefono} onChange={cambioDatos} fullWidth margin="normal"/>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Administrador</InputLabel>
                                <Select
                                    label="Administrador"
                                    name="administrador"
                                    value={datosCliente.administrador}
                                    onChange={cambioDatos}
                                >
                                    <MenuItem value="S">Si</MenuItem>
                                    <MenuItem value="N">No</MenuItem>
                                </Select>
                            </FormControl>

                            <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/guardar.png"} onClick={guardarCliente} alt ="Guardar"/>
                            <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/cancelar.png"}  onClick={onClose} alt = 'Cancelar' />
                        </Box>
                    </Box>
                )
            }

        </Modal>
    )
}