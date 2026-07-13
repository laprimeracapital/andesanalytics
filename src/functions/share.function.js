export const shareReferral = async () => {
    const url =
        `${window.location.origin}/pulso-ciudadano` +
        `?ref=${affinityResult.referral_code}` +
        `&utm_source=whatsapp` +
        `&utm_medium=referral` +
        `&utm_campaign=pulso_ciudadano`;

    const text = "Participa en Pulso Ciudadano Jauja y descubre qué planes de gobierno se acercan más a tus prioridades.";

    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`, "_blank");
};