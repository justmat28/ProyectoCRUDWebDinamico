// Función para inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación iniciada');
    
    // Aquí puedes agregar código que se ejecute en todas las páginas
    // Por ejemplo, manejar el menú activo
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Código específico para la página de inicio
    if (currentPage === 'index.html') {
        // Puedes agregar funcionalidades específicas para la página de inicio aquí
    }
    
    // Código específico para la página Nosotros
    if (currentPage === 'nosotros.html') {
        // Puedes agregar funcionalidades específicas para la página Nosotros aquí
    }
});

// Función para mostrar mensajes al usuario
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Función para validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para validar teléfono (ejemplo simple)
function isValidPhone(phone) {
    return /^\d{9,15}$/.test(phone);
}

// Función para formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}