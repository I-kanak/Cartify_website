import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Cartify. - Store Dashboard",
    description: "Cartify. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
