// ============================================================
// FUNCIONAMIENTO DE LA INVITACION
// ============================================================

const $ = (id) => document.getElementById(id);

function formatDate(value) {
    if (!value) return "Por definir";
    const [year, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    }).format(new Date(Date.UTC(year, month - 1, day)));
}

function cargarInvitacion() {
    $("nombrePosada").textContent = POSADA_CONFIG.nombre;
    $("mensajePosada").textContent = POSADA_CONFIG.mensaje;
    $("fechaPosada").textContent = formatDate(POSADA_CONFIG.fecha);
    $("horaPosada").textContent = POSADA_CONFIG.hora + " hrs";
    $("lugarPosada").textContent = POSADA_CONFIG.lugar;
    $("direccionPosada").textContent = POSADA_CONFIG.direccion;

    const mapaQuery = encodeURIComponent(POSADA_CONFIG.direccion);
    $("mapa").src =
        "https://www.google.com/maps?q=" + mapaQuery + "&output=embed";

    const audio = $("audioNavidad");
    audio.src = "assets/" + POSADA_CONFIG.musica;

    aplicarEstilo(POSADA_CONFIG.estilo);
}

function aplicarEstilo(estilo) {
    const hero = document.querySelector(".hero");

    const estilos = {
        elegante: "linear-gradient(145deg,#0d2d22,#174d38 55%,#721925)",
        tradicional: "linear-gradient(145deg,#7c1623,#b12432 50%,#174d38)",
        nieve: "linear-gradient(145deg,#17354d,#37738e 55%,#203f5a)",
        oscuro: "linear-gradient(145deg,#111,#382126 55%,#111)",
        festivo: "linear-gradient(145deg,#7c1623,#174d38 50%,#b6811d)"
    };

    hero.style.background =
        estilos[estilo] || estilos.elegante;
}

function iniciarContador() {
    function actualizar() {
        const fecha = POSADA_CONFIG.fecha + "T" +
            POSADA_CONFIG.hora + ":00";

        const objetivo = new Date(fecha).getTime();
        const ahora = Date.now();
        const diferencia = objetivo - ahora;

        if (Number.isNaN(objetivo)) {
            $("contador").textContent = "";
            return;
        }

        if (diferencia <= 0) {
            $("contador").textContent = "🎉 ¡La celebración ha llegado!";
            return;
        }

        const dias = Math.floor(diferencia / 86400000);
        const horas = Math.floor((diferencia % 86400000) / 3600000);
        const minutos = Math.floor((diferencia % 3600000) / 60000);

        $("contador").textContent =
            `Faltan ${dias} días, ${horas} horas y ${minutos} minutos`;
    }

    actualizar();
    setInterval(actualizar, 60000);
}

function abrirFormulario() {
    $("formularioSeccion").classList.remove("hidden");
    $("formularioSeccion").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function actualizarAcompanantes() {
    const lleva = $("llevaAcompanantes").value === "1";
    $("cantidadAcompanantesWrap").classList.toggle("hidden", !lleva);

    if (!lleva) {
        $("acompanantesContainer").innerHTML = "";
        return;
    }

    generarAcompanantes();
}

function generarAcompanantes() {
    const cantidad = Math.min(
        Math.max(Number($("cantidadAcompanantes").value) || 1, 1),
        20
    );

    $("cantidadAcompanantes").value = cantidad;

    const container = $("acompanantesContainer");
    container.innerHTML = "";

    for (let i = 1; i <= cantidad; i++) {
        const card = document.createElement("div");
        card.className = "dynamic-card";
        card.innerHTML = `
            <h3>👤 Acompañante ${i}</h3>
            <label>
                Nombre
                <input type="text" class="acompananteNombre"
                    data-index="${i}" maxlength="100" required>
            </label>
        `;
        container.appendChild(card);
    }
}

function actualizarChalecos() {
    const participa = $("participaChalecos").value === "si";
    $("chalecosContainer").classList.toggle("hidden", !participa);

    if (participa) {
        generarParticipantesChaleco();
    } else {
        $("participantesChaleco").innerHTML = "";
    }
}

function generarParticipantesChaleco() {
    const cantidad = Math.min(
        Math.max(Number($("cantidadChalecos").value) || 1, 1),
        20
    );

    $("cantidadChalecos").value = cantidad;

    const container = $("participantesChaleco");
    container.innerHTML = "";

    for (let i = 1; i <= cantidad; i++) {
        const card = document.createElement("div");
        card.className = "dynamic-card";
        card.innerHTML = `
            <h3>🧥 Participante ${i}</h3>
            <div class="dynamic-grid">
                <label>
                    Nombre
                    <input type="text" class="chalecoNombre"
                        maxlength="100" required>
                </label>
                <label>
                    Talla
                    <select class="chalecoTalla" required>
                        <option value="">Selecciona</option>
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
                    <input type="text" class="chalecoColor"
                        placeholder="Ej. rojo" maxlength="40" required>
                </label>
            </div>
        `;
        container.appendChild(card);
    }
}

function prepararFormulario() {
    $("asistira").addEventListener("change", () => {
        const si = $("asistira").value === "si";
        $("datosAsistencia").classList.toggle("hidden", !si);
    });

    $("llevaAcompanantes").addEventListener(
        "change",
        actualizarAcompanantes
    );

    $("cantidadAcompanantes").addEventListener(
        "input",
        generarAcompanantes
    );

    $("participaChalecos").addEventListener(
        "change",
        actualizarChalecos
    );

    $("cantidadChalecos").addEventListener(
        "input",
        generarParticipantesChaleco
    );

    $("formAsistencia").addEventListener("submit", (event) => {
        event.preventDefault();

        const asistira = $("asistira").value;

        if (asistira === "no") {
            $("resultado").classList.remove("hidden");
            $("resultado").textContent =
                "Gracias por avisarnos. Registramos que no podrás asistir.";
            return;
        }

        const nombre = $("nombreInvitado").value.trim();

        if (!nombre) {
            alert("Por favor indica tu nombre.");
            return;
        }

        $("resultado").classList.remove("hidden");
        $("resultado").innerHTML =
            `<strong>🎉 ¡Gracias, ${nombre}!</strong><br>
             Tu confirmación quedó preparada correctamente.<br>
             <small>En la siguiente etapa conectaremos este formulario con Google Sheets para guardar las respuestas.</small>`;

        $("resultado").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}

function prepararBotones() {
    $("btnConfirmar").addEventListener("click", abrirFormulario);

    $("btnUbicacion").addEventListener("click", () => {
        if (POSADA_CONFIG.googleMapsUrl.trim()) {
            window.open(POSADA_CONFIG.googleMapsUrl, "_blank");
        } else {
            const url =
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(POSADA_CONFIG.direccion);
            window.open(url, "_blank");
        }
    });

    $("btnMusica").addEventListener("click", async () => {
        const audio = $("audioNavidad");
        const boton = $("btnMusica");

        try {
            if (audio.paused) {
                await audio.play();
                boton.textContent = "🔇 Silenciar música";
            } else {
                audio.pause();
                boton.textContent = "🔊 Activar música";
            }
        } catch {
            alert(
                "No se pudo reproducir la música. Verifica que assets/navidad.mp3 exista."
            );
        }
    });
}

cargarInvitacion();
iniciarContador();
prepararFormulario();
prepararBotones();
