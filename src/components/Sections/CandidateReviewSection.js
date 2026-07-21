'use client';

import { createReviewRequest, deleteReviewFiles, uploadReviewFiles } from "@/services/reviews.service";
import { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const STORAGE_BUCKET = "cv";

const initialForm = {
    candidate_name: "",
    political_organization: "",
    sender_name: "",
    sender_role: "",
    email: "",
    phone: "",
    review_details: "",
    consent: false
};

const sanitizeFileName = fileName => {
    return fileName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();
};

export default function CandidateReviewSection({ candidateId = null, listId = null, candidateName = "", politicalOrganization = "" }) {

    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        ...initialForm,
        candidate_name: candidateName,
        political_organization: politicalOrganization
    });

    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    const isLoading = status === "loading";

    const handleChange = event => {
        const { name, value, type, checked } = event.target;

        setForm(current => ({
            ...current,
            [name]: type === "checkbox" ? checked : value
        }));

        setMessage("");
    };

    const validatePdf = file => {
        const isPdf =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            return `${file.name} no es un archivo PDF válido.`;
        }

        if (file.size > MAX_FILE_SIZE) {
            return `${file.name} supera el tamaño máximo de 10 MB.`;
        }

        return null;
    };

    const handleFilesChange = event => {
        const selectedFiles = Array.from(event.target.files ?? []);

        setFileError("");
        setMessage("");

        if (selectedFiles.length === 0) return;

        const availableSlots = MAX_FILES - files.length;

        if (availableSlots <= 0) {
            setFileError(`Solo puedes adjuntar un máximo de ${MAX_FILES} archivos.`);
            event.target.value = "";
            return;
        }

        if (selectedFiles.length > availableSlots) {
            setFileError(
                `Puedes agregar únicamente ${availableSlots} archivo${
                    availableSlots === 1 ? "" : "s"
                } más.`
            );

            event.target.value = "";
            return;
        }

        for (const file of selectedFiles) {
            const validationError = validatePdf(file);

            if (validationError) {
                setFileError(validationError);
                event.target.value = "";
                return;
            }
        }

        const duplicatedFile = selectedFiles.find(selectedFile =>
            files.some(
                currentFile =>
                    currentFile.name === selectedFile.name &&
                    currentFile.size === selectedFile.size
            )
        );

        if (duplicatedFile) {
            setFileError(`${duplicatedFile.name} ya fue seleccionado.`);
            event.target.value = "";
            return;
        }

        setFiles(current => [...current, ...selectedFiles]);
        event.target.value = "";
    };

    const removeFile = indexToRemove => {
        setFiles(current =>
            current.filter((_, index) => index !== indexToRemove)
        );

        setFileError("");
        setMessage("");
    };

    const clearFiles = () => {
        setFiles([]);
        setFileError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async event => {

        event.preventDefault();

        setMessage("");
        setFileError("");

        if (files.length === 0) return toast.warning("Adjunta al menos un documento PDF.");

        if (!form.consent)  return toast.warning("Debes aceptar la declaración de veracidad.");

        let attachments = [];

        try {

            setStatus("loading");

            const requestId = crypto.randomUUID();

            attachments = await uploadReviewFiles({
                files,
                candidateId,
                requestId
            });

            await createReviewRequest({
                id: requestId,

                id_candidate: candidateId,
                id_list: listId,

                candidate_name: form.candidate_name.trim(),
                political_organization:
                    form.political_organization.trim() || null,

                sender_name: form.sender_name.trim(),
                sender_role: form.sender_role.trim(),

                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim() || null,

                review_details: form.review_details.trim(),

                attachments,

                status: "pending"
            });

            setStatus("success");

            setMessage(
                "La solicitud fue enviada correctamente."
            );

            setForm({
                ...initialForm,
                candidate_name: candidateName,
                political_organization: politicalOrganization
            });

            clearFiles();

        } catch (error) {

            await deleteReviewFiles(attachments);

            setStatus("error");

            setMessage(error.message);
            toast.error(error.message)

        }

    };

    return (
        <section className="w-full bg-surface py-16" id="revision-candidato">
            <div className="w m-auto lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                <div className="w-full grid grid-cols-1 gap-lg lg:grid-cols-2">

                    <div className="flex flex-col justify-center gap-md">
                        <div>
                            <p className="label text-primary">Actualización documental</p>
                            <h2 className="text-2xl mt-2">¿Eres candidato o formas parte de su equipo?</h2>
                        </div>

                        <p className="text-sm text-muted leading-normal">
                            Puedes enviarnos tu hoja de vida, documentos de
                            experiencia, estudios, especializaciones u otra
                            información verificable para solicitar una nueva
                            revisión del perfil publicado.
                        </p>

                        <div className="card card-compact">
                            <h3 className="text-sm font-medium">
                                Revisión bajo criterios técnicos
                            </h3>

                            <p className="text-xs text-muted leading-normal mt-2">
                                La recepción de documentos no garantiza una
                                modificación del análisis o del puntaje. Toda la
                                información será evaluada bajo la misma metodología
                                aplicada a los demás candidatos.
                            </p>
                        </div>

                        <p className="text-xs text-muted leading-normal">
                            También puedes solicitar la corrección de nombres,
                            cargos, estudios, fechas u otros datos objetivos que
                            puedan verificarse documentalmente.
                        </p>
                    </div>

                    <form className="card flex flex-col gap-md" onSubmit={handleSubmit}>
                        <div>
                            <h3 className="text-lg font-medium">Solicitar actualización del perfil</h3>
                            <p className="text-xs text-muted mt-1">Los campos marcados con * son obligatorios.</p>
                        </div>

                        <div className="w-full grid grid-cols-1 gap-md md:grid-cols-2">

                            <div className="flex flex-col gap-xs">
                                <label className="text-xs font-medium" htmlFor="candidate_name">Nombre del candidato *</label>
                                <input id="candidate_name" name="candidate_name" type="text" className="input" maxLength={200} value={form.candidate_name} onChange={handleChange} disabled={isLoading} required/>
                            </div>

                            <div className="flex flex-col gap-xs">
                                <label className="text-xs font-medium" htmlFor="political_organization">Organización política</label>
                                <input id="political_organization" name="political_organization" type="text" className="input" maxLength={200} value={form.political_organization} onChange={handleChange} disabled={isLoading}/>
                            </div>

                            <div className="flex flex-col gap-xs">
                                <label className="text-xs font-medium" htmlFor="sender_name">Nombre del remitente *</label>
                                <input id="sender_name" name="sender_name" type="text" className="input" maxLength={200} value={form.sender_name} onChange={handleChange} disabled={isLoading} required/>
                            </div>

                            <div className="flex flex-col gap-xs">
                                <label className="text-xs font-medium" htmlFor="sender_role">Cargo o relación con el candidato *</label>
                                <input id="sender_role" name="sender_role" type="text" className="input" maxLength={150} placeholder="Candidato, personero, equipo técnico..." value={form.sender_role} onChange={handleChange} disabled={isLoading} required/>
                            </div>

                            <div className="flex flex-col gap-xs">
                                <label className="text-xs font-medium" htmlFor="email">Correo electrónico *</label>
                                <input id="email" name="email" type="email" className="input" maxLength={200} value={form.email} onChange={handleChange} disabled={isLoading} required/>
                            </div>

                            <div className="flex flex-col gap-xs">
                                <label className="text-xs font-medium" htmlFor="phone">Teléfono</label>
                                <input id="phone" name="phone" type="tel" inputMode="tel" className="input" maxLength={50} value={form.phone} onChange={handleChange} disabled={isLoading}/>
                            </div>
                        </div>

                        <div className="flex flex-col gap-xs">
                            <label className="text-xs font-medium" htmlFor="review_details">Información que deseas corregir o complementar *</label>
                            <textarea id="review_details" name="review_details" className="textarea min-h-32" maxLength={3000} placeholder="Describe los datos que deben revisarse e indica qué documentos los sustentan." value={form.review_details} onChange={handleChange} disabled={isLoading} required/>
                            <p className="text-xs text-muted text-right">{form.review_details.length}/3000</p>
                        </div>

                        <div className="flex flex-col gap-sm">
                            <div className="flex items-center justify-between gap-md">
                                <label
                                    className="text-xs font-medium"
                                    htmlFor="candidate_documents"
                                >
                                    Documentación sustentatoria *
                                </label>

                                <span className="text-xs text-muted">
                                    {files.length}/{MAX_FILES}
                                </span>
                            </div>

                            <label htmlFor="candidate_documents" className={`card card-compact border border-dashed text-center ${isLoading || files.length >= MAX_FILES ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
                                <input ref={fileInputRef} id="candidate_documents" name="candidate_documents" type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={handleFilesChange} disabled={isLoading || files.length >= MAX_FILES}/>
                                <div className="flex flex-col items-center gap-xs">
                                    <p className="text-sm font-medium">{files.length >= MAX_FILES ? "Límite de archivos alcanzado" : "Seleccionar archivos PDF"}</p>
                                    <p className="text-xs text-muted">Máximo 5 archivos · Hasta 10 MB por archivo</p>
                                </div>
                            </label>

                            {files.length > 0 && (
                                <div className="flex flex-col gap-xs">
                                    {files.map((file, index) => (
                                        <article key={`${file.name}-${file.size}-${index}`} className="card card-compact items-center justify-between gap-md">
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium truncate">
                                                    {file.name}
                                                </p>

                                                <p className="text-xs text-muted mt-1">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => removeFile(index)}
                                                disabled={isLoading}
                                            >
                                                Quitar
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            )}

                            {fileError && (
                                <p
                                    className="text-xs text-danger leading-normal"
                                    role="alert"
                                >
                                    {fileError}
                                </p>
                            )}
                        </div>

                        <label className="flex items-start gap-sm cursor-pointer">
                            <input
                                name="consent"
                                type="checkbox"
                                checked={form.consent}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />

                            <span className="text-xs text-muted leading-normal">
                                Declaro que la información y los documentos
                                enviados son auténticos y autorizo su revisión
                                para verificar y actualizar el análisis electoral
                                publicado.
                            </span>
                        </label>

                        {message && (
                            <div
                                className={`card card-compact ${
                                    status === "success"
                                        ? "text-success"
                                        : "text-danger"
                                }`}
                                role="alert"
                            >
                                <p className="text-xs leading-normal">
                                    {message}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Enviando documentación..."
                                : "Solicitar actualización del perfil"}
                        </button>

                        <p className="text-xs text-muted text-center leading-normal">
                            Los documentos serán almacenados de forma segura y
                            utilizados únicamente para verificar la información
                            electoral presentada.
                        </p>
                    </form>

                </div>
            </div>
        </section>
    );

}