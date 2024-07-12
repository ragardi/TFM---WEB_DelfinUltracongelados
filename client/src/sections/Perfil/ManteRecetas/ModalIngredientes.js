import React, { useState, useEffect } from 'react';
import { Modal, Typography, Box, TextField } from '@mui/material';
import Axios from "axios";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '50vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 5,
    p: 4
};

export const ModalIngredientes = (props) => { 
    const { open, onClose, tipo, recetas } = props;
    const codigoReceta = recetas.c_receta; 
    const [datosIngredientes, setDatosIngredientes] = useState([]);

    Axios.defaults.withCredentials = true;
    const getIngredientes = () => {
        if (codigoReceta) {
            Axios.get(`http://localhost:3001/getingredientes/${codigoReceta}`)
            .then((response) => {
                if (response.data.length > 0) {
                    setDatosIngredientes(response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching ingredientes: ", error);
            });
        }
    };

    useEffect(() => {
        getIngredientes();
    }, [codigoReceta]); 

    const cambioDatos = (e, index) => {
        const { name, value } = e.target;
        setDatosIngredientes(prev =>
            prev.map((item, i) => i === index ? { ...item, [name]: value } : item));
    };

    const agregarIngrediente = () => {
        setDatosIngredientes(prev => [...prev, { c_ingrediente: prev.length + 1, c_receta: codigoReceta, d_ingrediente: '' }]);
    };

    const eliminarIngrediente = (c_ingrediente) => {
        console.log("Dentro de eliminar")
        Axios.put("http://localhost:3001/eliminaingrediente",{
            c_ingrediente, codigoReceta
        })
        .then((response)=>{
            if (response.data.success){
                onClose()
            } else {
                alert("Error al eliminar receta");
            };
        })
    }

    const guardarIngredientes = () => {
        console.log(datosIngredientes)
        Axios.post("http://localhost:3001/guardaingrediente",{
            datosIngredientes, codigoReceta
        })
        .then((response)=>{
            if (!response.data.success){
                alert("Error al guardar receta");
            }
        })
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableScrollLock={true}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">Editar ingredientes</Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    {
                        datosIngredientes.length > 0 ? (
                            datosIngredientes.map((ingr, index) => (
                                <div style={{display:"flex", alignItems:"center"}}>
                                    <TextField 
                                        key={ingr.c_ingrediente}
                                        label={`Ingrediente ${ingr.c_ingrediente}`}
                                        name="d_ingrediente"
                                        value={ingr.d_ingrediente}
                                        onChange={(e) => cambioDatos(e, index)}
                                        fullWidth
                                        margin="normal"
                                        size="small"
                                    />
                                    <img key={ingr.c_ingrediente} style={{width: 30, height:30, cursor: "pointer", paddingBottom: 2, marginLeft:5}} src={"images/eliminar.png"} onClick={()=>eliminarIngrediente(ingr.c_ingrediente)} alt='Nuevo' />
                                </div>
                            ))
                        ) : null
                    }
                    <img style={{width: 90, cursor: "pointer", paddingBottom: 2, margin:3}} src={"images/insertar.png"} onClick={agregarIngrediente} alt='Nuevo' />
                    <img style={{width: 100, cursor: "pointer", paddingBottom: 2, margin:3}} src={"images/guardar.png"} onClick={guardarIngredientes} alt='Guardar' />
                </Box>
            </Box>
        </Modal>
    );
};
