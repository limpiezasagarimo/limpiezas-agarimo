// ===== MENÚ HAMBURGUESA =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.style.display = 'none';
        hamburger.classList.remove('active');
    });
});

// ===== FORMULARIO DE CONTACTO =====
document.getElementById('formContacto').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('contactoNombre').value;
    const email = document.getElementById('contactoEmail').value;
    const asunto = document.getElementById('contactoAsunto').value;
    const mensaje = document.getElementById('contactoMensaje').value;

    // Validar que no esté vacío
    if (!nombre || !email || !asunto || !mensaje) {
        mostrarMensajeContacto('Por favor completa todos los campos', 'error');
        return;
    }

    // Aquí puedes integrar con servicios como Formspree o EmailJS
    // Por ahora, solo mostramos un mensaje de éxito local
    
    console.log('Datos del contacto:', {
        nombre,
        email,
        asunto,
        mensaje,
        fecha: new Date().toLocaleString('es-ES')
    });

    mostrarMensajeContacto('¡Mensaje enviado exitosamente! Pronto nos pondremos en contacto contigo.', 'exito');
    
    // Limpiar formulario
    this.reset();

    // Opcional: Guardar en localStorage para referencia
    const contactos = JSON.parse(localStorage.getItem('contactos')) || [];
    contactos.push({
        nombre,
        email,
        asunto,
        mensaje,
        fecha: new Date().toLocaleString('es-ES')
    });
    localStorage.setItem('contactos', JSON.stringify(contactos));
});

function mostrarMensajeContacto(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensajeContacto');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = `mensaje-contacto ${tipo}`;
    
    // Desaparecer después de 5 segundos
    setTimeout(() => {
        mensajeDiv.textContent = '';
        mensajeDiv.className = '';
    }, 5000);
}

// ===== SUAVIZAR SCROLL EN NAVEGACIÓN =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FECHA MÍNIMA EN RESERVAS =====
document.addEventListener('DOMContentLoaded', function() {
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        // Establecer fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        fechaInput.min = today;
    }
});

// ===== ANIMACIÓN AL SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.servicio-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});
