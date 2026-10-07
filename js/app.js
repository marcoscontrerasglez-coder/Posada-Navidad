document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // CONFIGURACIÓN
    // ============================================================

    const API_URL = "https://script.google.com/macros/s/AKfycbzZCIlr-6a64alwZslgsZ2pX2UbBUvHukkvxv9rTfiug8jU5r72J3i7JyPNkehYGTrT/exec";

    // ============================================================
    // ELEMENTOS
    // ============================================================

    const nombreEvento = document.getElementById("nombreEvento");
    const fechaEvento = document.getElementById("fechaEvento");
    const horaEvento = document.getElementById("horaEvento");
    const lugarEvento = document.getElementById("lugarEvento");
    const direccionEvento = document.getElementById("direccionEvento");
    const mensajeEvento = document.getElementById("mensajeEvento");

    const mapa = document.getElementById("mapa");
    const btnUbicacion = document.getElementById("btnUbicacion");
    const btnMusica = document.getElementById("btnMusica");
    const btnConfirmar = document.getElementById("btnConfirmar");

    const formulario = document.getElementById("formularioAsistencia");

    // ============================================================
    // CARGAR CONFIGURACIÓN DEL EVENTO
    // ============================================================

    if (typeof POSADA_CONFIG !== "undefined") {

        if (nombreEvento) {
            nombreEvento.textContent = POSADA_CONFIG.nombre;
        }

        if (fechaEvento) {
            fechaEvento.textContent = formatearFecha(POSADA_CONFIG.fecha);
        }

        if (horaEvento) {
            horaEvento.textContent = POSADA_CONFIG.hora;
        }

        if (lugarEvento) {
            lugarEvento.textContent = POSADA_CONFIG.lugar;
        }

        if (direccionEvento) {
            direccionEvento.textContent = POSADA_CONFIG.direccion;
        }

        if (mensajeEvento) {
            mensajeEvento.textContent = POSADA_CONFIG.mensaje;
        }

        cargarMapa();
    }

    // ============================================================
    // FECHA
    // ============================================================

    function formatearFecha(fecha) {

        const fechaObj = new Date(`${fecha}T12:00:00`);

        return fechaObj.toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    // ============================================================
    // GOOGLE MAPS
    // ============================================================

    function cargarMapa() {

        if (!mapa || typeof POSADA_CONFIG === "undefined") {
            return;
        }

        const direccion = encodeURIComponent(
            POSADA_CONFIG.direccion
        );

        mapa.src =
            `https://www.google.com/maps?q=${direccion}&output=embed`;
    }

    // ============================================================
    // BOTÓN UBICACIÓN
    // ============================================================

    if (btnUbicacion) {

        btnUbicacion.addEventListener("click", () => {

            if (
                typeof POSADA_CONFIG !== "undefined" &&
                POSADA_CONFIG.googleMapsUrl
            ) {

                window.open(
                    POSADA_CONFIG.googleMapsUrl,
                    "_blank"
                );

            } else {

                const direccion =
                    encodeURIComponent(
                        POSADA_CONFIG.direccion
                    );

                window.open(
                    `https://www.google.com/maps/search/?api=1&query=${direccion}`,
                    "_blank"
                );
            }
        });
    }

    // ============================================================
    // MÚSICA
    // ============================================================

    let audio = null;
    let reproduciendo = false;

    if (typeof POSADA_CONFIG !== "undefined" &&
        POSADA_CONFIG.musica) {

        audio = new Audio(
            `assets/${POSADA_CONFIG.musica}`
        );

        audio.loop = true;
    }

    if (btnMusica) {

        btnMusica.addEventListener("click", () => {

            if (!audio) {
                alert("No se encontró el archivo de música.");
                return;
            }

            if (!reproduciendo) {

                audio.play()
                    .then(() => {

                        reproduciendo = true;

                        btnMusica.textContent =
                            "🔇 Pausar música";

                    })
                    .catch(() => {

                        alert(
                            "No fue posible reproducir la música. " +
                            "Verifica que navidad.mp3 exista en la carpeta assets."
                        );

                    });

            } else {

                audio.pause();

                reproduciendo = false;

                btnMusica.textContent =
                    "🎵 Música";
            }
        });
    }

    // ============================================================
    // COUNTDOWN
    // ============================================================

    iniciarCuentaRegresiva();

    function iniciarCuentaRegresiva() {

        const countdown =
            document.getElementById("countdown");

        if (!countdown ||
            typeof POSADA_CONFIG === "undefined") {
            return;
        }

        const fechaObjetivo =
            new Date(
                `${POSADA_CONFIG.fecha}T${POSADA_CONFIG.hora}:00`
            );

        function actualizar() {

            const ahora = new Date();

            const diferencia =
                fechaObjetivo - ahora;

            if (diferencia <= 0) {

                countdown.textContent =
                    "🎄 ¡La posada ha comenzado!";

                return;
            }

            const dias =
                Math.floor(
                    diferencia /
                    (1000 * 60 * 60 * 24)
                );

            const horas =
                Math.floor(
                    (diferencia /
                        (1000 * 60 * 60)) % 24
                );

            const minutos =
                Math.floor(
                    (diferencia /
                        (1000 * 60)) % 60
                );

            const segundos =
                Math.floor(
                    (diferencia / 1000) % 60
                );

            countdown.textContent =
                `${dias} días · ${horas} horas · ` +
                `${minutos} minutos · ${segundos} segundos`;
        }

        actualizar();

        setInterval(actualizar, 1000);
    }

    // ============================================================
    // MOSTRAR FORMULARIO
    // ============================================================

    if (btnConfirmar) {

        btnConfirmar.addEventListener("click", () => {

            const seccion =
                document.getElementById(
                    "seccionConfirmacion"
                );

            if (seccion) {

                seccion.style.display = "block";

                seccion.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    }

    // ============================================================
    // ASISTENCIA
    // ============================================================

    const asistencia =
        document.getElementById("asistencia");

    const bloqueAcompanantes =
        document.getElementById(
            "bloqueAcompanantes"
        );

    const cantidadAcompanantes =
        document.getElementById(
            "cantidadAcompanantes"
        );

    const contenedorAcompanantes =
        document.getElementById(
            "contenedorAcompanantes"
        );

    const bloqueChalecos =
        document.getElementById(
            "bloqueChalecos"
        );

    const participaChalecos =
        document.getElementById(
            "participaChalecos"
        );

    const cantidadChalecos =
        document.getElementById(
            "cantidadChalecos"
        );

    const contenedorChalecos =
        document.getElementById(
            "contenedorChalecos"
        );

    // ============================================================
    // CAMBIO DE ASISTENCIA
    // ============================================================

    if (asistencia) {

        asistencia.addEventListener(
            "change",
            () => {

                if (asistencia.value === "si") {

                    if (bloqueAcompanantes) {
                        bloqueAcompanantes.style.display =
                            "block";
                    }

                    if (bloqueChalecos) {
                        bloqueChalecos.style.display =
                            "block";
                    }

                } else {

                    if (bloqueAcompanantes) {
                        bloqueAcompanantes.style.display =
                            "none";
                    }

                    if (bloqueChalecos) {
                        bloqueChalecos.style.display =
                            "none";
                    }

                    limpiarAcompanantes();
                    limpiarChalecos();
                }
            }
        );
    }

    // ============================================================
    // ACOMPAÑANTES
    // ============================================================

    if (cantidadAcompanantes) {

        cantidadAcompanantes.addEventListener(
            "change",
            generarAcompanantes
        );
    }

    function generarAcompanantes() {

        if (!contenedorAcompanantes) {
            return;
        }

        contenedorAcompanantes.innerHTML = "";

        const cantidad =
            parseInt(
                cantidadAcompanantes.value
            ) || 0;

        for (let i = 1; i <= cantidad; i++) {

            const grupo =
                document.createElement("div");

            grupo.className =
                "campo-dinamico";

            grupo.innerHTML = `
                <label>
                    Nombre del acompañante ${i}
                </label>

                <input
                    type="text"
                    class="nombreAcompanante"
                    placeholder="Nombre completo"
                    required
                >
            `;

            contenedorAcompanantes.appendChild(
                grupo
            );
        }
    }

    function limpiarAcompanantes() {

        if (cantidadAcompanantes) {
            cantidadAcompanantes.value = "0";
        }

        if (contenedorAcompanantes) {
            contenedorAcompanantes.innerHTML = "";
        }
    }

    // ============================================================
    // CHALECOS
    // ============================================================

    if (participaChalecos) {

        participaChalecos.addEventListener(
            "change",
            () => {

                if (
                    participaChalecos.value === "si"
                ) {

                    if (cantidadChalecos) {
                        cantidadChalecos.style.display =
                            "block";
                    }

                    if (contenedorChalecos) {
                        contenedorChalecos.style.display =
                            "block";
                    }

                } else {

                    if (cantidadChalecos) {
                        cantidadChalecos.style.display =
                            "none";
                    }

                    if (contenedorChalecos) {
                        contenedorChalecos.style.display =
                            "none";
                    }

                    limpiarChalecos();
                }
            }
        );
    }

    // ============================================================
    // GENERAR PARTICIPANTES DE CHALECOS
    // ============================================================

    if (cantidadChalecos) {

        cantidadChalecos.addEventListener(
            "change",
            generarChalecos
        );
    }

    function generarChalecos() {

        if (!contenedorChalecos) {
            return;
        }

        contenedorChalecos.innerHTML = "";

        const cantidad =
            parseInt(
                cantidadChalecos.value
            ) || 0;

        for (let i = 1; i <= cantidad; i++) {

            const grupo =
                document.createElement("div");

            grupo.className =
                "chaleco-item";

            grupo.innerHTML = `
                <h4>Participante ${i}</h4>

                <label>Nombre</label>

                <input
                    type="text"
                    class="nombreChaleco"
                    placeholder="Nombre completo"
                    required
                >

                <label>Talla</label>

                <select
                    class="tallaChaleco"
                    required
                >
                    <option value="">
                        Seleccionar
                    </option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                </select>

                <label>Color</label>

                <input
                    type="text"
                    class="colorChaleco"
                    placeholder="Color"
                    required
                >
            `;

            contenedorChalecos.appendChild(
                grupo
            );
        }
    }

    function limpiarChalecos() {

        if (cantidadChalecos) {
            cantidadChalecos.value = "0";
        }

        if (contenedorChalecos) {
            contenedorChalecos.innerHTML = "";
        }
    }

    // ============================================================
    // ENVÍO DEL FORMULARIO
    // ============================================================

    if (formulario) {

        formulario.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const boton =
                    formulario.querySelector(
                        'button[type="submit"]'
                    );

                if (boton) {
                    boton.disabled = true;
                    boton.textContent =
                        "Enviando...";
                }

                try {

                    const nombre =
                        document.getElementById(
                            "nombre"
                        )?.value.trim() || "";

                    const valorAsistencia =
                        asistencia?.value || "";

                    const acompanantes =
                        parseInt(
                            cantidadAcompanantes?.value
                        ) || 0;

                    const nombres =
                        Array.from(
                            document.querySelectorAll(
                                ".nombreAcompanante"
                            )
                        )
                        .map(
                            input =>
                                input.value.trim()
                        )
                        .filter(Boolean);

                    const participa =
                        participaChalecos?.value || "";

                    const cantidadParticipantes =
                        parseInt(
                            cantidadChalecos?.value
                        ) || 0;

                    const participantes =
                        Array.from(
                            document.querySelectorAll(
                                ".chaleco-item"
                            )
                        )
                        .map(item => {

                            const nombre =
                                item.querySelector(
                                    ".nombreChaleco"
                                )?.value.trim() || "";

                            const talla =
                                item.querySelector(
                                    ".tallaChaleco"
                                )?.value || "";

                            const color =
                                item.querySelector(
                                    ".colorChaleco"
                                )?.value.trim() || "";

                            return {
                                nombre,
                                talla,
                                color
                            };
                        });

                    const datos = {

                        nombre: nombre,

                        asistencia:
                            valorAsistencia === "si"
                                ? "SI"
                                : "NO",

                        acompanantes:
                            valorAsistencia === "si"
                                ? acompanantes
                                : 0,

                        nombresAcompanantes:
                            valorAsistencia === "si"
                                ? nombres.join(", ")
                                : "",

                        participaChalecos:
                            valorAsistencia === "si"
                                ? (
                                    participa === "si"
                                        ? "SI"
                                        : "NO"
                                )
                                : "NO",

                        participantesChalecos:
                            valorAsistencia === "si" &&
                            participa === "si"
                                ? cantidadParticipantes
                                : 0,

                        detalleChalecos:
                            valorAsistencia === "si" &&
                            participa === "si"
                                ? participantes
                                    .map(p =>
                                        `${p.nombre} | ${p.talla} | ${p.color}`
                                    )
                                    .join(" || ")
                                : ""
                    };

                    // ============================================
                    // VALIDACIÓN
                    // ============================================

                    if (!datos.nombre) {

                        alert(
                            "Por favor escribe tu nombre."
                        );

                        restaurarBoton();

                        return;
                    }

                    if (!datos.asistencia) {

                        alert(
                            "Selecciona si asistirás."
                        );

                        restaurarBoton();

                        return;
                    }

                    // ============================================
                    // ENVIAR A GOOGLE SHEETS
                    // ============================================

                    const respuesta =
                        await fetch(
                            API_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "text/plain;charset=utf-8"
                                },

                                body:
                                    JSON.stringify(datos)
                            }
                        );

                    const resultado =
                        await respuesta.json();

                    if (
                        resultado.status !== "OK"
                    ) {

                        throw new Error(
                            resultado.message ||
                            "Error al guardar."
                        );
                    }

                    // ============================================
                    // ÉXITO
                    // ============================================

                    mostrarMensajeExito(
                        "🎄 ¡Gracias! Tu confirmación fue registrada correctamente."
                    );

                    formulario.reset();

                    limpiarAcompanantes();
                    limpiarChalecos();

                    if (bloqueAcompanantes) {
                        bloqueAcompanantes.style.display =
                            "none";
                    }

                    if (bloqueChalecos) {
                        bloqueChalecos.style.display =
                            "none";
                    }

                }
                catch (error) {

                    console.error(
                        "Error:",
                        error
                    );

                    alert(
                        "No fue posible registrar tu confirmación. " +
                        "Por favor intenta nuevamente."
                    );

                }
                finally {

                    restaurarBoton();
                }
            }
        );
    }

    // ============================================================
    // FUNCIONES AUXILIARES
    // ============================================================

    function restaurarBoton() {

        if (!formulario) {
            return;
        }

        const boton =
            formulario.querySelector(
                'button[type="submit"]'
            );

        if (boton) {

            boton.disabled = false;

            boton.textContent =
                "Confirmar asistencia";
        }
    }

    function mostrarMensajeExito(
        mensaje
    ) {

        let elemento =
            document.getElementById(
                "mensajeConfirmacion"
            );

        if (!elemento) {

            elemento =
                document.createElement("div");

            elemento.id =
                "mensajeConfirmacion";

            formulario.parentNode.insertBefore(
                elemento,
                formulario
            );
        }

        elemento.innerHTML =
            `<p>${mensaje}</p>`;

        elemento.style.display =
            "block";

        elemento.scrollIntoView({
            behavior: "smooth"
        });
    }

});
