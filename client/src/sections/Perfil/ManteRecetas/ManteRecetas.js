import React, { useState, useEffect } from 'react'
import "../../../css/style.css"
import { Alert } from '@mui/material';
import  Axios  from "axios"
import useAuthCheck from '../../hooks/useAuth.js';
import { ModalRecetas } from './ModalRecetas';
import { ModalIngredientes } from './ModalIngredientes';

export const ManteRecetas = () => {
    const [recetas, setRecetas] = useState([])
    const [mensajeAlert, setMensajeAlert] = useState("")
    const [tipoMensaje, setTipoMensaje] = useState("")
    const [abrir, setAbrir] = useState(false)
    const [tipo, setTipo] = useState()
    const [recetaSeleccionada, setRecetaSeleccionada] = useState()
    const { autenticacion, checked } = useAuthCheck();

    const top = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }

    const abrirModal = (tipo, recetas = null) => {
        setTipo(tipo)
        setRecetaSeleccionada(recetas)
        setAbrir(true)
    }

    const getRecetas = () => {
        Axios.get("http://localhost:3001/getRecetas")
        .then((response) => {
            if (response.data.length > 0){
                setRecetas(response.data)
            }
        }).catch(() =>{
            setMensajeAlert("No se han recuperado recetas")
            setTipoMensaje("error");
        })
    }

    useEffect(()=>{
        if (autenticacion && checked) {
            getRecetas()
        }
     },[autenticacion, checked])

     useEffect(()=>{
        if (autenticacion && checked) {
            getRecetas()
        }
     },[autenticacion, checked, abrir])

    return (        
        <div className="body">
            <h1>Mantenimiento Recetas</h1>
            <img style={{width:100, cursor: "pointer", paddingBottom:2}} src={"images/insertar.png"}  onClick = {() =>abrirModal("nuevo")} alt = 'Nuevo' />

            <div className="contenedor">  
            
            {
                recetas.length > 0 ? (

                    <table className="tabla">
                        <thead>
                            <tr>
                                <th className="tabla-th">Código</th>
                                <th className="tabla-th">Nombre</th>
                                <th className="tabla-th">Elaboración</th>
                                <th className="tabla-th">Raciones</th>
                                <th className="tabla-th">Dificultad</th>
                                <th className="tabla-th">Tiempo</th>
                                <th className="tabla-th">URL imagen</th>
                                <th className="tabla-th">Estado</th>
                            </tr>
                        </thead>
                            
                            {
                                recetas.map((rec,index)=>{
                                    return(
                                        <tbody>
                                            <tr key={rec.c_receta} className = {index%2 ? "" : "trColor"}>
                                                <td className="tabla-borde-izq" style={{textAlign:"center", paddingRight:"7px"}}>{rec.c_receta}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{rec.d_receta}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{rec.desc_receta}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{rec.personas}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{rec.dificultad}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{rec.minutos_elab}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{rec.url_foto}</td>
                                                <td className="tabla-td" style={{textAlign:"center"}}>{rec.estado === "A" ? "Alta" : "Baja"}</td>
                                                <td className="tabla-td">                                                    
                                                    <img style={{width:30, cursor: "pointer", paddingBottom:2}} src={"images/editar.png"} onClick = {() =>abrirModal("editar", rec)} alt = 'Editar' />
                                                </td>
                                                <td className="tabla-td">                                                    
                                                    <img style={{width:30, cursor: "pointer", paddingBottom:2}} src={"images/ingredientes.png"} onClick={()=>abrirModal("ingredientes",rec)} alt = 'Ingredientes' />
                                                </td>
                                                <td className="tabla-borde-der">                                                    
                                                    <img style={{width:30, cursor: "pointer", paddingBottom:2}} src={"images/eliminar.png"} onClick = {() =>abrirModal("eliminar", rec)} alt = 'Eliminar' />
                                                </td>
                                            </tr>
                                        </tbody>          
                                    )
                                })
                                
                            }
                        </table>
                    ) : (
                            mensajeAlert &&(
                                <Alert className="mensajeAlert" severity={tipoMensaje} onClose={()=>{setMensajeAlert(null)}}>{mensajeAlert}</Alert>
                            )
                    )
                }

                {
                    (tipo === "ingredientes") ? (
                        <ModalIngredientes
                            open={abrir}
                            onClose={() => setAbrir(false)}
                            recetas={recetaSeleccionada}
                        />
                    ) : (
                        <ModalRecetas
                            open={abrir}
                            onClose={() => setAbrir(false)}
                            tipo={tipo}
                            recetas={recetaSeleccionada}
                        />
                    )
                }
            </div>
            <img className='btnToTop' src={"images/flecha-arriba.png"} alt="top" onClick={() =>{top()}}/>
        </div>
    )
 }