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

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'add_task':
      const { id, color } = action.payload
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    case 'assign_contacts': 
      return {
        ...store,
        contacts: action.payload // se llena el array con los datos de la API
      };

    case 'delete_contact':
    return {
        ...store,
        contacts: store.contacts.filter((c) => c.id !== action.payload)
    };

    default:
      return store; 
  }    
}