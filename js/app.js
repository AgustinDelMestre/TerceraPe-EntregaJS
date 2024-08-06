let personas = [];
let clientes = [];

function buscarPersona(nombre, apellido) {
    return personas.find(persona => persona.nombre === nombre && persona.apellido === apellido);
}

function agregarPersona(nombre, apellido, edad) {
    personas.push({ nombre, apellido, edad });
}

function buscarCliente(nombre, apellido) {
    return clientes.find(cliente => cliente.nombre === nombre && cliente.apellido === apellido);
}

function agregarCliente(nombre, apellido, edad) {
    clientes.push({ nombre, apellido, edad });
}

function pesosAeuros(pesos, euros) {
    return pesos / euros;
}

function eurosApesos(euros, pesos) {
    return euros * pesos;
}

function pesosAdolares(pesos, dolares) {
    return pesos / dolares;
}

function dolaresApesos(dolares, pesos) {
    return dolares * pesos;
}

function formatearDecimal(numero) {
    return numero.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function obtenerTasas() {
    let dolares = parseFloat(document.getElementById('tasa-dolares').value);
    let euros = parseFloat(document.getElementById('tasa-euros').value);
    return { dolares, euros };
}

function mostrarResultadosConAnimacion(resultado) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = resultado;
    resultadosDiv.classList.add('show');
    setTimeout(() => {
        resultadosDiv.classList.remove('show');
    }, 10000); 
}

function validarNombre() {
    let nombre = document.getElementById('nombre').value.trim();
    const mensaje = document.getElementById('nombre-error');
    if (/\d/.test(nombre)) {
        mensaje.textContent = 'El nombre no puede contener números.';
        mensaje.style.color = 'red';
    } else {
        mensaje.textContent = '';
    }
}

function validarApellido() {
    let apellido = document.getElementById('apellido').value.trim();
    const mensaje = document.getElementById('apellido-error');
    if (/\d/.test(apellido)) {
        mensaje.textContent = 'El apellido no puede contener números.';
        mensaje.style.color = 'red';
    } else {
        mensaje.textContent = '';
    }
}

function validarEdad() {
    let edad = parseInt(document.getElementById('edad').value.trim());
    const mensaje = document.getElementById('edad-error');
    if (isNaN(edad) || edad <= 0) {
        mensaje.textContent = 'La edad debe ser un número válido.';
        mensaje.style.color = 'red';
    } else {
        mensaje.textContent = '';
    }
}

function actualizarHistorial() {
    const historialLista = document.getElementById('historial-lista');
    historialLista.innerHTML = ''; 
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    historial.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.fecha}: ${item.resultado} <button onclick="eliminarDelHistorial('${item.fecha}')">Eliminar</button>`;
        historialLista.appendChild(li);
    });
}

function agregarAHistorial(resultado) {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.push({ fecha: new Date().toISOString(), resultado });
    localStorage.setItem
    localStorage.setItem('historial', JSON.stringify(historial));
    actualizarHistorial();
}

function eliminarDelHistorial(fecha) {
    let historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial = historial.filter(item => item.fecha !== fecha);
    localStorage.setItem('historial', JSON.stringify(historial));
    actualizarHistorial();
}

function convertir() {
    let { dolares, euros } = obtenerTasas();
    let nombre = document.getElementById('nombre').value.trim();
    let apellido = document.getElementById('apellido').value.trim();
    let edad = parseInt(document.getElementById('edad').value.trim());
    let monto = parseFloat(document.getElementById('monto').value.trim());
    let opcion = document.getElementById('opcion').value;

    if (/\d/.test(nombre)) {
        alert('El nombre no puede contener números.');
        return;
    }
    if (/\d/.test(apellido)) {
        alert('El apellido no puede contener números.');
        return;
    }
    if (isNaN(edad) || edad <= 0) {
        alert('La edad debe ser un número válido.');
        return;
    }
    if (isNaN(monto) || monto <= 0) {
        alert('Por favor ingrese un monto válido.');
        return;
    }

    let persona = buscarPersona(nombre, apellido);
    if (!persona) {
        agregarPersona(nombre, apellido, edad);
    }
    let clienteExistente = buscarCliente(nombre, apellido);
    if (!clienteExistente) {
        agregarCliente(nombre, apellido, edad);
    }

    let resultado;
    if (opcion === '1') {
        let eurosConvertidos = pesosAeuros(monto, euros);
        let dolaresConvertidos = pesosAdolares(monto, dolares);
        resultado = `${nombre} ${apellido}, ${edad} años, el equivalente en euros de $${formatearDecimal(monto)} pesos es ${formatearDecimal(eurosConvertidos)} EUR<br>
                     ${nombre} ${apellido}, ${edad} años, el equivalente en dólares de $${formatearDecimal(monto)} pesos es ${formatearDecimal(dolaresConvertidos)} USD`;
    } else if (opcion === '2') {
        let pesosDesdeEuros = eurosApesos(monto, euros);
        let pesosDesdeDolares = dolaresApesos(monto, dolares);
        resultado = `El equivalente en pesos desde ${formatearDecimal(monto)} EUR es $${formatearDecimal(pesosDesdeEuros)}<br>
                     El equivalente en pesos desde ${formatearDecimal(monto)} USD es $${formatearDecimal(pesosDesdeDolares)}`;
    } else {
        alert('Opción no válida.');
        return;
    }

    mostrarResultadosConAnimacion(resultado);
    agregarAHistorial(resultado);

    personas = [];
    clientes = [];
}

function toggleDarkMode() {
    const body = document.body;
    const container = document.querySelector('.container');
    const toggleButton = document.getElementById('toggle-mode');
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        container.classList.remove('dark-mode');
        toggleButton.textContent = 'Cambiar a modo oscuro';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        container.classList.add('dark-mode');
        toggleButton.textContent = 'Cambiar a modo claro';
        localStorage.setItem('theme', 'dark');
    }
}

document.getElementById('convertir').addEventListener('click', convertir);
document.getElementById('nombre').addEventListener('input', validarNombre);
document.getElementById('apellido').addEventListener('input', validarApellido);
document.getElementById('edad').addEventListener('input', validarEdad);
document.getElementById('toggle-mode').addEventListener('click', toggleDarkMode);

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.container').classList.add('dark-mode');
        document.getElementById('toggle-mode').textContent = 'Cambiar a modo claro';
    }
    actualizarHistorial();
});

