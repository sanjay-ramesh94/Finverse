import Sidebar from "./Sidebar";
import BottomNavbar from "./BottomNavbar";
import PullToRefresh from "./PullToRefresh";

export default function AppShell({ children }) {
    return (
        <PullToRefresh>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 md:ml-16 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {children}
                    </div>
                </main>
                <BottomNavbar />
            </div>
        </PullToRefresh>
    );
}
