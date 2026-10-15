// Arrays principales de la aplicación.
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

// Muestra los hábitos en la página.
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

// Rellena el desplegable con los hábitos creados.
function actualizarDesplegable() {
    const desplegable = document.getElementById("habito-registro");

    // Conserva una opción inicial para seleccionar el hábito.
    desplegable.innerHTML = '<option value="">Selecciona un hábito</option>';

    habitos.forEach(function(habito) {
        const opcion = document.createElement("option");

        opcion.value = habito.id;
        opcion.textContent = habito.nombre;

        desplegable.appendChild(opcion);
    });
}

// Crea un hábito al enviar el primer formulario.
function crearHabito(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const categoria = document.getElementById("categoria").value;
    const estado = document.getElementById("estado");

    // Comprueba que el nombre no esté vacío.
    if (nombre === "") {
        estado.textContent = "Escribe un nombre para el hábito.";
        return;
    }

    // Genera un identificador único.
    const id = habitos.length > 0
        ? Math.max(...habitos.map(habito => habito.id)) + 1
        : 1;

    // Crea el objeto del hábito.
    const nuevoHabito = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        categoria: categoria
    };

    // Añade el hábito y guarda los datos.
    habitos.push(nuevoHabito);
    guardarTodo();

    // Actualiza la lista y el desplegable del segundo formulario.
    mostrarHabitos();
    actualizarDesplegable();

    // Limpia el formulario.
    document.getElementById("form-habito").reset();

    estado.textContent = "Hábito creado correctamente.";
}

// Crea un registro de un día al enviar el segundo formulario.
function crearRegistro(evento) {
    evento.preventDefault();

    const habitoId = Number(document.getElementById("habito-registro").value);
    const fecha = document.getElementById("fecha").value;
    const observaciones = document.getElementById("observaciones").value.trim();
    const cumplido = document.getElementById("cumplido").checked;
    const estado = document.getElementById("estado");

    // Comprueba que se haya seleccionado un hábito y una fecha.
    if (!habitoId || !fecha) {
        estado.textContent = "Selecciona un hábito y una fecha.";
        return;
    }

    // Comprueba que el hábito seleccionado exista.
    const habitoExiste = habitos.some(function(habito) {
        return habito.id === habitoId;
    });

    if (!habitoExiste) {
        estado.textContent = "El hábito seleccionado no existe.";
        return;
    }

    // Genera un identificador único para el registro.
    const id = registros.length > 0
        ? Math.max(...registros.map(registro => registro.id)) + 1
        : 1;

    // Crea el objeto del registro.
    const nuevoRegistro = {
        id: id,
        habitoId: habitoId,
        fecha: fecha,
        observaciones: observaciones,
        cumplido: cumplido
    };

    // Añade el registro y guarda los dos arrays.
    registros.push(nuevoRegistro);
    guardarTodo();

    // Limpia el formulario.
    document.getElementById("form-registro").reset();

    estado.textContent = "Registro guardado correctamente.";

    console.log("Registro creado:", nuevoRegistro);
}

// Inicializa la aplicación recuperando los datos guardados.
cargarTodo();

// Muestra los hábitos recuperados.
mostrarHabitos();

// Rellena el desplegable con los hábitos recuperados.
actualizarDesplegable();

// Activa el formulario de creación de hábitos.
document.getElementById("form-habito").addEventListener("submit", crearHabito);

// Activa el formulario de registro de días.
document.getElementById("form-registro").addEventListener("submit", crearRegistro);

// Mensajes para comprobar el funcionamiento desde la consola.
console.log("HábitoTracker iniciado.");
console.log("Hábitos recuperados:", habitos);
console.log("Registros recuperados:", registros);

// Genera la tabla de seguimiento con los registros guardados.
function mostrarRegistros() {
const tabla = document.getElementById("tabla-registros");
const resumen = document.getElementById("resumen-registros");

tabla.innerHTML = "";

let cumplidos = 0;
let fallados = 0;

registros.forEach(function(registro) {
    // Busca el hábito al que pertenece el registro.
    const habito = habitos.find(function(elemento) {
        return elemento.id === registro.habitoId;
    });

    const fila = document.createElement("tr");

    const celdaHabito = document.createElement("td");
    celdaHabito.textContent = habito ? habito.nombre : "Hábito no encontrado";

    const celdaFecha = document.createElement("td");
    celdaFecha.textContent = registro.fecha;

    const celdaObservaciones = document.createElement("td");
    celdaObservaciones.textContent = registro.observaciones || "Sin observaciones";

    const celdaEstado = document.createElement("td");

    if (registro.cumplido) {
        celdaEstado.textContent = "✓ Cumplido";
        celdaEstado.style.color = "green";
        cumplidos++;
    } else {
        celdaEstado.textContent = "✗ Fallado";
        celdaEstado.style.color = "red";
        fallados++;
    }

    fila.appendChild(celdaHabito);
    fila.appendChild(celdaFecha);
    fila.appendChild(celdaObservaciones);
    fila.appendChild(celdaEstado);

    tabla.appendChild(fila);
});

resumen.textContent =
    "Cumplidos: " + cumplidos + " | Fallados: " + fallados;

}

// Abre el modal de seguimiento.
function abrirModal() {
mostrarRegistros();
document.getElementById("modal-seguimiento").classList.remove("oculto");
}

// Cierra el modal de seguimiento.
function cerrarModal() {
document.getElementById("modal-seguimiento").classList.add("oculto");
}

// Configura los eventos del menú y del modal.
document.getElementById("abrir-modal").addEventListener("click", function(evento) {
evento.preventDefault();
abrirModal();
});

document.getElementById("cerrar-modal").addEventListener("click", cerrarModal);

// Cierra el modal al pulsar en el fondo oscuro.
document.getElementById("modal-seguimiento").addEventListener("click", function(evento) {
if (evento.target === this) {
cerrarModal();
}
});