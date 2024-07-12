import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"
import Axios from "axios";

export const DetalleProductos = () => {
    const {c_produ} = useParams() //mismo nombre que en la ruta
    const [detProduc, setDetproduc] = useState([])

    Axios.defaults.withCredentials = true;
    const getProductos = (c_produ) => {
        Axios.get(`http://localhost:3001/mostrarproducto/${c_produ}`).then((response) => {
            setDetproduc(response.data)
        })
    }

    useEffect(() => {
        getProductos(c_produ);
    }, [c_produ]); 
    
    return(
        <div className="body">
            <div className="contenedorProRec">            
                {
                    detProduc.map((prod,index)=>{
                        return(
                            <div>
                                <div key={index} className="imgDesDetProRec">
                                    
                                    <section>
                                        <header>     
                                            <img src={`/images/${prod.url_foto}`} 
                                                alt={prod.d_produ}
                                                className='imgProRecDet'
                                                />
                                        </header>
                                    </section>

                                    <section  className="desDetProducto">
                                            <article className='desProducto'>
                                                <div>
                                                    <h2>{prod.d_produ}</h2>
                                                    <p> {prod.formato} </p> 
                                                </div>
                                                <div>
                                                    <h3 className='precio'>{prod.precio}€</h3>
                                                </div>
                                            </article>

                                        <article>                                      
                                            <p>{prod.definicion}</p>                               
                                        </article>
                                    </section>

                                </div>     
                                 
                                <section className='infoProducto'>
                                    <article>
                                        <h3>Ingredientes</h3>
                                        <p>{prod.contenido}</p>
                                    </article>

                                    <article>
                                        <h3>Alergias</h3>
                                        <p>{prod.informacion}</p>
                                    </article>

                                    <article>
                                        <h3>Consejos</h3>
                                        <p>{prod.consejos}</p>
                                    </article>
                                </section>   
                            </div>                  
                        )
                    })
                }
            </div>
        </div>
    )
}