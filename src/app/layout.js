import { Poppins } from "next/font/google";
import '@/assets/global.css'
import { DBProvider } from "@/context/DBContext";

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    variable: "--font-base"
})

export const metadata = {
    title: 'Andes Analytics'
}

export default function RootLayout ({ children }) {
    return (
        <html lang="es" className={`${poppins.variable}`}>
            <body>
                <DBProvider>
                    {children}
                </DBProvider>
            </body>
        </html>
    )
}