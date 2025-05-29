// Array para almacenar las citas (simulando una base de datos)
let citas = JSON.parse(localStorage.getItem('citas')) || [];

// Función para guardar citas en localStorage
function guardarCitas() {
    localStorage.setItem('citas', JSON.stringify(citas));
}

// Función para registrar una nueva cita
document.addEventListener('DOMContentLoaded', function() {
    const citaForm = document.getElementById('citaForm');
    
    if (citaForm) {
        citaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const servicio = document.getElementById('servicio').value;
            const barbero = document.getElementById('barbero').value;
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;
            const notas = document.getElementById('notas').value.trim();
            
            // Validar campos
            if (!nombre || !telefono || !servicio || !barbero || !fecha || !hora) {
                showMessage('Por favor complete todos los campos obligatorios', 'error');
                return;
            }
            
            // Validar fecha no sea pasada
            const fechaCita = new Date(`${fecha}T${hora}`);
            if (fechaCita < new Date()) {
                showMessage('No puede agendar citas en fechas pasadas', 'error');
                return;
            }
            
            // Crear objeto cita
            const nuevaCita = {
                id: Date.now().toString(),
                nombre,
                telefono,
                servicio,
                barbero,
                fecha,
                hora,
                notas,
                estado: 'pendiente',
                fechaRegistro: new Date().toISOString()
            };
            
            // Agregar a array de citas
            citas.push(nuevaCita);
            guardarCitas();
            
            // Mostrar mensaje y limpiar formulario
            showMessage('Cita agendada correctamente');
            citaForm.reset();
            
            // Redirigir a agenda (opcional)
            setTimeout(() => {
                window.location.href = 'agenda.html';
            }, 1500);
        });
    }
    
    // Cargar citas en la agenda
    const tablaCitas = document.getElementById('tablaCitas');
    if (tablaCitas) {
        cargarCitas();
        
        // Manejar filtros
        const aplicarFiltros = document.getElementById('aplicarFiltros');
        if (aplicarFiltros) {
            aplicarFiltros.addEventListener('click', cargarCitas);
        }
    }
    
    // Manejar edición de citas
    const editarCitaForm = document.getElementById('editarCitaForm');
    if (editarCitaForm) {
        // Obtener ID de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const citaId = urlParams.get('id');
        
        if (citaId) {
            cargarCitaParaEditar(citaId);
        }
        
        editarCitaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const id = document.getElementById('citaId').value;
            const nombre = document.getElementById('editNombre').value.trim();
            const telefono = document.getElementById('editTelefono').value.trim();
            const servicio = document.getElementById('editServicio').value;
            const barbero = document.getElementById('editBarbero').value;
            const fecha = document.getElementById('editFecha').value;
            const hora = document.getElementById('editHora').value;
            const notas = document.getElementById('editNotas').value.trim();
            const estado = document.getElementById('editEstado').value;
            
            // Validar campos
            if (!nombre || !telefono || !servicio || !barbero || !fecha || !hora) {
                showMessage('Por favor complete todos los campos obligatorios', 'error');
                return;
            }
            
            // Encontrar y actualizar cita
            const citaIndex = citas.findIndex(c => c.id === id);
            if (citaIndex !== -1) {
                citas[citaIndex] = {
                    ...citas[citaIndex],
                    nombre,
                    telefono,
                    servicio,
                    barbero,
                    fecha,
                    hora,
                    notas,
                    estado
                };
                
                guardarCitas();
                showMessage('Cita actualizada correctamente');
                
                // Redirigir a agenda
                setTimeout(() => {
                    window.location.href = 'agenda.html';
                }, 1500);
            }
        });
    }
});

// Función para cargar citas en la tabla
function cargarCitas() {
    const tbody = document.querySelector('#tablaCitas tbody');
    if (!tbody) return;
    
    // Obtener valores de filtros
    const filtroFecha = document.getElementById('filtroFecha').value;
    const filtroBarbero = document.getElementById('filtroBarbero').value;
    const filtroEstado = document.getElementById('filtroEstado').value;
    
    // Filtrar citas
    let citasFiltradas = [...citas];
    
    if (filtroFecha) {
        citasFiltradas = citasFiltradas.filter(c => c.fecha === filtroFecha);
    }
    
    if (filtroBarbero) {
        citasFiltradas = citasFiltradas.filter(c => c.barbero === filtroBarbero);
    }
    
    if (filtroEstado) {
        citasFiltradas = citasFiltradas.filter(c => c.estado === filtroEstado);
    }
    
    // Ordenar por fecha y hora (más recientes primero)
    citasFiltradas.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`);
        const fechaB = new Date(`${b.fecha}T${b.hora}`);
        return fechaA - fechaB;
    });
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Llenar tabla
    citasFiltradas.forEach(cita => {
        const tr = document.createElement('tr');
        
        // Determinar clase según estado
        if (cita.estado === 'completada') {
            tr.classList.add('completada');
        } else if (cita.estado === 'cancelada') {
            tr.classList.add('cancelada');
        }
        
        tr.innerHTML = `
            <td>${cita.nombre}</td>
            <td>${cita.telefono}</td>
            <td>${cita.servicio}</td>
            <td>${cita.barbero}</td>
            <td>${formatDate(cita.fecha)}</td>
            <td>${cita.hora}</td>
            <td>${cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}</td>
            <td class="acciones">
                <a href="editar.html?id=${cita.id}" class="btn">Editar</a>
                <button onclick="eliminarCita('${cita.id}')" class="btn cancelar">Eliminar</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Función para cargar cita en formulario de edición
function cargarCitaParaEditar(id) {
    const cita = citas.find(c => c.id === id);
    
    if (cita) {
        document.getElementById('citaId').value = cita.id;
        document.getElementById('editNombre').value = cita.nombre;
        document.getElementById('editTelefono').value = cita.telefono;
        document.getElementById('editServicio').value = cita.servicio;
        document.getElementById('editBarbero').value = cita.barbero;
        document.getElementById('editFecha').value = cita.fecha;
        document.getElementById('editHora').value = cita.hora;
        document.getElementById('editNotas').value = cita.notas || '';
        document.getElementById('editEstado').value = cita.estado;
    } else {
        showMessage('Cita no encontrada', 'error');
        setTimeout(() => {
            window.location.href = 'agenda.html';
        }, 1500);
    }
}

// Función para eliminar cita
function eliminarCita(id) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
        citas = citas.filter(c => c.id !== id);
        guardarCitas();
        showMessage('Cita eliminada correctamente');
        cargarCitas();
    }
}

// Hacer funciones disponibles globalmente
window.eliminarCita = eliminarCita;