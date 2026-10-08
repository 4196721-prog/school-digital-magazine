export const categories = ["Articles", "Blogs", "Poetry", "Stories", "Artwork", "Photography", "School Activities", "Achievements"] as const;
export type Category = (typeof categories)[number];
export type Language = "English" | "Urdu";
export type PostStatus = "pending" | "published" | "rejected" | "archived";
export type Post = {
  id: string; slug: string; title: string; author_name: string; class_name: string; section: string;
  category: Category; language: Language; content: string; cover_image: string | null;
  published_at: string; submitted_at?: string; status?: PostStatus; view_count: number;
};

export const demoPosts: Post[] = [
  { id: "demo-1", slug: "the-garden-after-rain", title: "The Garden After Rain", author_name: "Maira Khan", class_name: "10", section: "A", category: "Photography", language: "English", content: "After the rain, the school garden becomes a different place. Every leaf holds a tiny mirror, and the paths turn quiet enough to hear the birds return. I took this photograph just before assembly, when the morning light was still soft.", cover_image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85", published_at: "2026-09-22T08:30:00.000Z", view_count: 238 },
  { id: "demo-2", slug: "a-small-act-of-courage", title: "A Small Act of Courage", author_name: "Hamza Ali", class_name: "9", section: "B", category: "Stories", language: "English", content: "The bell had already rung when I noticed the new student standing alone outside the library. I was late for class, and I could have kept walking. Instead, I asked if they wanted company. It was a small question, but it changed both our mornings.", cover_image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80", published_at: "2026-09-20T10:10:00.000Z", view_count: 174 },
  { id: "demo-3", slug: "between-the-lines", title: "Between the Lines", author_name: "Zoya Ahmed", class_name: "11", section: "C", category: "Poetry", language: "English", content: "Somewhere between the lines\nA little light begins to grow,\nA question finds its quiet voice,\nA seed decides to know.\n\nWe learn by turning pages,\nAnd by turning toward the day;\nThe world is full of open doors\nFor those who find a way.", cover_image: null, published_at: "2026-09-18T07:00:00.000Z", view_count: 129 },
  { id: "demo-4", slug: "ilm-ki-roshni", title: "علم کی روشنی", author_name: "علی رضا", class_name: "8", section: "A", category: "Articles", language: "Urdu", content: "علم ایک ایسی روشنی ہے جو انسان کو بہتر راستہ دکھاتی ہے۔ کتابیں ہمیں نئی دنیاوں سے ملاتی ہیں اور سوال کرنا سکھاتی ہیں۔ جب ہم مل کر سیکھتے ہیں تو ہمارا مستقبل مزید روشن ہو جاتا ہے۔", cover_image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80", published_at: "2026-09-16T09:00:00.000Z", view_count: 96 },
  { id: "demo-5", slug: "our-science-fair", title: "Ideas Take Flight at the Science Fair", author_name: "Editorial Desk", class_name: "School", section: "—", category: "School Activities", language: "English", content: "From a low-cost water filter to a model of a greener city, this year's science fair was full of thoughtful questions and inventive answers. Students across the middle and senior sections shared projects built around problems they see in everyday life.", cover_image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80", published_at: "2026-09-14T11:00:00.000Z", view_count: 88 },
  { id: "demo-6", slug: "blue-hour-sketch", title: "Blue Hour", author_name: "Areeba Noor", class_name: "7", section: "C", category: "Artwork", language: "English", content: "A sketch of the city just after sunset, when the last gold light meets the first evening blue.", cover_image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80", published_at: "2026-09-12T08:30:00.000Z", view_count: 75 },
];

export const displayCategories = [
  "Articles",
  "Blogs",
  "Poetry",
  "Stories",
  "Artwork",
  "Audio",
  "Video",
] as const;

export type DisplayCategory = (typeof displayCategories)[number];

export const categoryMeta: Record<
  DisplayCategory,
  {
    title: string;
    description: string;
    image: string;
    icon: string;
    slug: string;
  }
> = {
  Articles: {
    title: "Articles",
    description: "Deep explorations, essays and student insights.",
    image: "/images/categories/articles.jpg",
    icon: "book",
    slug: "Articles",
  },
  Blogs: {
    title: "Blogs",
    description: "Reflections, modern student voices and tech trends.",
    image: "/images/categories/blogs.jpg",
    icon: "file-text",
    slug: "Blogs",
  },
  Poetry: {
    title: "Poetry",
    description: "Rhythm, verse, and quiet emotions in rhyme.",
    image: "/images/categories/poetry.jpg",
    icon: "feather",
    slug: "Poetry",
  },
  Stories: {
    title: "Stories",
    description: "Narratives, fiction and campus chronicles.",
    image: "/images/categories/stories.jpg",
    icon: "library",
    slug: "Stories",
  },
  Artwork: {
    title: "Artwork",
    description: "Visual creativity, drawings, paintings and designs.",
    image: "/images/categories/artwork.jpg",
    icon: "palette",
    slug: "Artwork",
  },
  Audio: {
    title: "Audio",
    description: "Podcasts, recitation, dialogues and recordings.",
    image: "/images/categories/audio.jpg",
    icon: "mic",
    slug: "Audio",
  },
  Video: {
    title: "Video",
    description: "Short films, documentaries, student reels and presentations.",
    image: "/images/categories/video.jpg",
    icon: "video",
    slug: "Video",
  },
};
