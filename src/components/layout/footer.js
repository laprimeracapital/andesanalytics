import Link from "next/link";

export default function Footer () {
    return (
        <footer className="w-full bg-white border-t py-8">
            <div className="w m-auto flex flex-col gap-md justify-between text-center md:flex-row md:justify-between md:text-left lg:w" style={{"--w": "90%", "--w-lg": "60%"}}>
                <div className="flex flex-col items-start">
                    <p className="text-xl font-medium">Andes Analytics</p>
                    <p className="text-xs text-muted mt-1">Información electoral para una decisión ciudadana informada. </p>
                </div>
                <div className="flex items-center justify-center gap-md">
                    <Link href="/metodologia" className="text-xs text-muted">Metodología</Link>
                    <Link href="/privacidad" className="text-xs text-muted">Privacidad</Link>
                    <Link href="/fuentes" className="text-xs text-muted">Fuentes</Link>
                </div>
            </div>
        </footer>
    )
}