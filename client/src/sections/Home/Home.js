import React from "react";
import { useNavigate } from "react-router-dom"
import "../../css/style.css"
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AnchorRoundedIcon from '@mui/icons-material/AnchorRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import EuroRoundedIcon from '@mui/icons-material/EuroRounded';

export const Home = () => {
   const navigate = useNavigate()
   return (
      <div className="body">   
            <img src="images/foto_entrada.png" className="portada" alt="portada"/>
         <div className="contenedorHome">

            <div className="contenedorPortada">
               <h1>¿Por qué Delfín Ultracongelados?</h1>
               <h4>Hay muchos motivos para confiar tu compra de mariscos online en Delfín Ultracongelados pero te vamos a dejar solo 4. ¿Aún no has comprado? ¡Confía en nosotros!</h4>
               
               <section className="contenedorSeccionesPortada">
                  <article className="articulosIconoPortada">
                     <StarRoundedIcon sx={{ fontSize: 50 }}/>
                     <h3>Amplia experiencia</h3>
                     <p>Más de 20 años vendiendo online nos avalan</p>
                  </article>
                  
                  <article className="articulosIconoPortada">
                     <AnchorRoundedIcon sx={{ fontSize: 50 }}/>
                     <h4>Familia marinera</h4>
                     <p>Somos la tercera generación marinera con barcos propios</p>
                  </article>

                  <article className="articulosIconoPortada">
                     <LocalShippingRoundedIcon sx={{ fontSize: 50 }}/>
                     <h4>Embalaje y transporte</h4>
                     <p>Cuidadosa metodología de embalaje y transporte</p>
                  </article>

                  <article className="articulosIconoPortada">
                     <EuroRoundedIcon sx={{ fontSize: 50 }}/>
                     <h4>Precios sin competencia</h4>
                     <p>Contamos con los mejores precios del mercado ¡sin duda!</p>
                  </article>
               </section>

            </div>
               <section className="contenedorSeccionesProRec">
                  <article>
                     <h2>Descubre nuestros Productos</h2>
                     <img src="images/productos_portada.png" alt="productos-portada" className="portadaProRec" onClick={() => navigate("/productos")}/>
                  </article>
                  <article>
                     <h2>Nuestras últimas Recetas</h2>
                     <img src="images/recetas-portada.png" alt="recetas-portada" className="portadaProRec" onClick={() => navigate("/recetas")}/>
                  </article>
               </section>
         </div>     
      </div>
   )
}