import React, { useState, useEffect } from 'react'
import "../../../css/style.css"
import { Alert } from '@mui/material';
import  Axios  from "axios"
import {format} from 'date-fns'
import { ModalClientes } from './ModalClientes';
import useAuthCheck from '../../hooks/useAuth.js';

export const Clientes = () => {
    const [clientes, setClientes] = useState([])
    const [mensajeAlert, setMensajeAlert] = useState("")
    const [tipoMensaje, setTipoMensaje] = useState("")
    const [abrir, setAbrir] = useState(false)
    const [tipoModal, setTipoModal] = useState()
    const [clienteSeleccionado, setClienteSeleccionado] = useState()
    const { autenticacion, checked } = useAuthCheck();

    const top = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }

    const abrirModal = (tipo, cliente = null) => {
        setTipoModal(tipo)
        setClienteSeleccionado(cliente)
        setAbrir(true)
    }

    const getClientes = () => {
        Axios.get("http://localhost:3001/clientes")
        .then((response)=>{
            if (response.data.length > 0){
                setClientes(response.data)
            } else {
                setMensajeAlert(response.data.message);
                setTipoMensaje(response.data.success);
            }
                
        }).catch(() => {
            setMensajeAlert("No se han recuperado clientes")
            setTipoMensaje("error");

        })        
    }

    useEffect(()=>{
        if (autenticacion && checked) {
            getClientes()
        }
     },[autenticacion, checked])

    useEffect(()=>{
        if (autenticacion && checked) {
            getClientes()
        }
     },[autenticacion, checked, abrir])

    return (        
        <div className="body">
            <h1>Clientes plataforma</h1>
            <img style={{width:100, cursor: "pointer", paddingBottom:2}} src={"images/insertar.png"} onClick = {() =>abrirModal("nuevo")} alt = 'Nuevo' />

            <div className="contenedor">  
            
            {
                clientes ? (

                    <table className="tabla">
                        <thead>
                            <tr>
                                <th className="tabla-th">Código</th>
                                <th className="tabla-th">Cliente</th>
                                <th className="tabla-th">Email</th>
                                <th className="tabla-th">Fecha alta</th>
                                <th className="tabla-th">Provincia</th>
                                <th className="tabla-th">Población</th>
                                <th className="tabla-th">Teléfono</th>
                                <th className="tabla-th">Administrador</th>
                            </tr>
                        </thead>
                            
                            {
                                clientes.map((cli,index)=>{
                                    return(
                                        <tbody>
                                            <tr key={cli.c_cliente} className = {index%2 ? "" : "trColor"}>
                                                <td className="tabla-borde-izq" style={{textAlign:"center", paddingRight:"7px"}}>{cli.c_cliente}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{cli.d_cliente}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{cli.email}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{format(cli.fecha_alta,"dd-MM-yyyy")}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{cli.provincia}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{cli.poblacion}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{cli.telefono}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{cli.administrador === "S" ? "Sí" : "No"}</td>
                                                <td className="tabla-td">                                                    
                                                    <img style={{width:30, cursor: "pointer", paddingBottom:2}} src={"images/editar.png"} onClick = {() =>abrirModal("editar", cli)} alt = 'Editar' />
                                                </td>
                                                <td className="tabla-borde-der">                                                    
                                                    <img style={{width:30, cursor: "pointer", paddingBottom:2}} src={"images/eliminar.png"} onClick = {() =>abrirModal("eliminar", cli)} alt = 'Eliminar' />
                                                </td>
                                            </tr>
                                        </tbody>          
                                    )
                                })
                                
                            }
                        </table>
                    ) : (
                        <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                    )
                }
                
                <ModalClientes
                    open={abrir}
                    onClose={() => setAbrir(false)}
                    tipo={tipoModal}
                    cliente={clienteSeleccionado}
                />
                   
            </div>
            <img className='btnToTop' src={"images/flecha-arriba.png"} alt="top" onClick={() =>{top()}}/>
        </div>
    )
 }
