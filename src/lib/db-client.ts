import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "data", "db.json");

export type DBData = {
  settings: {
    displayName: string;
    tagline: string;
    businessDescription: string;
    publicPhone: string;
    whatsappNumber: string;
    publicEmail: string;
    bookingsEmail: string;
    website: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    x: string;
    linkedin: string;
    calLink: string;
    footerImages?: Array<{
      url: string;
      overlay: string;
      link: string;
    }>;
  };
  packages: Array<{
    id: string;
    serviceName: string;
    category?: string;
    durationDays?: number;
    priceLabel?: string;
    price?: number;
    description?: string;
    includes?: string;
    image: string;
    imageAlt: string;
  }>;
  blogs: Array<{
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string;
    publishedAt: string;
  }>;
  gallery: Array<{
    id: string;
    url: string;
    alt: string;
    caption: string;
  }>;
  bookings: Array<{
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceId: string;
    serviceName: string;
    bookingDate: string;
    bookingTime: string;
    notes?: string;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: string;
    createdAt: string;
  }>;
};

export function readDB(): DBData {
  try {
    if (!fs.existsSync(dbPath)) {
      return {
        settings: {
          displayName: "Kwaku Lotteryy",
          tagline: "Turning travel dreams into reality.",
          businessDescription: "Travel guidance and relocation support worldwide.",
          publicPhone: "+44 7424 047530",
          whatsappNumber: "447424047530",
          publicEmail: "hello@kwakulotteryy.com",
          bookingsEmail: "bookings@kwakulotteryy.com",
          website: "https://www.kwakulotteryy.com",
          instagram: "https://www.instagram.com/kwakulotteryy",
          facebook: "https://web.facebook.com/kwakulotteryy?_rdc=1&_rdr",
          tiktok: "https://www.tiktok.com/@kwakulotteryy/video/7628683868836564244",
          youtube: "https://youtube.com/@kwakulotteryy?si=AXD7lXvl7XBvGjvB",
          x: "https://x.com/kwakulotteryy",
          linkedin: "",
          calLink: "https://cal.com/kwakulotteryy",
          footerImages: [
            {
              url: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop",
              overlay: "facebook",
              link: "https://web.facebook.com/kwakulotteryy?_rdc=1&_rdr"
            },
            {
              url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200&auto=format&fit=crop",
              overlay: "instagram",
              link: "https://www.instagram.com/kwakulotteryy"
            },
            {
              url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop",
              overlay: "tiktok",
              link: "https://www.tiktok.com/@kwakulotteryy"
            },
            {
              url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
              overlay: "youtube",
              link: "https://youtube.com/@kwakulotteryy"
            }
          ]
        },
        packages: [],
        blogs: [],
        gallery: [],
        bookings: []
      };
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Read DB failed", error);
    throw error;
  }
}

export function writeDB(data: DBData): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Write DB failed", error);
    throw error;
  }
}
