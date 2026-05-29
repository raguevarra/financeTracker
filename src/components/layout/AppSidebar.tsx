import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Accounts", href: "/accounts" },
    { label: "Transactions", href: "/transactions" },
    { label: "Bills", href: "/bills" },
    { label: "Household", href: "/household" },
    { label: "Settings", href: "/settings" },
];

type AppSidebarProps = {
    isOpen: boolean;
    onNavigate: () => void;
};

export function AppSidebar({
    isOpen,
    onNavigate,
}: AppSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
            <nav className="app-nav" aria-label="Main navigation">
                {navItems.map((item) => {
                    const isActive = 
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`app-nav-link ${isActive ? "active" : ""}`}
                            onClick={onNavigate}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}