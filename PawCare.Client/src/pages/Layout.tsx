import { Outlet } from "react-router-dom";
import { Navbar } from './Navbar'
// import type { ReactNode } from 'react'

// interface LayoutProps {
//   children: ReactNode
// }

// export function Layout({ children }: LayoutProps) {
//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <main className="container mx-auto px-4 py-8">
//         {children}
//       </main>
//     </div>
//   )
// }

export function Layout() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}