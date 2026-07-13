export const formatDate = (value) => {
    if (!value) return "No disponible";

    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date(value));
};

export const calculateAge = (birthDate) => {
    if (!birthDate) return null;

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDifference =
        today.getMonth() - birth.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birth.getDate()
        )
    ) {
        age--;
    }

    return age;
};

export const getGenderLabel = (gender) => {
    const labels = {
        M: "Masculino",
        F: "Femenino"
    };

    return labels[gender] || "No especificado";
};

export const getStatusClass = (status) => {
    const normalized = status?.toLowerCase();

    if (normalized === "admitido") {
        return "badge badge--success";
    }

    if (normalized === "inadmisible") {
        return "badge badge-warning";
    }

    return "badge badge-secondary";
};