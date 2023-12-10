import React, { useState, useEffect } from 'react';
import './App.css';

const ListaContactos = ({ contactos, onDelete, onEditar }) => (
  <ul>
    {contactos.map((contacto) => (
      <li key={contacto.id}>
        {contacto.nome} - {contacto.email} - {contacto.telefone}{' '}
        <button onClick={() => onEditar(contacto)} className='btn-editar'>Editar</button>
        <button onClick={() => onDelete(contacto.id)} className='btn-eliminar'>Eliminar</button>
      </li>
    ))}
  </ul>
);

const App = () => {
  const [contactos, setContactos] = useState([]);
  const [nuevoContacto, setNuevoContacto] = useState({ nome: '', email: '', telefone: '' });
  const [contactoEditando, setContactoEditando] = useState(null);

  useEffect(() => {
    // Obtenemos la lista de contactos desde el archivo JSON al cargar el componente
    fetch('https://gist.github.com/tiagoamaro/760ab6f7db0eac220a29ad55a40ff1bd', {
      method: "GET"
    }) // Ajusta la ruta según la ubicación de tu archivo JSON
      .then((response) => response.json())
      .then((data) => setContactos(data.contatos))
      .catch((error) => console.error('Error al obtener contactos:', error));
  }, []);

  const handleAgregarContacto = () => {
    if (nuevoContacto.nome && nuevoContacto.email && nuevoContacto.telefone) {
      if (contactoEditando) {
        // Si estamos editando, actualizamos el contacto existente
        setContactos(
          contactos.map((c) =>
            c.id === contactoEditando.id ? { ...c, ...nuevoContacto } : c
          )
        );
        setContactoEditando(null);
      } else {
        // Si no estamos editando, agregamos un nuevo contacto
        setContactos([...contactos, { id: Date.now(), ...nuevoContacto }]);
      }

      setNuevoContacto({ nome: '', email: '', telefone: '' });
    }
  };

  const handleEliminarContacto = (id) => {
    setContactos(contactos.filter((contacto) => contacto.id !== id));
  };

  const handleEditarContacto = (contacto) => {
    // Poner los detalles del contacto a editar en el formulario
    setNuevoContacto({ nome: contacto.nome, email: contacto.email, telefone: contacto.telefone });
    setContactoEditando(contacto);
  };

  const handleOrdenarAlfabeticamente = () => {
    const contactosOrdenados = [...contactos].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );
    setContactos(contactosOrdenados);
  };

  return (
    <div className="App">
      <h1>Lista de Contactos</h1>
      <div className='lista-contactos'>
        <label>
          Nombre:
          <input
            type="text"
            value={nuevoContacto.nome}
            onChange={(e) => setNuevoContacto({ ...nuevoContacto, nome: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            value={nuevoContacto.email}
            onChange={(e) => setNuevoContacto({ ...nuevoContacto, email: e.target.value })}
          />
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            value={nuevoContacto.telefone}
            onChange={(e) => setNuevoContacto({ ...nuevoContacto, telefone: e.target.value })}
          />
        </label>
        <button onClick={handleAgregarContacto} className='btn-agregar'>
          {contactoEditando ? 'Guardar Cambios' : 'Agregar'}
        </button>
        {contactoEditando && (
          <button onClick={() => setContactoEditando(null)} className='btn-cancelar'>
            Cancelar Edición
          </button>
        )}
      </div>
      <div>
        <button onClick={handleOrdenarAlfabeticamente} className='btn-ordenar'>Ordenar alfabéticamente</button>
      </div>
      <ListaContactos contactos={contactos} onEditar={handleEditarContacto} onDelete={handleEliminarContacto} />
    </div>
  );
};

export default App;
