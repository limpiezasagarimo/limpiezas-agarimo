// ===== SISTEMA DE RESERVAS =====

// Cargar reservas al abrir la página
document.addEventListener('DOMContentLoaded', function() {
    cargarReservas();
    
    // Agregar evento al formulario
    document.getElementById('formReserva').addEventListener('submit', function(e) {
        e.preventDefault();
        agregarReserva();
    });
});

// Función para agregar una reserva
function agregarReserva() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const direccion = document.getElementById('direccion').value;
    const descripcion = document.getElementById('descripcion').value;

    // Validar que todos los campos obligatorios estén llenos
    if (!nombre || !email || !telefono || !servicio || !fecha || !hora || !direccion) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un email válido');
        return;
    }

    // Validar teléfono (solo números)
    const telefonoRegex = /^[0-9\-\+\s\(\)]+$/;
    if (!telefonoRegex.test(telefono)) {
        alert('Por favor ingresa un teléfono válido');
        return;
    }

    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
        alert('Por favor selecciona una fecha futura');
        return;
    }

    // Crear objeto de reserva
    const reserva = {
        id: Date.now(), // ID único basado en timestamp
        nombre,
        email,
        telefono,
        servicio,
        fecha,
        hora,
        direccion,
        descripcion,
        fechaCreacion: new Date().toLocaleString('es-ES')
    };

    // Obtener reservas existentes
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    
    // Agregar nueva reserva
    reservas.push(reserva);
    
    // Guardar en localStorage
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Mostrar mensaje de éxito
    alert('¡Reserva confirmada exitosamente! Te contactaremos pronto para confirmar.');

    // Limpiar formulario
    document.getElementById('formReserva').reset();

    // Actualizar lista de reservas
    cargarReservas();

    // Scroll a la lista de reservas
    document.querySelector('.reservas-list').scrollIntoView({ behavior: 'smooth' });
}

// Función para cargar y mostrar las reservas
function cargarReservas() {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const container = document.getElementById('reservasContainer');

    // Limpiar contenedor
    container.innerHTML = '';

    if (reservas.length === 0) {
        container.innerHTML = '<p class="no-reservas">No hay reservas aún. ¡Haz tu primer reserva!</p>';
        return;
    }

    // Mostrar reservas en orden inverso (más recientes primero)
    reservas.reverse().forEach(reserva => {
        const reservaElement = crearElementoReserva(reserva);
        container.appendChild(reservaElement);
    });
}

// Función para crear el elemento HTML de una reserva
function crearElementoReserva(reserva) {
    const div = document.createElement('div');
    div.className = 'reserva-item';
    
    // Formatear fecha
    const fechaObj = new Date(reserva.fecha);
    const fechaFormato = fechaObj.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    div.innerHTML = `
        <h4>${reserva.servicio}</h4>
        <p><strong>Nombre:</strong> ${escaparHTML(reserva.nombre)}</p>
        <p><strong>Email:</strong> ${escaparHTML(reserva.email)}</p>
        <p><strong>Teléfono:</strong> ${escaparHTML(reserva.telefono)}</p>
        <p><strong>Fecha:</strong> ${fechaFormato}</p>
        <p><strong>Hora:</strong> ${reserva.hora}</p>
        <p><strong>Dirección:</strong> ${escaparHTML(reserva.direccion)}</p>
        ${reserva.descripcion ? `<p><strong>Descripción:</strong> ${escaparHTML(reserva.descripcion)}</p>` : ''}
        <p style="font-size: 0.8rem; color: #999;">Reservado: ${reserva.fechaCreacion}</p>
        <button class="btn-eliminar" onclick="eliminarReserva(${reserva.id})">Eliminar Reserva</button>
    `;

    return div;
}

// Función para eliminar una reserva
function eliminarReserva(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        
        // Filtrar la reserva a eliminar
        reservas = reservas.filter(reserva => reserva.id !== id);
        
        // Guardar cambios
        localStorage.setItem('reservas', JSON.stringify(reservas));
        
        // Actualizar visualización
        cargarReservas();
        
        alert('Reserva eliminada exitosamente');
    }
}

// Función para escapar caracteres HTML (seguridad)
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Función para exportar reservas (opcional)
function exportarReservas() {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const dataStr = JSON.stringify(reservas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reservas_${new Date().getTime()}.json`;
    link.click();
}

// Función para validar horario de negocio (opcional)
function validarHorarioNegocio(fecha, hora) {
    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.getDay();
    
    // 0 = Domingo, 1-5 = Lunes a Viernes, 6 = Sábado
    
    if (diaSemana === 0) {
        return { valido: false, mensaje: 'No trabajamos los domingos' };
    }
    
    const horaNum = parseInt(hora.split(':')[0]);
    
    if (diaSemana >= 1 && diaSemana <= 5) {
        // Lunes a Viernes: 8:00 AM - 6:00 PM
        if (horaNum < 8 || horaNum >= 18) {
            return { valido: false, mensaje: 'Horario disponible: 8:00 AM - 6:00 PM (Lunes a Viernes)' };
        }
    } else if (diaSemana === 6) {
        // Sábado: 9:00 AM - 3:00 PM
        if (horaNum < 9 || horaNum >= 15) {
            return { valido: false, mensaje: 'Horario disponible: 9:00 AM - 3:00 PM (Sábado)' };
        }
    }
    
    return { valido: true, mensaje: 'Horario disponible' };
}
