import { useCallback, useContext, useMemo, useReducer, createContext } from "react";
import PropTypes from "prop-types";
import storeReducer, { initialStore } from "../store";
import { AGENDA_ENDPOINT, AGENDA_SLUG, CONTACTS_ENDPOINT } from "../config";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());

    const ensureAgendaExists = useCallback(async () => {
        const response = await fetch(AGENDA_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok && ![400, 409].includes(response.status)) {
            throw new Error(await getApiErrorMessage(response, "Unable to verify agenda."));
        }
    }, []);

    const loadContacts = useCallback(async () => {
        dispatch({ type: "set_loading_contacts", payload: true });
        dispatch({ type: "clear_error" });

        try {
            await ensureAgendaExists();

            const response = await fetch(AGENDA_ENDPOINT);
            if (!response.ok) {
                throw new Error(await getApiErrorMessage(response, "Unable to load contacts."));
            }

            const data = await response.json();
            const contacts = Array.isArray(data.contacts)
                ? data.contacts.map(normalizeContact)
                : [];

            dispatch({ type: "assign_contacts", payload: contacts });
            return contacts;
        } catch (error) {
            dispatch({ type: "set_error", payload: error.message });
            return [];
        } finally {
            dispatch({ type: "set_loading_contacts", payload: false });
        }
    }, [ensureAgendaExists]);

    const findContactById = useCallback(async (contactId) => {
        const parsedId = Number(contactId);
        const cachedContact = store.contacts.find((contact) => contact.id === parsedId);

        if (cachedContact) {
            return cachedContact;
        }

        const contacts = await loadContacts();
        return contacts.find((contact) => contact.id === parsedId) || null;
    }, [loadContacts, store.contacts]);

    const saveContact = useCallback(async (contact, contactId = null) => {
        dispatch({ type: "set_saving_contact", payload: true });
        dispatch({ type: "clear_error" });

        try {
            await ensureAgendaExists();

            const endpoint = contactId
                ? `${CONTACTS_ENDPOINT}/${contactId}`
                : CONTACTS_ENDPOINT;
            const method = contactId ? "PUT" : "POST";
            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildContactPayload(contact))
            });

            if (!response.ok) {
                throw new Error(await getApiErrorMessage(response, "Unable to save contact."));
            }

            await loadContacts();
            return true;
        } catch (error) {
            dispatch({ type: "set_error", payload: error.message });
            return false;
        } finally {
            dispatch({ type: "set_saving_contact", payload: false });
        }
    }, [ensureAgendaExists, loadContacts]);

    const deleteContact = useCallback(async (contactId) => {
        dispatch({ type: "set_deleting_contact", payload: contactId });
        dispatch({ type: "clear_error" });

        try {
            const response = await fetch(`${CONTACTS_ENDPOINT}/${contactId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(await getApiErrorMessage(response, "Unable to delete contact."));
            }

            dispatch({ type: "delete_contact", payload: contactId });
            return true;
        } catch (error) {
            dispatch({ type: "set_error", payload: error.message });
            return false;
        } finally {
            dispatch({ type: "set_deleting_contact", payload: null });
        }
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: "clear_error" });
    }, []);

    const actions = useMemo(() => ({
        clearError,
        deleteContact,
        findContactById,
        loadContacts,
        saveContact
    }), [clearError, deleteContact, findContactById, loadContacts, saveContact]);

    return (
        <StoreContext.Provider value={{ actions, dispatch, store }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const { actions, dispatch, store } = useContext(StoreContext);
    return { actions, dispatch, store };
}

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired
};

function normalizeContact(contact = {}) {
    return {
        id: contact.id,
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        address: contact.address || "",
        image_url: contact.image_url || ""
    };
}

function buildContactPayload(contact) {
    return {
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        address: contact.address.trim(),
        agenda_slug: AGENDA_SLUG
    };
}

async function getApiErrorMessage(response, fallbackMessage) {
    try {
        const payload = await response.json();
        if (payload?.msg) return payload.msg;
        if (payload?.message) return payload.message;
    } catch {
        return fallbackMessage;
    }

    return fallbackMessage;
}
