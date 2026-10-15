// Arrays principales de la aplicación.
let habitos = [];
let registros = [];

// Guarda un valor en una cookie.
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

// Guarda los dos arrays.
function guardarTodo() {
    guardarCookie("habitos", habitos);
    guardarCookie("registros", registros);
}

// Recupera los dos arrays al iniciar la aplicación.
function cargarTodo() {
    const habitosGuardados = leerCookie("habitos");
    const registrosGuardados = leerCookie("registros");

    habitos = Array.isArray(habitosGuardados) ? habitosGuardados : [];
    registros = Array.isArray(registrosGuardados) ? registrosGuardados : [];
}

cargarTodo();

console.log("HábitoTracker iniciado.");
console.log("Hábitos recuperados:", habitos);
console.log("Registros recuperados:", registros);