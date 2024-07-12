import React, { Component, useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import { Menu } from './sections/Menu/Menu.js';
import { Home } from './sections/Home/Home.js';
import { Conocenos } from './sections/Conocenos/Conocenos.js';
import { Productos } from './sections/Productos/Productos.js';
import { DetalleProductos } from './sections/Productos/DetalleProductos.js';
import { Recetas } from './sections/Recetas/Recetas.js';
import { DetalleRecetas } from './sections/Recetas/DetalleRecetas.js';
import { Contacto } from './sections/Contacto/Contacto.js';
import { Cesta } from './sections/Cesta/Cesta.js';
import { Sesion } from './sections/Sesion/Sesion.js';
import { Perfil } from './sections/Perfil/Perfil.js';
import { PanelCliente } from './sections/Perfil/PanelCliente.js';
import { FormaEnvio } from './sections/Pago/FormaEnvio.js';
import { Pago } from './sections/Pago/Pago.js';
import { Tarjeta } from './sections/Pago/Tarjeta.js';
import { CambiaClave } from './sections/Perfil/CambiaClave/CambiaClave.js';
import { MisDatos } from './sections/Perfil/MisDatos/MisDatos.js';
import { MisPedidos } from './sections/Perfil/MisPedidos/MisPedidos.js';
import { MisProductosPedidos } from './sections/Perfil/MisProductosPedidos/MisProductosPedidos.js';
import { Clientes } from './sections/Perfil/Clientes/Clientes.js';
import { ManteTienda } from './sections/Perfil/ManteTienda/ManteTienda.js';
import { ManteRecetas } from './sections/Perfil/ManteRecetas/ManteRecetas.js';


import { Registro } from './sections/Sesion/Registro.js';
import { OlvidaClave } from './sections/Sesion/OlvidaClave';
import { AuthProvider } from './Context/AuthContext.js';
import { DetallePedido } from './sections/Perfil/MisPedidos/DetallePedido.js';

import { Error } from './sections/Error/Error.js'

class App extends Component {
  render() {
    return (
      <AuthProvider>

        <Routes>
          <Route path="/" element={<Menu/>}>
            <Route path="/" element={<Home/>} />
            <Route path="conocenos" element={<Conocenos />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/detalleproductos/:c_produ" element={<DetalleProductos/>} />
            <Route path="recetas" element={<Recetas />} /> 
            <Route path="detallerecetas/:c_receta" element={<DetalleRecetas />} /> 
            <Route path="contacto" element={<Contacto />} />
            <Route path="cesta" element={<Cesta />} /> 
            <Route path="formaenvio" element={<FormaEnvio/>}/>
            <Route path="pago" element={<Pago/>}/>
            <Route path="tarjeta" element={<Tarjeta/>}/>
            <Route path="perfil" element={<Perfil />} /> 
            <Route path="panelcliente" element={<PanelCliente />} /> 
            <Route path="sesion" element={<Sesion />} />
            <Route path="registro" element={<Registro />} />
            <Route path="olvidaClave" element={<OlvidaClave />} />

            <Route path="cambioClave" element={<CambiaClave />} />
            <Route path="misdatos" element={<MisDatos />} />
            <Route path="mispedidos" element={<MisPedidos />} />
            <Route path="detallepedido/:c_pedido" element={<DetallePedido />} /> 
            <Route path="misproductospedidos" element={<MisProductosPedidos />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="mantetienda" element={<ManteTienda />} />
            <Route path="manterecetas" element={<ManteRecetas />} />

            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </AuthProvider>
    );
  }
}

export default App;

