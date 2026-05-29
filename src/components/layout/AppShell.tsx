"use client";

import { useState } from "react";
import { AppHeader } from "./AppHeader"
import { AppSidebar } from "./AppSidebar";

type AppShellProps = {
    children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function toggleSidebar() {
        setSidebarOpen((current) => !current);
    }

    function closeSidebar() {
        setSidebarOpen(false);
    }

    return (
        <div className="app-shell">
            <AppHeader
                sidebarOpen={sidebarOpen}
                onMenuClick={toggleSidebar}
            />

            <div className="app-layout">
                <AppSidebar
                    isOpen={sidebarOpen}
                    onNavigate={closeSidebar}
                />

                <main className="app-main">{children}</main>
            </div>
        </div>
    );
}