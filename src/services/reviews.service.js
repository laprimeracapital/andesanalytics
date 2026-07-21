import { db } from "@/libs/supabase";

const STORAGE_BUCKET = "cv";

const sanitizeFileName = fileName => {
    return fileName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();
};

export async function uploadReviewFiles({files, candidateId, requestId}) {

    const uploadedAttachments = [];

    const candidateFolder = candidateId ?? "sin-candidato";

    for (const file of files) {

        const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";

        const safeName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));

        const uniqueName = `${crypto.randomUUID()}-${safeName}.${extension}`;

        const storagePath = `${candidateFolder}/${requestId}/${uniqueName}`;

        const { error } = await db.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, file, {
                contentType: "application/pdf",
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            throw error;
        }

        uploadedAttachments.push({
            original_name: file.name,
            storage_name: uniqueName,
            bucket: STORAGE_BUCKET,
            path: storagePath,
            mime_type: "application/pdf",
            size: file.size
        });
    }

    return uploadedAttachments;
}

export async function deleteReviewFiles(attachments = []) {

    if (!attachments.length) return;

    const paths = attachments.map(file => file.path);

    const { error } = await db.storage
        .from(STORAGE_BUCKET)
        .remove(paths);

    if (error) throw error;
}

export async function createReviewRequest(data) {

    const { error } = await db
        .from("electoral_review_requests")
        .insert(data);

    if (error) throw error;
}