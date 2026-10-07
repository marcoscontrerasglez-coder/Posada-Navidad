// ============================================================
// INVITACIÓN POSADA NAVIDEÑA
// V2 - GOOGLE SHEETS
// ============================================================

// ============================================================
// CONFIGURACIÓN GOOGLE APPS SCRIPT
// ============================================================

    const API_URL = "https://script.google.com/macros/s/AKfycbzZCIlr-6a64alwZslgsZ2pX2UbBUvHukkvxv9rTfiug8jU5r72J3i7JyPNkehYGTrT/exec";



// ============================================================
// FUNCIONES GENERALES
// ============================================================

const $ = (id) => document.getElementById(id);


// ============================================================
// FORMATO DE FECHA
// ============================================================

function formatDate(value) {

    if (!value) {
        return "Por definir";
    }

    const [year, month, day] =
        value.split("-").map(Number);

    return new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    }).format(
        new Date(
            Date.UTC(
                year,
                month - 1,
                day
            )
        )
    );
}


// ============================================================
// CARGAR INFORMACIÓN DE LA POSADA
// ============================================================

function cargarInvitacion() {

    $("nombrePosada").textContent =
        POSADA_CONFIG.nombre;

    $("mensajePosada").textContent =
        POSADA_CONFIG.mensaje;

    $("fechaPosada").textContent =
        formatDate(
            POSADA_CONFIG.fecha
        );

    $("horaPosada").textContent =
        POSADA_CONFIG.hora + " hrs";

    $("lugarPosada").textContent =
        POSADA_CONFIG.lugar;

    $("direccionPosada").textContent =
        POSADA_CONFIG.direccion;


    // ========================================================
    // GOOGLE MAPS
    // ========================================================

    const mapaQuery =
        encodeURIComponent(
            POSADA_CONFIG.direccion
        );

    $("mapa").src =
        "https://www.google.com/maps?q=" +
        mapaQuery +
        "&output=embed";


    // ========================================================
    // MÚSICA
    // ========================================================

    const audio =
        $("audioNavidad");

    audio.src =
        "assets/" +
        POSADA_CONFIG.musica;


    // ========================================================
    // ESTILO
    // ========================================================

    aplicarEstilo(
        POSADA_CONFIG.estilo
    );
}


// ============================================================
// ESTILOS
// ============================================================

function aplicarEstilo(estilo) {

    const hero =
        document.querySelector(".hero");

    const estilos = {

        elegante:
            "linear-gradient(145deg,#0d2d22,#174d38 55%,#721925)",

        tradicional:
            "linear-gradient(145deg,#7c1623,#b12432 50%,#174d38)",

        nieve:
            "linear-gradient(145deg,#17354d,#37738e 55%,#203f5a)",

        oscuro:
            "linear-gradient(145deg,#111,#382126 55%,#111)",

        festivo:
            "linear-gradient(145deg,#7c1623,#174d38 50%,#b6811d)"
    };

    hero.style.background =
        estilos[estilo] ||
        estilos.elegante;
}


// ============================================================
// CONTADOR
// ============================================================

function iniciarContador() {

    function actualizar() {

        const fecha =
            POSADA_CONFIG.fecha +
            "T" +
            POSADA_CONFIG.hora +
            ":00";

        const objetivo =
            new Date(fecha).getTime();

        const ahora =
            Date.now();

        const diferencia =
            objetivo - ahora;


        if (Number.isNaN(objetivo)) {

            $("contador").textContent =
                "";

            return;
        }


        if (diferencia <= 0) {

            $("contador").textContent =
                "🎉 ¡La celebración ha llegado!";

            return;
        }


        const dias =
            Math.floor(
                diferencia / 86400000
            );

        const horas =
            Math.floor(
                (diferencia % 86400000) /
                3600000
            );

        const minutos =
            Math.floor(
                (diferencia % 3600000) /
                60000
            );

        $("contador").textContent =
            `Faltan ${dias} días, ` +
            `${horas} horas y ` +
            `${minutos} minutos`;
    }


    actualizar();

    setInterval(
        actualizar,
        60000
    );
}


// ============================================================
// ABRIR FORMULARIO
// ============================================================

function abrirFormulario() {

    $("formularioSeccion")
        .classList
        .remove("hidden");

    $("formularioSeccion")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}


// ============================================================
// ACOMPAÑANTES
// ============================================================

function actualizarAcompanantes() {

    const lleva =
        $("llevaAcompanantes").value === "1";


    $("cantidadAcompanantesWrap")
        .classList
        .toggle(
            "hidden",
            !lleva
        );


    if (!lleva) {

        $("acompanantesContainer")
            .innerHTML = "";

        return;
    }


    generarAcompanantes();
}


// ============================================================
// GENERAR ACOMPAÑANTES
// ============================================================

function generarAcompanantes() {

    const cantidad =
        Math.min(
            Math.max(
                Number(
                    $("cantidadAcompanantes").value
                ) || 1,
                1
            ),
            20
        );


    $("cantidadAcompanantes").value =
        cantidad;


    const container =
        $("acompanantesContainer");

    container.innerHTML = "";


    for (
        let i = 1;
        i <= cantidad;
        i++
    ) {

        const card =
            document.createElement("div");

        card.className =
            "dynamic-card";


        card.innerHTML = `

            <h3>👤 Acompañante ${i}</h3>

            <label>
                Nombre

                <input
                    type="text"
                    class="acompananteNombre"
                    data-index="${i}"
                    maxlength="100"
                    required
                >
            </label>

        `;


        container.appendChild(card);
    }
}


// ============================================================
// CHALECOS
// ============================================================

function actualizarChalecos() {

    const participa =
        $("participaChalecos").value === "si";


    $("chalecosContainer")
        .classList
        .toggle(
            "hidden",
            !participa
        );


    if (participa) {

        generarParticipantesChaleco();

    } else {

        $("participantesChaleco")
            .innerHTML = "";
    }
}


// ============================================================
// GENERAR PARTICIPANTES CHALECOS
// ============================================================

function generarParticipantesChaleco() {

    const cantidad =
        Math.min(
            Math.max(
                Number(
                    $("cantidadChalecos").value
                ) || 1,
                1
            ),
            20
        );


    $("cantidadChalecos").value =
        cantidad;


    const container =
        $("participantesChaleco");

    container.innerHTML = "";


    for (
        let i = 1;
        i <= cantidad;
        i++
    ) {

        const card =
            document.createElement("div");

        card.className =
            "dynamic-card";


        card.innerHTML = `

            <h3>🧥 Participante ${i}</h3>

            <div class="dynamic-grid">

                <label>
                    Nombre

                    <input
                        type="text"
                        class="chalecoNombre"
                        maxlength="100"
                        required
                    >
                </label>


                <label>
                    Talla

                    <select
                        class="chalecoTalla"
                        required
                    >

                        <option value="">
                            Selecciona
                        </option>

                        <option>XS</option>
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                        <option>XXL</option>

                    </select>

                </label>


                <label>
                    Color

                    <input
                        type="text"
                        class="chalecoColor"
                        placeholder="Ej. rojo"
                        maxlength="40"
                        required
                    >

                </label>

            </div>
        `;


        container.appendChild(card);
    }
}


// ============================================================
// PREPARAR FORMULARIO
// ============================================================

function prepararFormulario() {

        // ========================================================
    // CONTROLES DE CANTIDAD
    // ========================================================

    crearControlesCantidad(
        "cantidadAcompanantes",
        1,
        20,
        generarAcompanantes
    );


    crearControlesCantidad(
        "cantidadChalecos",
        1,
        20,
        generarParticipantesChaleco
    );

    // ========================================================
    // ASISTENCIA
    // ========================================================

    $("asistira")
        .addEventListener(
            "change",
            () => {

                const si =
                    $("asistira").value === "si";


                $("datosAsistencia")
                    .classList
                    .toggle(
                        "hidden",
                        !si
                    );
            }
        );


    // ========================================================
    // ACOMPAÑANTES
    // ========================================================

    $("llevaAcompanantes")
        .addEventListener(
            "change",
            actualizarAcompanantes
        );


    $("cantidadAcompanantes")
        .addEventListener(
            "input",
            generarAcompanantes
        );


    // ========================================================
    // CHALECOS
    // ========================================================

    $("participaChalecos")
        .addEventListener(
            "change",
            actualizarChalecos
        );


    $("cantidadChalecos")
        .addEventListener(
            "input",
            generarParticipantesChaleco
        );


    // ========================================================
    // ENVÍO
    // ========================================================

    $("formAsistencia")
        .addEventListener(
            "submit",
            enviarConfirmacion
        );
}


// ============================================================
// ENVIAR CONFIRMACIÓN
// ============================================================

async function enviarConfirmacion(event) {

    event.preventDefault();

    const boton =
        $("formAsistencia")
            .querySelector(
                'button[type="submit"]'
            );

    boton.disabled = true;

    boton.textContent =
        "⏳ Guardando...";


    try {

        // ====================================================
        // DATOS PRINCIPALES
        // ====================================================

        const nombre =
            $("nombreInvitado")
                .value
                .trim();


        const asistira =
            $("asistira").value;


        if (!nombre) {

            alert(
                "Por favor indica tu nombre."
            );

            throw new Error(
                "Nombre vacío"
            );
        }


        if (!asistira) {

            alert(
                "Selecciona si asistirás."
            );

            throw new Error(
                "Asistencia no seleccionada"
            );
        }


        // ====================================================
        // ACOMPAÑANTES
        // ====================================================

        let nombresAcompanantes = [];


        if (asistira === "si") {

            const lleva =
                $("llevaAcompanantes").value;


            if (lleva === "1") {

                nombresAcompanantes =
                    Array.from(
                        document.querySelectorAll(
                            ".acompananteNombre"
                        )
                    )
                    .map(
                        input =>
                            input.value.trim()
                    )
                    .filter(Boolean);
            }
        }


        // ====================================================
        // CHALECOS
        // ====================================================

        let participantesChalecos = [];


        if (
            asistira === "si" &&
            $("participaChalecos").value === "si"
        ) {

            participantesChalecos =
                Array.from(
                    document.querySelectorAll(
                        "#participantesChaleco .dynamic-card"
                    )
                )
                .map(card => {

                    const nombre =
                        card.querySelector(
                            ".chalecoNombre"
                        )?.value.trim() || "";


                    const talla =
                        card.querySelector(
                            ".chalecoTalla"
                        )?.value || "";


                    const color =
                        card.querySelector(
                            ".chalecoColor"
                        )?.value.trim() || "";


                    return {
                        nombre,
                        talla,
                        color
                    };
                });
        }


        // ====================================================
        // OBJETO
        // ====================================================

        const datos = {

            nombre: nombre,

            asistencia:
                asistira === "si"
                    ? "SI"
                    : "NO",

            acompanantes:
                asistira === "si"
                    ? nombresAcompanantes.length
                    : 0,

            nombresAcompanantes:
                asistira === "si"
                    ? nombresAcompanantes.join(", ")
                    : "",

            participaChalecos:
                asistira === "si" &&
                $("participaChalecos").value === "si"
                    ? "SI"
                    : "NO",

            participantesChalecos:
                asistira === "si" &&
                $("participaChalecos").value === "si"
                    ? participantesChalecos.length
                    : 0,

            detalleChalecos:
                participantesChalecos.length > 0
                    ? participantesChalecos
                        .map(persona =>
                            `${persona.nombre} | ${persona.talla} | ${persona.color}`
                        )
                        .join(" || ")
                    : ""
        };


        console.log(
            "Datos a enviar:",
            datos
        );


        // ====================================================
        // ENVIAR A GOOGLE APPS SCRIPT
        // ====================================================

        await fetch(
            API_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(datos)
            }
        );


        // ====================================================
        // IMPORTANTE
        // ====================================================
        //
        // Con no-cors el navegador no permite leer
        // la respuesta de Google.
        //
        // Lo que nos interesa es que el POST haya
        // sido enviado al Web App.
        //
        // ====================================================


        $("resultado")
            .classList
            .remove("hidden");


        $("resultado").innerHTML = `

            <strong>
                🎄 ¡Gracias, ${nombre}!
            </strong>

            <br><br>

            Tu confirmación fue registrada
            correctamente.

        `;


        $("resultado")
            .scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


        // ====================================================
        // LIMPIAR FORMULARIO
        // ====================================================

        $("formAsistencia").reset();


        $("datosAsistencia")
            .classList
            .add("hidden");


        $("cantidadAcompanantesWrap")
            .classList
            .add("hidden");


        $("chalecosContainer")
            .classList
            .add("hidden");


        $("acompanantesContainer")
            .innerHTML = "";


        $("participantesChaleco")
            .innerHTML = "";


    }
    catch (error) {

        console.error(
            "Error al enviar:",
            error
        );


        if (
            error.message !==
            "Nombre vacío" &&
            error.message !==
            "Asistencia no seleccionada"
        ) {

            alert(
                "No fue posible registrar la confirmación.\n\n" +
                "Por favor intenta nuevamente."
            );
        }

    }
    finally {

        boton.disabled = false;

        boton.textContent =
            "✅ Confirmar datos";
    }
}


// ============================================================
// BOTONES PRINCIPALES
// ============================================================

function prepararBotones() {


    // ========================================================
    // CONFIRMAR ASISTENCIA
    // ========================================================

    $("btnConfirmar")
        .addEventListener(
            "click",
            abrirFormulario
        );


    // ========================================================
    // UBICACIÓN
    // ========================================================

    $("btnUbicacion")
        .addEventListener(
            "click",
            () => {

                if (
                    POSADA_CONFIG.googleMapsUrl &&
                    POSADA_CONFIG.googleMapsUrl.trim()
                ) {

                    window.open(
                        POSADA_CONFIG.googleMapsUrl,
                        "_blank"
                    );

                } else {

                    const url =
                        "https://www.google.com/maps/search/?api=1&query=" +
                        encodeURIComponent(
                            POSADA_CONFIG.direccion
                        );


                    window.open(
                        url,
                        "_blank"
                    );
                }
            }
        );


    // ========================================================
    // MÚSICA
    // ========================================================

    $("btnMusica")
        .addEventListener(
            "click",
            async () => {

                const audio =
                    $("audioNavidad");

                const boton =
                    $("btnMusica");


                try {

                    if (audio.paused) {

                        await audio.play();

                        boton.textContent =
                            "🔇 Silenciar música";

                    } else {

                        audio.pause();

                        boton.textContent =
                            "🔊 Activar música";
                    }

                }
                catch {

                    alert(
                        "No se pudo reproducir la música.\n\n" +
                        "Verifica que assets/navidad.mp3 exista."
                    );
                }
            }
        );
}

// ============================================================
// CONTROLES + / - PARA CELULAR
// ============================================================

function crearControlesCantidad(
    inputId,
    minimo,
    maximo,
    callback
) {

    const input =
        $(inputId);

    if (!input) {
        return;
    }


    // Evitar duplicar controles

    if (
        input.parentElement
            .querySelector(
                ".quantity-control"
            )
    ) {
        return;
    }


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "quantity-control";


    const botonMenos =
        document.createElement("button");

    botonMenos.type =
        "button";

    botonMenos.className =
        "quantity-button";

    botonMenos.textContent =
        "−";


    const botonMas =
        document.createElement("button");

    botonMas.type =
        "button";

    botonMas.className =
        "quantity-button";

    botonMas.textContent =
        "+";


    input.parentNode.insertBefore(
        wrapper,
        input
    );


    wrapper.appendChild(
        botonMenos
    );


    wrapper.appendChild(
        input
    );


    wrapper.appendChild(
        botonMas
    );


    function actualizar() {

        let valor =
            parseInt(
                input.value
            ) || minimo;


        if (valor < minimo) {
            valor = minimo;
        }


        if (valor > maximo) {
            valor = maximo;
        }


        input.value =
            valor;


        if (callback) {
            callback();
        }
    }


    botonMenos.addEventListener(
        "click",
        () => {

            let valor =
                parseInt(
                    input.value
                ) || minimo;


            if (valor > minimo) {

                input.value =
                    valor - 1;

                actualizar();
            }
        }
    );


    botonMas.addEventListener(
        "click",
        () => {

            let valor =
                parseInt(
                    input.value
                ) || minimo;


            if (valor < maximo) {

                input.value =
                    valor + 1;

                actualizar();
            }
        }
    );


    input.addEventListener(
        "change",
        actualizar
    );
}

// ============================================================
// INICIO
// ============================================================

cargarInvitacion();

iniciarContador();

prepararFormulario();

prepararBotones();
