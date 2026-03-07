export const initialStore = () => {
  return {
    contacts: [],
    isLoadingContacts: false,
    isSavingContact: false,
    deletingContactId: null,
    error: null
  };
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_loading_contacts":
      return {
        ...store,
        isLoadingContacts: action.payload
      };

    case "set_saving_contact":
      return {
        ...store,
        isSavingContact: action.payload
      };

    case "set_deleting_contact":
      return {
        ...store,
        deletingContactId: action.payload
      };

    case "set_error":
      return {
        ...store,
        error: action.payload
      };

    case "clear_error":
      return {
        ...store,
        error: null
      };

    case "assign_contacts":
      return {
        ...store,
        contacts: action.payload
      };

    case "delete_contact":
      return {
        ...store,
        contacts: store.contacts.filter((contact) => contact.id !== action.payload)
      };

    default:
      return store;
  }
}
