export const initialStore = () => {
  return {
    message: null,
    contacts: [], 
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null }
    ]
  }
}

// --- REDUCER: El interruptor que decide cómo cambiar los datos ---
export default function storeReducer(store, action = {}) {
  switch(action.type){
    // Caso para cambiar el color de una tarea 
    case 'add_task':
      const { id, color } = action.payload
      return {
        ...store,
        // Busco la tarea por ID y solo le cambio el color de fondo
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    // ---CARGAR CONTACTOS ---
    case 'assign_contacts': 
      return {
        ...store,
        // Sobreescribe el array vacío con los datos reales que llegan de la API
        contacts: action.payload 
      };

    // ---ELIMINAR CONTACTO ---
    case 'delete_contact':
      return {
        ...store,
        // Filtro el array: me quedo con todos MENOS con el ID que quiero borrar
        contacts: store.contacts.filter((c) => c.id !== action.payload)
      };

    default:
      return store; 
  }    
}