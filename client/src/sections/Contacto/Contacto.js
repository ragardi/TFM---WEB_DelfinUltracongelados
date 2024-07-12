export const Contacto = () => {
    return (
        <div className="body">
            <h1>Delfín Ultracongelados, tu marca de confianza</h1>
            <img src="images/delfin_panoramica.jpg" className="imgContacto" alt="instalaciones"/>

            <div className="contenedorContactanos">
                <section>
                    <h3>DIRECCIÓN</h3>
                    <p>C. Colmenas, 35, 45340 Ontígola, Toledo</p>

                    <h3>EMAIL</h3>
                    <p>delfinultracongelados@grupodelfin.es</p>

                    <h3>TELÉFONO</h3>
                    <p>925 15 71 30</p>

                    <h3>HORARIO</h3>
                    <p>L-V: 9 a 18h</p>

                    <h3>No te olvides de nuestras redes sociales</h3>
                    <img src="images/facebook.png" className="imgRedesSociales" alt="facebook" onClick={()=>{window.open('https://www.facebook.com/DelfinUltracongelados', '_blank')}}/>
                    <img src="images/instagram.png" className="imgRedesSociales" alt="instagram" onClick={()=>{window.open('https://www.instagram.com/delfinultracongelados/?hl=es', '_blank')}}/>
                    <img src="images/linkedin.png" className="imgRedesSociales" alt="linkedin" onClick={()=>{window.open('https://www.linkedin.com/company/delf-n-ultracongelados-sa/mycompany/', '_blank')}}/>
                    <img src="images/youtube.png" className="imgRedesSociales" alt="youtube" onClick={()=>{window.open('https://www.youtube.com/@delfinultracongelados', '_blank')}}/>
                    <img src="images/spotify.png" className="imgRedesSociales" alt="spotify" onClick={()=>{window.open('https://open.spotify.com/user/31wec5myewtyk3tfuqjtxh6cwhh4', '_blank')}}/>
                </section>

                <section className="contenedorMapa">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.6814231461954!2d-3.5897719251177787!3d39.99322418130829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd420f5295555555%3A0x13936d51eb1efaa3!2sDELF%C3%ADN%20ULTRACONGELADOS!5e0!3m2!1ses!2ses!4v1720382144478!5m2!1ses!2ses" 
                        width="600" 
                        height="450"
                        frameborder="0"
                        allowfullscreen="" 
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </section>
            </div>
        </div>
    )
 }