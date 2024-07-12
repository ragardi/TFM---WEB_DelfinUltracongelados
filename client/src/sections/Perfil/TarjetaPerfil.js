import React from "react";
import { useNavigate } from "react-router-dom"

export const TarjetaPerfil = (props) => {
    const {imagen, ruta, titulo, descripcion} = props
    const navigate = useNavigate()
    let navRuta = "/"+ ruta

    return(
        <section className="tarjetasPerfil" onClick={()=>navigate(navRuta)}>
            <img src={`images/${imagen}.png`} 
                alt={imagen}
            />
            <article>
                <h4> {titulo} </h4>
                <p> {descripcion} </p>                                    
            </article>                
        </section>
    )
    
}