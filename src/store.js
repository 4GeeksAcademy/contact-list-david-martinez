export const initialStore = () => {
  return {
    contacts: [],
    isLoading: false,
    isSaving: false,
    error: null
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_loading':
      return { ...store, isLoading: action.payload };
    case 'set_saving':
      return { ...store, isSaving: action.payload };
    case 'assign_contacts': 
    // Guarda los contactos de la API y quita el estado de carga
      return { ...store, contacts: action.payload, isLoading: false };
    case 'delete_contact':
      // Filtra el array para eliminar el contacto visualmente sin recargar la página
      return {
        ...store,
        contacts: store.contacts.filter((c) => c.id !== action.payload)
      };
    default:
      return store; 
  }    
}