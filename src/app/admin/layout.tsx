import AdminNavbar from '@/components/ui/adminNavbar';
import AdminFooter from '@/components/ui/adminFooter';
import Sidebar from '@/components/layout/admin/sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../globals.css";
import Providers from '@/app/providers';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <div className="flex h-screen">
                {/* Sidebar fijo */}
                <Sidebar />
                <div className="flex-grow flex flex-col">
                    <AdminNavbar />
                    <main className="flex-grow p-6 bg-whitedark overflow-y-auto overflow-x-auto dark:bg-darklight">
                        {children}
                    </main>
                    <AdminFooter />
                </div>
                <ToastContainer position="top-right" autoClose={1000} toastClassName="toast-custom" />
            </div>
        </Providers>
    );
}
