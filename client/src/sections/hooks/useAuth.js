import { useEffect, useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { AuthContext } from "../../Context/AuthContext.js";

const useAuthCheck = () => {
  const { autenticacion, setAutenticacion } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  Axios.defaults.withCredentials = true; 
  
  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        const response = await Axios.get("http://localhost:3001/autenticacion");
        if (response.data.success) {
          setAutenticacion(true);
        } else {
          setAutenticacion(false);
          navigate("/perfil");
        }
      } catch (error) {
        console.log("Error al verificar autenticación");
        setAutenticacion(false);
        navigate("/perfil");
      } finally {
        setChecked(true);
      }
    };

    verificarAutenticacion();
  }, [navigate, setAutenticacion]);

  return { autenticacion, checked };
};

export default useAuthCheck;
