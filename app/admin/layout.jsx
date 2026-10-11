import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Cartify. - Admin",
    description: "Cartify. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
