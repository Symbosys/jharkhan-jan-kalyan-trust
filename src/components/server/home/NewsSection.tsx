import { getAllNews } from "@/actions/news";
import { NewsTicker } from "@/components/client/home/NewsTicker";

export async function NewsSection() {
    try {
        const newsData = await getAllNews({ limit: 50 });
        const news = newsData?.news || [];

        const simplifiedNews = news.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            link: item.link
        }));

        // We render it even if empty so the user sees the "News Section" container
        return <NewsTicker news={simplifiedNews} />;
    } catch (error) {
        console.error("News Section render error:", error);
        // Fallback to empty news ticker so site doesn't crash
        return <NewsTicker news={[]} />;
    }
}
