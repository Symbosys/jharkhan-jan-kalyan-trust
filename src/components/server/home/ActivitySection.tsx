import { getAllActivities } from "@/actions/activity";
import { ActivitySlider } from "@/components/client/home/ActivitySlider";

export async function ActivitySection() {
    const { activities } = await getAllActivities({ limit: 50 });

    if (!activities || activities.length === 0) return null;

    return <ActivitySlider activities={activities as any} />;
}
