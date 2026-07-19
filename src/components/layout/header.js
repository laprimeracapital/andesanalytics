'use client'
import { getReferralCode } from "@/helpers/analytics.helper";
import { IconBrandFacebook, IconBrandLinkedin, IconBrandTelegram, IconBrandWhatsapp, IconBrandX, IconMail, IconShare3, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

function buildReferralUrl(source, referralCode, path) { 
    const params = new URLSearchParams({ 
        ref: referralCode, 
        utm_source: source, 
        utm_medium: 'referral', 
        utm_campaign: 'pulso_ciudadano', 
    });
    const url = path === '/' ? `${window.location.origin}/?${params.toString()}` : `${window.location.origin}/pulso-ciudadano?${params.toString()}`
    return url; 
}

export default function Header () {

    const pathname = usePathname();

    const dialogRef = useRef(null);

    const openDialog = () => dialogRef.current?.showModal();

    const closeDialog = () => dialogRef.current?.close();
    
    const SHARE_TEXT = pathname === '/' ? 'Descubre qué planes de gobierno se acercan más a tus prioridades.' : 'Participa en Pulso Ciudadano Jauja y descubre qué planes de gobierno se acercan más a tus prioridades.';

    const shareOnWhatsapp = () => { 
        const code = getReferralCode(); 
        const url = buildReferralUrl('whatsapp', code, pathname); 
        const message = `${SHARE_TEXT}\n\n${url}`; 
        window.open( `https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer' ); 
    };

    const shareOnFacebook = () => { 
        const code = getReferralCode(); 
        const url = buildReferralUrl('facebook', code, pathname); 
        window.open( `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer' ); 
    };

    const shareOnTelegram = () => {
        const code = getReferralCode();
        const url = buildReferralUrl('telegram', code, pathname);

        const shareUrl =
            `https://t.me/share/url` +
            `?url=${encodeURIComponent(url)}` +
            `&text=${encodeURIComponent(SHARE_TEXT)}`;

        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    const shareOnX = () => {
        const code = getReferralCode();
        const url = buildReferralUrl('x', code, pathname);
        const shareUrl = `https://x.com/intent/tweet` + `?text=${encodeURIComponent(SHARE_TEXT)}` + `&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
    };

    const shareOnLinkedIn = () => {
        const code = getReferralCode();
        const url = buildReferralUrl('linkedin', code, pathname);
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/` + `?url=${encodeURIComponent(url)}`;
        window.open(shareUrl,'_blank','noopener,noreferrer');
    };

    const shareByEmail = () => {
        const code = getReferralCode();
        const url = buildReferralUrl('email', code, pathname);

        const subject = 'Participa en Pulso Ciudadano Jauja';
        const body = `${SHARE_TEXT}\n\n${url}`;

        window.location.href =
            `mailto:` +
            `?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;
    };

    const copyReferralUrl = async () => { 
        const code = getReferralCode(); 
        const url = buildReferralUrl('copy_link', code, pathname); 
        try { 
            await navigator.clipboard.writeText(url);  
            toast.success('Se copio el enlace correctamente.')
            closeDialog();
        } catch (error) { 
            console.error( 'No se pudo copiar el enlace:', error ); 
        }
    };

    const shareNative = async () => {
        const code = getReferralCode();
        const url = buildReferralUrl('native_share', code, pathname);

        const shareData = {
            title: 'Pulso Ciudadano Jauja',
            text: SHARE_TEXT,
            url,
        };

        if (!navigator.share) {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            return;
        }

        try {
            await navigator.share(shareData);
        } catch (error) {
            if (error?.name !== 'AbortError') {
                console.error('No se pudo compartir:', error);
            }
        }
    };

    const title = {
        '/': '',
        '/pulso-ciudadano': '| Pulso Ciudadano',
        '/candidates/*': 'Candidato'
    }

    return (
        <>
            
            <header className="w-full h-16 bg-white border-b">
                <div className="w m-auto h-full flex items-center justify-between lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                    <Link href="/" className="text-lg font-medium">Andes Analytics {pathname === '/' ? '' : ( <span className="text-xs">{title[pathname]}</span> )}</Link>
                    <button type="button" className="btn btn-lg btn-primary" onClick={openDialog}>Compartir</button>
                </div>
            </header>

            <dialog ref={dialogRef} className="w modal p-4 rounded-md lg:w" style={{"--w": "90%", "--w-lg": "30%"}}>
                <div className="modal-box flex flex-col gap-md">
                    <div className="w-full flex items-center justify-between">
                        <h3 className="text-lg font-bold">Compartir</h3>
                        <button type="button" className="btn--icon" onClick={closeDialog}><IconX/></button>
                    </div>
                    <div className="w-full flex gap-sm flex-wrap justify-center">
                        <button type="button" className="btn--icon btn--lg" onClick={shareOnFacebook}><IconBrandFacebook strokeWidth={1.2}/></button>
                        <button type="button" className="btn--icon btn--lg" onClick={shareOnWhatsapp}><IconBrandWhatsapp strokeWidth={1.2}/></button>
                        <button type="button" className="btn--icon btn--lg" onClick={shareOnX}><IconBrandX strokeWidth={1.2}/></button>
                        <button type="button" className="btn--icon btn--lg" onClick={shareOnTelegram}><IconBrandTelegram strokeWidth={1.2}/></button>
                        <button type="button" className="btn--icon btn--lg" onClick={shareOnLinkedIn}><IconBrandLinkedin strokeWidth={1.2}/></button>
                        <button type="button" className="btn--icon btn--lg" onClick={shareByEmail}><IconMail strokeWidth={1.2}/></button>
                        <button type="button" className="btn--icon btn--lg" onClick={shareNative}><IconShare3 strokeWidth={1.2}/></button>
                    </div>

                    <div className="w-full flex gap-sm">
                        <input type="text" value={typeof window !== 'undefined' ? window.location.href: ''} readOnly className="input input-bordered w-full text-xs"/>
                        <button type="button" className="btn btn-primary" onClick={copyReferralUrl}>Copiar enlace</button>
                    </div>
                </div>
            </dialog>
        </>
    )

}