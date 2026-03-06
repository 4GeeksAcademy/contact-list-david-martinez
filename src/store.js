export const initialStore = () => {
  return {
    // Keep the global state focused on contacts instead of carrying template leftovers.
    contacts: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "assign_contacts":
      return {
        ...store,
        contacts: action.payload,
      };

    case "delete_contact":
      return {
        ...store,
        contacts: store.contacts.filter((contact) => contact.id !== action.payload),
      };

    default:
      return store;
  }
}
