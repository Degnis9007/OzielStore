// Definir el botón de inicio de sesión y la URL de la API
const loginBtn = document.getElementById("loginBtn"); // Se obtiene el botón con id "loginBtn"
const url = 'http://127.0.0.1:5000/login'; // URL de la API para autenticar al usuario (cambiar a la URL de producción)

// Agregar un evento al botón de login para capturar el clic
loginBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Obtener los valores de los campos de email, password y proveedor (checkbox)
    const email = document.getElementById("email").value.trim(); 
    const password = document.getElementById("password").value.trim();
    const supplier = document.getElementById("proveedor").checked;

    // Validación básica: si email o password están vacíos
    if (email === "" || password === "") {
        console.log("No se ha podido iniciar sesión. Faltan datos.");
        return; // Termina la ejecución si falta información
    }

    // Validación del formato del email (regEx básica)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        console.log("Email no válido");
        return; // Termina la ejecución si el email es incorrecto
    }

    // Validación de la longitud de la contraseña
    if (password.length < 6) {
        console.log("La contraseña debe tener al menos 6 caracteres");
        return; // Termina la ejecución si la contraseña es muy corta
    }

    // Si el usuario no es proveedor, proceder con la autenticación del cliente
    if (supplier == false) {
        login_customer(email, password).then(resultado => {
            // Si el inicio de sesión es exitoso
            if (resultado.message === 'Inicio de sesión exitoso') {
                localStorage.setItem("isLoggedIn", "true"); // Guardar el estado de sesión en localStorage
                window.location.href = "./home.html"; // Redirigir a la página de inicio
            } else {
                alert("Credenciales incorrectas. Inténtalo de nuevo.");
            }
        }).catch(error => {
            // Manejo de errores, muestra el mensaje en la página
            document.getElementById("error_login").textContent = "Usuario o contraseña incorrectos";
        });
    } else {
        // Si el usuario es proveedor, mostrar un mensaje adecuado
        alert("El usuario es proveedor. No se permite el inicio de sesión en esta sección.");
    }
});

// Función asíncrona para realizar el login del cliente
async function login_customer(mail, pw) {
    const datos = { email: mail, password: pw }; // Datos a enviar a la API
    try {
        // Enviar los datos mediante una petición POST a la API
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos) // Convertir los datos a formato JSON
        });

        // Verificar si la respuesta es exitosa (código de estado 200-299)
        if (!respuesta.ok) {
            throw new Error(`${respuesta.status}`); // Lanza un error si la respuesta no es exitosa
        }

        // Convertir la respuesta en JSON
        const resultado = await respuesta.json();
        return resultado; // Retornar el resultado para su posterior uso
    } catch (error) {
        console.error(error); // Mostrar el error en la consola
        throw error; // Lanzar el error para ser manejado más arriba
    }
}

// Verificar si el usuario ya ha iniciado sesión al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Verificar el estado de login en localStorage
    if (isLoggedIn) {
        window.location.href = "./home.html"; // Redirigir al home si el usuario está autenticado
    }
});
