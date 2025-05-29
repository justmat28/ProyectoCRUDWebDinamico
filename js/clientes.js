// Array para almacenar clientes (simulando una base de datos)
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

// Función para guardar clientes en localStorage
function guardarClientes() {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

// Manejar formulario de clientes
document.addEventListener('DOMContentLoaded', function() {
    const clienteForm = document.getElementById('clienteForm');
    const tablaClientes = document.getElementById('tablaClientes');
    
    if (clienteForm) {
        // Cargar clientes en la tabla
        cargarClientes();
        
        // Manejar envío del formulario
        clienteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const id = document.getElementById('clienteId').value;
            const nombre = document.getElementById('clienteNombre').value.trim();
            const telefono = document.getElementById('clienteTelefono').value.trim();
            const email = document.getElementById('clienteEmail').value.trim();
            const frecuencia = document.getElementById('clienteFrecuencia').value || 0;
            const preferencias = document.getElementById('clientePreferencias').value.trim();
            
            // Validar campos obligatorios
            if (!nombre || !telefono) {
                showMessage('Nombre y teléfono son campos obligatorios', 'error');
                return;
            }
            
            // Validar email si se proporcionó
            if (email && !isValidEmail(email)) {
                showMessage('Por favor ingrese un email válido', 'error');
                return;
            }
            
            // Crear o actualizar cliente
            if (id) {
                // Modo edición
                const clienteIndex = clientes.findIndex(c => c.id === id);
                if (clienteIndex !== -1) {
                    clientes[clienteIndex] = {
                        ...clientes[clienteIndex],
                        nombre,
                        telefono,
                        email: email || '',
                        frecuencia: parseInt(frecuencia),
                        preferencias: preferencias || ''
                    };
                    
                    guardarClientes();
                    showMessage('Cliente actualizado correctamente');
                }
            } else {
                // Nuevo cliente
                const nuevoCliente = {
                    id: Date.now().toString(),
                    nombre,
                    telefono,
                    email: email || '',
                    frecuencia: parseInt(frecuencia),
                    preferencias: preferencias || '',
                    fechaRegistro: new Date().toISOString()
                };
                
                clientes.push(nuevoCliente);
                guardarClientes();
                showMessage('Cliente registrado correctamente');
            }
            
            // Limpiar formulario y recargar tabla
            clienteForm.reset();
            document.getElementById('clienteId').value = '';
            cargarClientes();
        });
    }
    
    // Manejar edición desde la tabla
    if (tablaClientes) {
        tablaClientes.addEventListener('click', function(e) {
            if (e.target.classList.contains('editar-cliente')) {
                e.preventDefault();
                const id = e.target.dataset.id;
                editarCliente(id);
            }
            
            if (e.target.classList.contains('eliminar-cliente')) {
                e.preventDefault();
                const id = e.target.dataset.id;
                eliminarCliente(id);
            }
        });
    }
});

// Función para cargar clientes en la tabla
function cargarClientes() {
    const tbody = document.querySelector('#tablaClientes tbody');
    if (!tbody) return;
    
    // Ordenar clientes por nombre
    clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    // Llenar tabla
    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.email || 'N/A'}</td>
            <td>${cliente.frecuencia}</td>
            <td class="acciones">
                <button class="btn editar-cliente" data-id="${cliente.id}">Editar</button>
                <button class="btn cancelar eliminar-cliente" data-id="${cliente.id}">Eliminar</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Función para cargar cliente en formulario para editar
function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    
    if (cliente) {
        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('clienteNombre').value = cliente.nombre;
        document.getElementById('clienteTelefono').value = cliente.telefono;
        document.getElementById('clienteEmail').value = cliente.email || '';
        document.getElementById('clienteFrecuencia').value = cliente.frecuencia || 0;
        document.getElementById('clientePreferencias').value = cliente.preferencias || '';
        
        // Hacer scroll al formulario
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para eliminar cliente
function eliminarCliente(id) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        clientes = clientes.filter(c => c.id !== id);
        guardarClientes();
        showMessage('Cliente eliminado correctamente');
        cargarClientes();
    }
}