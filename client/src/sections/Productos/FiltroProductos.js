import React, { useState, useEffect } from "react";
import Axios from "axios";

export const FiltroProdutos = ({ nuevoFiltro, filtro }) => {
    const [tipoProducto, setTipoProducto] = useState([]);

    const getTipoProductos = () => {
        Axios.get("http://localhost:3001/getTipoProductos")
        .then((response) => {
            if (response.data.length > 0) {
                setTipoProducto(response.data);
            }
        });
    };

    useEffect(() => {
        getTipoProductos();
    }, []);

    return (
        <section >
            <div className="filtro">
                <button  className={filtro === 0 ? 'botonFiltro active' : "botonFiltro"} onClick={() => nuevoFiltro(0)}>VER TODO</button>
                {tipoProducto.map(tipo => (
                    <button className={filtro === tipo.c_tipo ? 'botonFiltro active' : "botonFiltro"} onClick={() => nuevoFiltro(tipo.c_tipo)}>{tipo.d_tipo}</button>
                ))}
            </div>
        </section>
    );
};
