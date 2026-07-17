import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

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
    const queryClient = useQueryClient();

    const handleLogout = () => {
        logout();
        queryClient.clear();
        navigate("/login");
    };

    const initials = user
        ? `${user.givenName?.[0] || ""}${user.familyName?.[0] || ""}`.toUpperCase()
        : "U";
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link
                    to="/"
                    className="text-xl font-bold text-primary"
                >
                    PawCare
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    {user && navLinks.map(({ to, label }) => (
                        <Link
                            key={label}
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
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={buttonVariants({ variant: "ghost" })}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className={buttonVariants({ variant: "default" })}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}