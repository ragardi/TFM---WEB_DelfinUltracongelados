import React, { useState, useEffect } from 'react'
import { Modal, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import  Axios  from "axios"

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

export const ModalTienda = (props) => { 
    const { open, onClose, tipo, producto } = props
    const [tipoProducto, setTipoProducto] = useState([])
    const datosIniciales = {
        c_produ: "", 
        d_produ: "",
        c_tipo:"",
        unidad: "",
        formato: "",
        precio:"",
        url_foto:"",
        estado:"",
        contenido:"",
        informacion:"",
        consejos:"",
        definicion:""
    }
    
    const [datosProducto, setDatosProducto] = useState(datosIniciales);
    
    const getTipoProductos = () => {
        Axios.get("http://localhost:3001/getTipoProductos")
        .then((response) => {
            if (response.data.length > 0){
                console.log(response.data)
                setTipoProducto(response.data)
            }
        }).catch(() =>{
            console.log("Error al obtener los tipos del producto")
        })
    }

    useEffect(() => {
        getTipoProductos()
    }, []);
   
    useEffect(() => {
        
        if (tipo === "editar" || tipo === "eliminar") {
            setDatosProducto(producto);            
        } else {
            setDatosProducto(datosIniciales)
        }
    }, [tipo, producto]);

    const cambioDatos = (e) => {
        const { name, value } = e.target;
        setDatosProducto(prev => ({
            ...prev,
            [name]: value
        }));
    };

    Axios.defaults.withCredentials = true;
    const eliminarProducto = () => {
        Axios.put("http://localhost:3001/eliminaproducto",{
            datosProducto
        })
        .then((response)=>{
            if (response.data.success){
                onClose()
            } else {
                alert("Error al eliminar producto");
            }
        })
    }
    
    const guardarProducto = () => {
        //NUEVA
        if (tipo === "nuevo") {
            Axios.post("http://localhost:3001/nuevoproducto",{
                datosProducto
            })
            .then((response)=>{
                if (!response.data.success){
                    alert("Error al guardar producto");
                }
            })
        
        //ACTUALIZAR
        } else if (tipo === "editar") { 
            Axios.put("http://localhost:3001/actualizaproducto",{
                datosProducto
            })
           
            .then((response)=>{
                if (!response.data.success){
                    alert("Error al actualizar producto");
                }
            });
        }
        onClose();
    };

    const cargarFoto = async (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            
            try {
                const response = await Axios.post("http://localhost:3001/cargafoto", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                if (response.data.success) {
                    console.log("respuesta OK")
                    setDatosProducto(prev => ({
                        ...prev,
                        url_foto: response.data.fileName
                    }));
                }
            } catch (error) {
                console.error("Error al subir la imagen:", error);
            }
        }
    };

    return (
        
        <Modal
            open={open}
            onClose={onClose}
        >
            {
            tipo === "eliminar" ? (
                <Box sx={style} >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Eliminar Producto
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        ¿Estas seguro de que desea eliminar el producto?
                    </Typography>

                    <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/aceptar.png"}  onClick={eliminarProducto} alt = 'Aceptar' />
                    <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/cancelar.png"}  onClick={onClose} alt = 'Cancelar' />

                </Box>
            ) : (
                <Box sx={style} className="custom-scrollbar" >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {tipo === "nuevo" ? "Nuevo Producto" : "Editar Producto"}
                    </Typography>
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField label="Producto" name="d_produ" type='text' value={datosProducto.d_produ} onChange={cambioDatos} fullWidth margin="normal"/>
                        
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                label="Tipo"
                                name="c_tipo"
                                value={datosProducto.c_tipo}
                                onChange={cambioDatos}
                            >
                                {
                                    tipoProducto.map((tipoP) => (
                                        <MenuItem value={tipoP.c_tipo}>{tipoP.d_tipo}</MenuItem>
                                    ))

                                }
                            </Select>
                        </FormControl>
                        
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Unidad</InputLabel>
                            <Select
                                label="Unidad"
                                name="unidad"
                                value={datosProducto.unidad}
                                onChange={cambioDatos}
                            >
                                <MenuItem value="E">Envases</MenuItem>
                                <MenuItem value="K">Kilos</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField label="Formato" name="formato" type='text' value={datosProducto.formato} onChange={cambioDatos} fullWidth margin="normal"/>
                        
                        <TextField label="Precio" name="precio" type='text' value={datosProducto.precio} onChange={cambioDatos} fullWidth margin="normal"/>

                        <div style={{display:"flex", alignItems:"center"}}>
                            <TextField label="URL Imagen" name="url_foto" value={datosProducto.url_foto} onChange={cambioDatos} fullWidth margin="normal" style={{marginRight:10}}/>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="file-upload"
                                onChange={cargarFoto}
                            />
                            <label htmlFor="file-upload">
                                <img style={{ width: 30, cursor: "pointer", paddingBottom: 2 }} src={"images/subirArchivo.png"} alt='Cargar Imagen' />
                            </label>
                        </div>
                        
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Estado</InputLabel>
                            <Select
                                label="Estado"
                                name="estado"
                                value={datosProducto.estado}
                                onChange={cambioDatos}
                            >
                                <MenuItem value="A">Alta</MenuItem>
                                <MenuItem value="B">Baja</MenuItem>
                                <MenuItem value="S">Sin Stock</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField label="Contenido" name="contenido" multiline rows={2} value={datosProducto.contenido} onChange={cambioDatos} fullWidth margin="normal"/>

                        <TextField label="Informacón" name="informacion" multiline rows={2} value={datosProducto.informacion} onChange={cambioDatos} fullWidth margin="normal" size="small"/>

                        <TextField label="Consejos" name="consejos" multiline rows={4} value={datosProducto.consejos} onChange={cambioDatos} fullWidth margin="normal" size="small"/>

                        <TextField label="Definición" name="definicion" multiline rows={4} value={datosProducto.definicion} onChange={cambioDatos} fullWidth margin="normal" size="small" />

                        <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/guardar.png"}  onClick={guardarProducto} alt = 'Guardar' />
                        <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/cancelar.png"}  onClick={onClose} alt = 'Cancelar' />

                    </Box>
                </Box>
            )}
        </Modal>
    );
};


