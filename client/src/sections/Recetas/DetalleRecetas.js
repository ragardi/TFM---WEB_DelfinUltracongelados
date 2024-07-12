import { useParams } from "react-router-dom"
import React, { useEffect, useState } from 'react';
import Axios from "axios";

import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded'; //PERSONAS
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'; //TIEMPO
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'; //BARRAS
import ArrowRightIcon from '@mui/icons-material/ArrowRight'; //INGREDIENTES

export const DetalleRecetas = () => {
    const {c_receta} = useParams() //mismo nombre que en la ruta
    const [detReceta, setDetreceta] = useState([])
    const [ingredientes, setIngredientes] = useState([])

    Axios.defaults.withCredentials = true;
    const getRecetas = (c_receta) => {
        Axios.get(`http://localhost:3001/mostrarreceta/${c_receta}`).then((response) => {
            setDetreceta(response.data)
        })
    }

    const getIngredientes = (c_receta) => {
        Axios.get(`http://localhost:3001/getIngredientes/${c_receta}`)
        .then((response) => {
            setIngredientes(response.data)
        })
    }

    useEffect(() => {
        getRecetas(c_receta);
        getIngredientes(c_receta)
    }, [c_receta]); 
    
    return(
        <div className="body">
            <div className="contenedorProRec">
                {
                    detReceta.map((rec,index)=>{
                        return(
                            <div>
                                <div key={index} className="imgDesDetProRec" >

                                    <section>
                                        <header>     
                                            <img src={`/images/${rec.url_foto}`} 
                                                alt={rec.d_receta}
                                                className='imgProRecDet'
                                            />

                                            <h2>{rec.d_receta}</h2>
                                            <div style={{display:"flex", fontSize:20, margin:10, justifyContent:"center"}}>
                                                <div style={{display:"flex", alignItems:"center", height:30, padding:10}}>
                                                    <EmojiPeopleRoundedIcon/>
                                                    <h4> {rec.personas}</h4> 
                                                </div>
                                                <div style={{display:"flex", alignItems:"center", height:30, padding:10}}>
                                                    <AccessTimeRoundedIcon/>                                   
                                                    <h4> {`${rec.minutos_elab} min`} </h4> 
                                                </div>
                                                <div style={{display:"flex", alignItems:"center", height:30, padding:10}}>
                                                    <BarChartRoundedIcon/>                                   
                                                    <h4> {rec.dificultad} </h4>                                    
                                                </div>
                                            </div>

                                            
                                        </header>
                                    </section>
                                    
                                    <section style={{display:"flex", flexDirection:"column", maxWidth:500}}>
                                    <article className="tarjetaIngredientes">
                                    <h3 style={{margin:"auto"}}>INGREDIENTES</h3>
                                    {console.log(ingredientes)}
                                    {
                                        ingredientes.map((ing,index)=>{
                                            return (
                                                <div key={index} className="ingredienteItem">
                                                    <ArrowRightIcon/>
                                                    <p>{ing.d_ingrediente}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </article>    
                                        <article>     
                                            <h3>¿Cómo lo hacemos?</h3>                                 
                                            <p>{rec.desc_receta}</p>                               
                                        </article>
                                        
                                    </section>

                                </div> 
                            </div>             
                        )
                    })
                }
            </div>
        </div>
    )
}