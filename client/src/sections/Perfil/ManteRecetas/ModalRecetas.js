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

export const ModalRecetas = (props) => { 
    const { open, onClose, tipo, recetas } = props

    const datosIniciales = {
        c_receta: "",
        d_receta: "",
        desc_receta: "",
        personas: "",
        minutos_elab:"",
        dificultad:"",
        url_foto:"",
        estado:""
    }
    
    const [datosRecetas, setDatosRecetas] = useState(datosIniciales);

   
    useEffect(() => {
        
        if (tipo === "editar" || tipo === "eliminar") {
            setDatosRecetas(recetas);            
        } else {
            setDatosRecetas(datosIniciales)
        }
    }, [tipo, recetas]);

    const cambioDatos = (e) => {
        const { name, value } = e.target;
        setDatosRecetas(prev => ({
            ...prev,
            [name]: value
        }));
    };

    Axios.defaults.withCredentials = true;
    const eliminarReceta = () => {
        Axios.put("http://localhost:3001/eliminareceta",{
            datosRecetas
        })
        .then((response)=>{
            if (response.data.success){
                onClose()
            } else {
                alert("Error al eliminar receta");
            }
        });
    }
    
    const guardarReceta = () => {
        //NUEVA
        if (tipo === "nuevo") {
            Axios.post("http://localhost:3001/nuevareceta",{
                datosRecetas
            })
            .then((response)=>{
                if (!response.data.success){
                    alert("Error al guardar receta");
                }
            })
        
        //ACTUALIZAR
        } else if (tipo === "editar") {
            Axios.put("http://localhost:3001/actualizareceta",{
                datosRecetas
            })
            .then((response)=>{
                if (!response.data.success){
                    alert("Error al actualizar receta");
                }
            })
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
                    setDatosRecetas(prev => ({
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
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableScrollLock={true}
        >
            {
            tipo === "eliminar" ? (
                <Box sx={style} >
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Eliminar Receta
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        ¿Estas seguro de que desea eliminar la receta?
                    </Typography>

                    <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/aceptar.png"}  onClick={eliminarReceta} alt = 'Aceptar' />
                    <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/cancelar.png"}  onClick={onClose} alt = 'Cancelar' />

                </Box>
            ) : (
                <Box sx={style} className="custom-scrollbar">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {tipo === "nuevo" ? "Nueva Receta" : "Editar Receta"}
                    </Typography>
                    <Box component="form" sx={{ mt: 2 }}>
                    <div style={{display:"flex"}}>
                            <TextField label="Nombre" name="d_receta" value={datosRecetas.d_receta} onChange={cambioDatos} fullWidth margin="normal" style={{marginRight:10}}/>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    label="Estado"
                                    name="estado"
                                    value={datosRecetas.estado}
                                    onChange={cambioDatos}
                                >
                                    <MenuItem value="A">Alta</MenuItem>
                                    <MenuItem value="B">Baja</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <TextField label="Elaboración" name="desc_receta" multiline rows={4} value={datosRecetas.desc_receta} onChange={cambioDatos} fullWidth margin="normal" />
                        
                        <div style={{display:"flex"}}>
                            <TextField label="Raciones" name="personas" value={datosRecetas.personas} onChange={cambioDatos} fullWidth margin="normal" style={{marginRight:10}}/>
                            
                            <TextField label="Dificultad" name="dificultad" value={datosRecetas.dificultad} onChange={cambioDatos} fullWidth margin="normal" style={{marginRight:10}}/>
                            
                            <TextField label="Tiempo en minutos" name="minutos_elab" value={datosRecetas.minutos_elab} onChange={cambioDatos} fullWidth margin="normal" />
                        </div>

                        <div style={{display:"flex", alignItems:"center"}}>
                            <TextField label="URL Imagen" name="url_foto" value={datosRecetas.url_foto} onChange={cambioDatos} fullWidth margin="normal" style={{marginRight:10}}/>

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
                                              
                        <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/guardar.png"}  onClick={guardarReceta} alt = 'Guardar' />
                        <img style={{width:100, cursor: "pointer", paddingBottom:2, margin:3}} src={"images/cancelar.png"}  onClick={onClose} alt = 'Cancelar' />

                    </Box>
                </Box>
            )}
        </Modal>
    );
};


