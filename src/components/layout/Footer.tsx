export async function Footer() {
    "use cache";
    const year = new Date().getFullYear();

    return (
        <footer className="bg-background border-t border-secondary/20 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
                <p>&copy; {year} Jan Kalyan NGO. All rights reserved.</p>
            </div>
        </footer>
    );
}
