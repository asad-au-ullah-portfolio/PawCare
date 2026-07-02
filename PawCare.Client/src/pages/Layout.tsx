import { Outlet } from "react-router-dom";
import { Navbar } from './Navbar'

export function Layout() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <Outlet />
        </div>
    );
}