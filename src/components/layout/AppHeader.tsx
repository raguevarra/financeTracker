import {
    Show,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs"

type AppHeaderProps = {
    sidebarOpen: boolean;
    onMenuClick: () => void;
};

export function AppHeader({
    sidebarOpen,
    onMenuClick,
}: AppHeaderProps) {
    return (
        <header className="app-header">
            <div className="app-header-left">
                <button
                    type="button"
                    className="menu-button"
                    onClick={onMenuClick}
                    aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={sidebarOpen}
                >
                    {sidebarOpen ? "×" : "☰"}
                </button>

                <h1>Finance Tracker</h1>
            </div>

            <div className="auth-controls">
                <Show when="signed-out">
                    <SignInButton />
                    <SignUpButton />
                </Show>

                <Show when="signed-in">
                    <UserButton />
                </Show>
            </div>
        </header>
    );
}