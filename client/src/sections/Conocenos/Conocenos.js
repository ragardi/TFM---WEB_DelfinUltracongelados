import "../../css/style.css";

export const Conocenos = () => {
    const top = () =>{
        window.scrollTo({
            top:0,
            behavior: 'smooth'
        })
    }

    return (
        <div className="body">
            <center><h1 class='h1Titulo'>Esta aventura empezó en 1950...</h1></center>

            <div>
                <img src="images/linea.jpg" alt="portada" style={{width:"70vw"}}/>
            </div> 

            <div className="contenedorConocenos">
                <p>Los mejores momentos son los que compartimos con los que más queremos y en Delfín, desde 1950 hasta hoy, mantenemos la misma pasión, ser el SABOR de esos momentos.
                Y es que a todos nos gusta que comer sea siempre un placer. Por eso en Delfín, llevamos tantos años elaborando marisco de calidad, ideal para cuidarse, compartir y disfrutar. Nos levantamos cada día con un objetivo: BIENESTAR, para ti y los tuyos, pero también para el mar. Así que trabajamos por una alimentación sana, segura, con mucho sabor y por unos mares llenos de vida.
                En definitiva, nosotros podemos poner la mesa pero la ocasión, la pones tú, sólo tienes que encontrarla. Porque hay algo que tenemos muy claro, y es que ningún plato está completo sin las personas que más queremos.
                Delfín, desde 1950… el sabor de los mejores momentos.</p>

                <h2 >1950</h2>
                <p>Un joven de 14 años llamado Delfín, comienza a trabajar en una pequeña pescadería en el Mercado de Santo Domingo, Madrid. Con 18 años se hace cargo de la pescadería y así es como comienza nuestra historia</p>

                <h2>1960</h2>
                <p>Con el fin de facilitar la vida a sus clientes, Delfín comienza a cocer y congelar marisco, siendo pionero en España. Nace así Frigoríficos Delfín.</p>

                <h2>1970</h2>
                <p>Una vez más, buscando la cercanía y la comodidad de los clientes, Delfín comienza a distribuir marisco por toda España. ¡Llegamos más y mejor!</p>

                <h2>1980</h2>
                <p>La marca Delfín entra en los hogares españoles, convirtiendo el marisco en un producto mucho más accesible para los consumidores. ¡Cocido, congelado y en casa!</p>

                <h2>1990</h2>
                <p>Porque la seguridad de nuestros alimentos es lo más importante para cuidarte, Delfín es una de las primeras empresas del sector en obtener la certificación ISO 9001.</p>

                <h2>2000</h2>
                <p>Delfín continúa creciendo, tanto que nos mudamos a unas nuevas instalaciones en Ontígola, Toledo. Gracias a este hito conseguimos el certificado IFS (Food 5 NIVEL AVANZADO), que asegura la máxima calidad y seguridad en todos nuestros alimentos.</p>

                <h2>2010</h2>
                <p>Porque tenemos el deber de cuidar los recursos naturales, obtenemos los sellos MSC y ASC que certifican la pesca y acuicultura sostenible. Además, Delfín crece fuera de España y nos involucramos cada vez más en acciones de Responsabilidad Social.</p>
            
                <h2>HOY</h2>
                <p>Cuidarte y que cuides de los tuyos sigue siendo nuestra pasión. Por eso trabajamos continuamente por una alimentación sana, segura y con mucho sabor. Tus necesidades cambian y nosotros, cambiamos contigo para darte siempre lo mejor.</p>
            </div>
            
            <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/1HGnjjDRtiY?si=24wI5_7VxkZ_9isU" 
            title="YouTube video player" 
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen/>
            
            <img className='btnToTop' src={"images/flecha-arriba.png"} alt="top" onClick={top} />
        </div>
    )
 }