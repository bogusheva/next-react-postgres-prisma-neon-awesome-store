export default function SignInLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex items-center h-screen">
            <main className="flex-1 wrapper">{children}</main>
        </div>
    );
}
