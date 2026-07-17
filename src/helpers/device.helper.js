import { VOTING_SALT } from "@/config";

const DEVICE_KEY = "andes_voting_device_id";

export function getVotingDeviceId() {
    if (typeof window === "undefined") return null;

    let deviceId = localStorage.getItem(DEVICE_KEY);

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem(DEVICE_KEY, deviceId);
    }

    return deviceId;
}

export async function createDeviceHash(deviceId) {
    const data = new TextEncoder().encode(`${deviceId}:${VOTING_SALT}`);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}