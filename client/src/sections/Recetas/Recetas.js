import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded'; //PERSONAS
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'; //TIEMPO
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'; //BARRAS

import Axios from "axios";
import "../../css/style.css"

export const Recetas = () => {
    const [recetas, setRecetas] = useState([])
    
    const top = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }

    Axios.defaults.withCredentials = true;
    const getRecetas = () => {
        Axios.get("http://localhost:3001/getRecetas")
        .then((response) => {
            setRecetas(response.data)
        })
    }

    //se ejecuta cuando se carga el componente
    useEffect(()=>{
        getRecetas()
    },[])

  

    return (
        <div className='body'>            
            <h1>Triunfa en casa</h1>
            <h4>No olvides cocinar con música</h4>
            <img src="images/playlist-spotify.png" style={{width:200, cursor:"pointer"}} alt="spotify" onClick={()=>{window.open('https://open.spotify.com/user/31wec5myewtyk3tfuqjtxh6cwhh4', '_blank')}}/>
            
            <div className="contenedorColumnas">
                {
                    recetas.map((rec,index)=>{
                        return(
                            rec.estado === "A" && (
                                <section key={index} className="tarjeta">
                                    <header>
                                        <Link to= {`/detallerecetas/${rec.c_receta}`} className="link">
                                            <img src={`images/${rec.url_foto}`} 
                                                alt={rec.d_receta}
                                                height="250"
                                                style={{borderRadius:10}}
                                            />
                                        </Link>
                                    </header>
                                    
                                    <article style={{margin:"auto"}}>
                                        <h3> {rec.d_receta} </h3>
                                        <div style={{display:"flex", justifyContent:"center"}}>
                                            <div style={{display:"flex", alignItems:"center", height:30, padding:10}}>
                                                <EmojiPeopleRoundedIcon/>  {/* PERSONAS */}
                                                <h4> {rec.personas}</h4> 
                                            </div>
                                            <div style={{display:"flex", alignItems:"center", height:30, padding:10}}>
                                                <AccessTimeRoundedIcon/>  {/* TIEMPO */}                                  
                                                <h4> {`${rec.minutos_elab} min`} </h4> 
                                            </div>
                                            <div style={{display:"flex", alignItems:"center", height:30, padding:10}}>
                                                <BarChartRoundedIcon/>  {/* BARRAS */}                                 
                                                <h4> {rec.dificultad} </h4>                                    
                                            </div>
                                        </div>
                                    </article>
                                </section>                           
                            ) 
                        )
                    })
                }                
            </div>        
            <img className='btnToTop' src={"images/flecha-arriba.png"} alt="top" onClick={() =>{top()}}/>    
        </div>
    )
}
 