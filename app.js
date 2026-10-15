
/* Arrays principales de la aplicación. */
let habitos = [];
let registros = [];

// Guarda un valor en una cookie convirtiéndolo a JSON.
function guardarCookie(nombre, valor) {
    const contenido = encodeURIComponent(JSON.stringify(valor));

    document.cookie = `${nombre}=${contenido}; max-age=2592000; path=/; SameSite=Lax`;
}

// Lee una cookie y convierte su contenido en un objeto JavaScript.
function leerCookie(nombre) {
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
        const separador = cookie.indexOf("=");
        const clave = cookie.substring(0, separador);
        const valor = cookie.substring(separador + 1);

        if (clave === nombre) {
            try {
                return JSON.parse(decodeURIComponent(valor));
            } catch (error) {
                console.error("No se ha podido leer la cookie:", nombre, error);
                return null;
            }
        }
    }

    return null;
}

// Elimina una cookie.
function borrarCookie(nombre) {
    document.cookie = `${nombre}=; max-age=0; path=/; SameSite=Lax`;
}

// Guarda los dos arrays en sus respectivas cookies.
function guardarTodo() {
    guardarCookie("habitos", habitos);
    guardarCookie("registros", registros);
}

// Recupera los datos guardados en las cookies.
function cargarTodo() {
    const habitosGuardados = leerCookie("habitos");
    const registrosGuardados = leerCookie("registros");

    habitos = Array.isArray(habitosGuardados) ? habitosGuardados : [];
    registros = Array.isArray(registrosGuardados) ? registrosGuardados : [];
}

// Muestra los hábitos en la página principal.
function mostrarHabitos() {
    const lista = document.getElementById("lista-habitos");

    lista.innerHTML = "";

    habitos.forEach(function(habito) {
        const elemento = document.createElement("li");

        elemento.textContent =
            habito.nombre + " - " + habito.categoria +
            (habito.descripcion ? " (" + habito.descripcion + ")" : "");

        lista.appendChild(elemento);
    });
}

// Rellena el desplegable del formulario de registro.
function actualizarDesplegable() {
    const desplegable = document.getElementById("habito-registro");

    desplegable.innerHTML =
        '<option value="">Selecciona un hábito</option>';

    habitos.forEach(function(habito) {
        const opcion = document.createElement("option");

        opcion.value = habito.id;
        opcion.textContent = habito.nombre;

        desplegable.appendChild(opcion);
    });
}

// Crea un hábito.
function crearHabito(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const categoria = document.getElementById("categoria").value;
    const estado = document.getElementById("estado");

    if (nombre === "") {
        estado.textContent = "Escribe un nombre para el hábito.";
        return;
    }

    const id = habitos.length > 0
        ? Math.max(...habitos.map(habito => habito.id)) + 1
        : 1;

    const nuevoHabito = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        categoria: categoria
    };

    habitos.push(nuevoHabito);
    guardarTodo();

    mostrarHabitos();
    actualizarDesplegable();

    document.getElementById("form-habito").reset();

    estado.textContent = "Hábito creado correctamente.";
}

// Crea un registro diario.
function crearRegistro(evento) {
    evento.preventDefault();

    const habitoId = Number(document.getElementById("habito-registro").value);
    const fecha = document.getElementById("fecha").value;
    const observaciones = document.getElementById("observaciones").value.trim();
    const cumplido = document.getElementById("cumplido").checked;
    const estado = document.getElementById("estado");

    if (!habitoId || !fecha) {
        estado.textContent = "Selecciona un hábito y una fecha.";
        return;
    }

    const habitoExiste = habitos.some(function(habito) {
        return habito.id === habitoId;
    });

    if (!habitoExiste) {
        estado.textContent = "El hábito seleccionado no existe.";
        return;
    }

    const id = registros.length > 0
        ? Math.max(...registros.map(registro => registro.id)) + 1
        : 1;

    const nuevoRegistro = {
        id: id,
        habitoId: habitoId,
        fecha: fecha,
        observaciones: observaciones,
        cumplido: cumplido
    };

    registros.push(nuevoRegistro);
    guardarTodo();

    document.getElementById("form-registro").reset();

    estado.textContent = "Registro guardado correctamente.";

    console.log("Registro creado:", nuevoRegistro);
}

// Cambia el estado de un registro y guarda los datos en las cookies.
function toggleCumplido(id) {
    const registro = registros.find(function(elemento) {
        return elemento.id === id;
    });

    if (!registro) {
        return;
    }

    registro.cumplido = !registro.cumplido;

    guardarTodo();

    console.log("Estado del registro actualizado:", registro);
}

// Abre el seguimiento en una segunda ventana.
function abrirSeguimiento() {
    window.open(
        "seguimiento.html",
        "ventanaSeguimiento",
        "width=1100,height=600"
    );
}

// Recupera los datos guardados al iniciar.
cargarTodo();

// IMPORTANTE: compartir los arrays después de cargarlos.
window.habitos = habitos;
window.registros = registros;
window.toggleCumplido = toggleCumplido;

mostrarHabitos();
actualizarDesplegable();

// Activa el formulario de creación de hábitos.
document.getElementById("form-habito")
    .addEventListener("submit", crearHabito);

// Activa el formulario de registro de días.
document.getElementById("form-registro")
    .addEventListener("submit", crearRegistro);

// El enlace Ver seguimiento abre la segunda ventana.
document.getElementById("abrir-modal")
    .addEventListener("click", function(evento) {
        evento.preventDefault();
        abrirSeguimiento();
    });

// Mensajes para comprobar el funcionamiento.
console.log("HábitoTracker iniciado.");
console.log("Hábitos recuperados:", habitos);
console.log("Registros recuperados:", registros);
