// src/data/users.ts

export type Service = {
  title: string;
  desc: string;
  duration?: string;
  price?: string;
};
export type Testimonial = { name: string; text: string };
export type FAQ = { q: string; a: string };

export type Training = { title: string; org?: string; when?: string };
export type Availability = { days: string; hours: string }[];

export type Modalities = { online?: boolean; in_person?: boolean };
export type Stats = { years?: number; clients?: number; satisfaction?: number };

export type User = {
  slug: string;
  name: string;

  title?: string;
  summary?: string;
  city?: string;

  avatarUrl?: string;
  coverUrl?: string;

  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  mapEmbedUrl?: string;

  specialties?: string[];
  services?: Service[];
  credentials?: string[];
  methods?: string[];
  testimonials?: Testimonial[];
  faqs?: FAQ[];

  social?: { instagram?: string; linkedin?: string };

  theme?: { primary?: string; accent?: string };
  brand?: string;
  siteUrl?: string;

  skills?: string[];
  trainings?: Training[];
  modalities?: Modalities;
  availability?: Availability;
  stats?: Stats;
};

export const users: User[] = [
  {
    slug: "ebru",
    name: "Ebru Yayla",
    title: "Çocuk Gelişimci • Aile & Çift Danışmanlığı",
    city: "Ankara",
    phone: "+90 537 034 39 06",
    email: "ebrubyrm3524@gmail.com",
    summary:
      "Aile, çift ve çocuk odağında; oyun temelli ve kanıta dayalı yaklaşımlarla kısa sürede somut ilerleme hedeflerim.",
    specialties: [
      "Aile Danışmanlığı",
      "Çift/İlişki Danışmanlığı",
      "Oyun Terapisi",
      "Cinsel Terapi",
      "Bilişsel Davranışçı Yaklaşımlar (BDT)",
    ],

    skills: [
      "BDT ilkeleri",
      "Çözüm Odaklı Teknikler",
      "Aile-Çift için 20 Teknik",
      "Çocuk Değerlendirme Testleri",
      "Seans Sonrası Ev Ödevleri",
      "EFT (Duygu Odaklı Terapi) teknikleri",
      "Pozitif Psikoloji Uygulamaları",
      "Mindfulness (Bilinçli Farkındalık) egzersizleri",
      "Empati ve aktif dinleme becerileri",
      "İletişim ve çatışma yönetimi",
      "Çocuk davranış yönetimi",
      "Duygu düzenleme stratejileri",
      "Bağlanma kuramı uygulamaları",
      "Travma sonrası destek yöntemleri",
      "Öfke kontrol teknikleri",
      "Aile içi rol ve sınır belirleme",
      "Ebeveyn-çocuk ilişkisini güçlendirme",
      "Oyun terapisi senaryo geliştirme",
      "Bireysel gelişim planı hazırlama",
      "Psiko-eğitim programı tasarımı",
      "Grup terapisi dinamikleri",
      "Motivasyon artırma yöntemleri",
      "Öz-farkındalık ve öz-şefkat çalışmaları",
    ],

    trainings: [
      { title: "MEB Onaylı Aile Danışmanlığı", when: "2025" },
      {
        title: "Evlilik & İlişki Danışmanlığı",
        org: "Esenyurt SEM",
        when: "2023",
      },
      { title: "Oyun Terapisi", org: "Esenyurt SEM", when: "2023" },
      { title: "Cinsel Terapi", org: "Esenyurt SEM", when: "2023" },
      {
        title: "Aile & Çift Terapisinde 20 Teknik",
        org: "Arel SEM",
        when: "2024",
      },
      { title: "Çocuk Testleri Uygulayıcı", org: "Arel SEM", when: "2023" },
    ],
    services: [
      {
        title: "Aile Danışmanlığı",
        desc: "İletişim, sınırlar, çatışma çözümü.",
        duration: "50 dk",
        price: "₺1.500",
      },
      {
        title: "Evlilik & İlişki",
        desc: "Güven, yakınlık, bağlanma & çatışma yönetimi.",
        duration: "50 dk (çift)",
        price: "₺1.800",
      },
      {
        title: "Çocuk & Ergen",
        desc: "Duygu düzenleme, davranış & ebeveyn rehberi.",
        duration: "45 dk",
        price: "₺1.400",
      },
    ],
    modalities: { online: true, in_person: true },
    availability: [
      { days: "Hafta içi", hours: "19:00–22:00" },
      { days: "Hafta sonu", hours: "09:00–23:00" },
    ],

    stats: { years: 2, clients: 200, satisfaction: 94 },
    avatarUrl: "/image/avatars/ebru.png",
    //coverUrl: "/image/kapak.png",
    brand: "Ebru Yayla Danışmanlık",
    theme: { primary: "#0ea5e9", accent: "#f59e0b" },
    siteUrl: "https://ornek-ebru.com",
  },

  //diğer kullanıcı
  {
    slug: "derya",
    name: "Derya Yılmaz",
    title: "Web Onaylı Aile Danışmanı",
    summary:
      "Aile içi iletişim, çift ilişkileri ve çocuk gelişimi alanlarında; bilimsel yöntemlerle danışmanlık.",
    city: "İstanbul",
    avatarUrl: "/avatars/ebru.png",
    coverUrl: "/hero/ebru-cover.jpg",
    phone: "+90 5459055189",
    whatsapp: "+90 5459055189",
    email: "info@deryayilmazdanismanlik.com",
    address: "Mecidiyeköy, Şişli/İstanbul",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12043.865!2d28.996!3d41.067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDEuMDY3LCAyOC45OTY!5e0!3m2!1str!2str!4v1680000000000",
    specialties: [
      "Çocuk Gelişimi",
      "Aile Danışmanlığı",
      "Evlilik & İlişki",
      "Cinsel Danışmanlık",
    ],
    services: [
      {
        title: "Aile Danışmanlığı",
        desc: "İletişim, sınırlar, çatışma çözümü.",
        duration: "50 dk",
        price: "₺1.500",
      },
      {
        title: "Evlilik & İlişki",
        desc: "Güven, yakınlık, bağlanma & çatışma yönetimi.",
        duration: "50 dk (çift)",
        price: "₺1.800",
      },
      {
        title: "Çocuk & Ergen",
        desc: "Duygu düzenleme, davranış & ebeveyn rehberi.",
        duration: "45 dk",
        price: "₺1.400",
      },
    ],
    credentials: [
      "Psikoloji Lisansı – ABC Üniversitesi",
      "Aile Danışmanlığı Sertifikası – MEB Onaylı",
    ],
    methods: [
      "Bilişsel Davranışçı Yaklaşımlar (BDT)",
      "Çözüm Odaklı Kısa Terapi",
      "EFT (Emotion Focused Therapy) ilkeleri",
    ],
    testimonials: [
      {
        name: "A. K.",
        text: "Eşimle iletişimimiz belirgin şekilde düzeldi. Seanslar yapılandırılmış ve güven vericiydi.",
      },
      {
        name: "N. T.",
        text: "Çocuğumuzun öfke patlamalarında kısa sürede azalma oldu, evde uygulayabildiğimiz net öneriler aldık.",
      },
    ],
    faqs: [
      {
        q: "Seanslar online yapılabiliyor mu?",
        a: "Evet, güvenli bir platform üzerinden online seanslar yapıyorum.",
      },
      {
        q: "Gizlilik nasıl sağlanıyor?",
        a: "Tüm süreç KVKK ve meslek etik ilkeleri çerçevesinde gizlidir.",
      },
    ],
    social: {
      instagram: "https://instagram.com/derya.danismanlik",
      linkedin: "https://www.linkedin.com/in/deryayilmaz",
    },
    theme: { primary: "#2563eb", accent: "#f59e0b" },
    brand: "Derya Yılmaz Danışmanlık",
    siteUrl: "https://ornek-danismanlik.com",
  },
];

export function getUserBySlug(slug: string) {
  return users.find((u) => u.slug === slug) || null;
}
