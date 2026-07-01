import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/pets", label: "My Pets" },
    { to: "/veterinarians", label: "Veterinarians" },
    { to: "/appointments", label: "Appointments" },
];

export function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const initials =
        user?.email?.substring(0, 2).toUpperCase() ?? "PC";

    return (
        <header className="border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link
                    to="/dashboard"
                    className="text-xl font-bold text-primary"
                >
                    PawCare
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            to={to}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-foreground",
                                location.pathname.startsWith(to)
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {label}
                        </Link>
                        // <Link to={to} key={to}>
                        //     <Button variant="ghost">
                        //         {label}
                        //     </Button>
                        // </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <Separator
                        orientation="vertical"
                        className="hidden h-6 md:block"
                    />

                    <Avatar className="h-9 w-9">
                        <AvatarFallback>
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="hidden md:block text-sm text-muted-foreground">
                        {user?.email}
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Sign out
                    </Button>
                </div>
            </div>
        </header>
    );
}