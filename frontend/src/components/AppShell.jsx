import Sidebar from "./Sidebar";
import BottomNavbar from "./BottomNavbar";

export default function AppShell({ children }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-16 pb-20 md:pb-0 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
            <BottomNavbar />
        </div>
    );
}
