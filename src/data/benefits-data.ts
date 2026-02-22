import {
    Activity,
    BookOpen,
    TrendingUp,
    Utensils,
    Heart,
    Wind,
    Trees,
    type LucideIcon,
} from "lucide-react";

export interface BenefitStat {
    label: string;
    value: string;
}

export interface Benefit {
    slug: string;
    title: string;
    englishTitle: string;
    description: string;
    longDescription: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    gradient: string;
    highlights: string[];
    stats: BenefitStat[];
}

export const benefits: Benefit[] = [
    {
        slug: "health-camps",
        title: "Health Camps",
        englishTitle: "Health Camps",
        description:
            "Organizing regular medical checkups and health awareness programs for the community.",
        longDescription:
            "Jharkhand Jan Kalyan Trust organizes comprehensive health camps across rural and semi-urban areas of Jharkhand. These camps provide free medical checkups, diagnostic services, and medicine distribution to underserved communities. Our team of volunteer doctors and healthcare professionals conduct specialized screenings for diabetes, hypertension, eye care, and dental health. We also run health awareness drives covering topics like sanitation, nutrition, maternal health, and disease prevention, ensuring communities are empowered with the knowledge to lead healthier lives.",
        icon: Activity,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        gradient: "from-blue-500 to-cyan-500",
        highlights: [
            "Free medical checkups and diagnostic screenings",
            "Medicine and first-aid distribution at no cost",
            "Specialized camps for eye, dental, and maternal health",
            "Health awareness workshops in remote villages",
            "Partnerships with local hospitals and clinics",
            "Regular follow-up visits for chronic conditions",
        ],
        stats: [
            { label: "Camps Organized", value: "120+" },
            { label: "People Treated", value: "15,000+" },
            { label: "Doctors Volunteered", value: "200+" },
            { label: "Villages Covered", value: "50+" },
        ],
    },
    {
        slug: "free-education",
        title: "Free Education",
        englishTitle: "Free Education",
        description:
            "Providing quality education and learning resources to underprivileged children.",
        longDescription:
            "Education is the cornerstone of empowerment. Our Free Education initiative provides quality learning resources, tutoring, and mentorship to children from economically weaker families across Jharkhand. We run community learning centers equipped with books, stationery, and digital tools. Our volunteer teachers conduct classes in subjects ranging from mathematics and science to English and computer literacy. We also offer scholarships and exam preparation support to help students pursue higher education and break the cycle of poverty.",
        icon: BookOpen,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        gradient: "from-green-400 to-emerald-400",
        highlights: [
            "Community learning centers with free study materials",
            "Volunteer-led tutoring in core academic subjects",
            "Digital literacy and computer training programs",
            "Scholarship support for higher education aspirants",
            "After-school programs for first-generation learners",
            "Annual book and stationery distribution drives",
        ],
        stats: [
            { label: "Students Supported", value: "5,000+" },
            { label: "Learning Centers", value: "25+" },
            { label: "Scholarships Given", value: "500+" },
            { label: "Volunteer Teachers", value: "100+" },
        ],
    },
    {
        slug: "social-progress",
        title: "Social Progress",
        englishTitle: "Social Progress",
        description:
            "Driving community development and social empowerment initiatives at the grassroots level.",
        longDescription:
            "Our Social Progress programs aim to uplift communities by addressing systemic challenges at the grassroots level. We work on skill development, livelihood creation, and social awareness campaigns that empower individuals to become self-reliant. Through community gatherings, workshops, and micro-enterprise support, we help villagers develop new income sources, understand their rights, and participate actively in local governance. Our focus is on creating a ripple effect where empowered individuals lift entire communities.",
        icon: TrendingUp,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        gradient: "from-orange-500 to-amber-500",
        highlights: [
            "Skill development and vocational training workshops",
            "Micro-enterprise and livelihood support programs",
            "Social awareness campaigns on rights and governance",
            "Community leadership and capacity building",
            "Youth engagement and mentorship initiatives",
            "Collaboration with Panchayats for local development",
        ],
        stats: [
            { label: "Workshops Conducted", value: "200+" },
            { label: "Families Empowered", value: "3,000+" },
            { label: "Youth Trained", value: "1,500+" },
            { label: "Villages Impacted", value: "40+" },
        ],
    },
    {
        slug: "free-food",
        title: "Free Food",
        englishTitle: "Free Food",
        description:
            "Ensuring nutrition security through regular food distribution drives for the needy.",
        longDescription:
            "Hunger should never be a barrier to dignity. Our Free Food initiative ensures that no one in our community goes to bed hungry. We organize regular food distribution drives in urban slums, rural hamlets, and during natural disasters or festivals. Our community kitchens serve nutritious meals prepared by volunteers, while our packaged food drives reach remote areas. We also run nutrition awareness programs for mothers and children, ensuring that families understand the importance of balanced diets for healthy growth and development.",
        icon: Utensils,
        color: "text-yellow-600",
        bgColor: "bg-yellow-600/10",
        gradient: "from-yellow-600 to-amber-600",
        highlights: [
            "Regular food distribution in slums and remote villages",
            "Community kitchens serving nutritious meals",
            "Emergency food relief during natural disasters",
            "Nutrition awareness programs for mothers and children",
            "Festival and occasion-based mass food drives",
            "Partnerships with local donors and food suppliers",
        ],
        stats: [
            { label: "Meals Served", value: "50,000+" },
            { label: "Food Drives", value: "300+" },
            { label: "Families Fed", value: "8,000+" },
            { label: "Volunteers", value: "150+" },
        ],
    },
    {
        slug: "women-welfare",
        title: "Women Welfare",
        englishTitle: "Women Welfare",
        description:
            "Empowering women through skill development, health support, and social advocacy.",
        longDescription:
            "Women are the backbone of our communities, and their empowerment is central to our mission. Our Women Welfare programs encompass skill development workshops in tailoring, handicrafts, and entrepreneurship. We provide health support through specialized maternal and reproductive health camps. Our advocacy efforts focus on legal rights awareness, domestic violence prevention, and creating safe spaces for women to voice their concerns. We believe that when women thrive, families and communities flourish.",
        icon: Heart,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        gradient: "from-pink-500 to-rose-400",
        highlights: [
            "Skill development in tailoring, handicrafts, and business",
            "Maternal and reproductive health awareness camps",
            "Self-help group formation and micro-finance support",
            "Legal rights awareness and domestic violence prevention",
            "Women leadership and community role-model programs",
            "Safe spaces and counseling for women in distress",
        ],
        stats: [
            { label: "Women Trained", value: "2,000+" },
            { label: "Self-Help Groups", value: "80+" },
            { label: "Health Camps", value: "60+" },
            { label: "Awareness Drives", value: "100+" },
        ],
    },
    {
        slug: "environment-safety",
        title: "Environment, Water & Air Safety",
        englishTitle: "Environment Safety",
        description:
            "Protecting our natural resources through water conservation and air quality initiatives.",
        longDescription:
            "Our environment is our legacy. The Environment Safety initiative works to protect and restore the natural resources of Jharkhand. We organize clean water access programs, rainwater harvesting installations, and river-cleanup drives. Our air quality initiatives include promoting clean cooking fuel, reducing stubble burning awareness, and supporting green energy adoption. We also run environmental education programs in schools to build a generation of eco-conscious citizens who understand their role in preserving the planet.",
        icon: Wind,
        color: "text-sky-500",
        bgColor: "bg-sky-500/10",
        gradient: "from-sky-500 to-blue-400",
        highlights: [
            "Clean water access and rainwater harvesting programs",
            "River and water body cleanup drives",
            "Air quality awareness and clean cooking fuel promotion",
            "Environmental education in schools and colleges",
            "Support for green energy and sustainable practices",
            "Anti-pollution campaigns and awareness rallies",
        ],
        stats: [
            { label: "Water Units Installed", value: "12+" },
            { label: "Cleanup Drives", value: "50+" },
            { label: "Schools Covered", value: "30+" },
            { label: "Villages Impacted", value: "35+" },
        ],
    },
    {
        slug: "tree-plantation",
        title: "Tree Plantation",
        englishTitle: "Tree Plantation",
        description:
            "Promoting a greener future through sustainable plantation and forest preservation.",
        longDescription:
            "Trees are the lungs of our planet. Our Tree Plantation drives aim to restore green cover across Jharkhand's degraded landscapes. We organize large-scale plantation events involving schools, colleges, corporate volunteers, and local communities. Our focus is on planting native species that support local biodiversity and provide livelihood benefits like fruit-bearing and medicinal trees. We also maintain nurseries and conduct post-plantation care to ensure high survival rates, and we educate communities on forest preservation and sustainable harvesting.",
        icon: Trees,
        color: "text-green-700",
        bgColor: "bg-green-700/10",
        gradient: "from-green-700 to-emerald-700",
        highlights: [
            "Large-scale tree plantation drives with community participation",
            "Focus on native and fruit-bearing species",
            "School and college environmental awareness programs",
            "Nursery maintenance and post-plantation care",
            "Forest preservation and anti-deforestation campaigns",
            "Corporate partnership drives for green CSR initiatives",
        ],
        stats: [
            { label: "Trees Planted", value: "50,000+" },
            { label: "Eco-Drives", value: "60+" },
            { label: "Nurseries Maintained", value: "10+" },
            { label: "Schools Involved", value: "40+" },
        ],
    },
];
