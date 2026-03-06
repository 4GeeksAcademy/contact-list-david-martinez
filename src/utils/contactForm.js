export const EMPTY_CONTACT = {
    name: "",
    email: "",
    phone: "",
    address: "",
};

// Normalizing once keeps validation and API payloads consistent in add/edit flows.
export function normalizeContact(values = EMPTY_CONTACT) {
    return {
        name: values.name?.trim() ?? "",
        email: values.email?.trim() ?? "",
        phone: values.phone?.trim() ?? "",
        address: values.address?.trim() ?? "",
    };
}

export function validateContact(values) {
    const errors = {};

    if (!values.name) {
        errors.name = "Name is required.";
    }

    if (!values.email) {
        errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Enter a valid email.";
    }

    if (!values.phone) {
        errors.phone = "Phone is required.";
    }

    if (!values.address) {
        errors.address = "Address is required.";
    }

    return errors;
}
