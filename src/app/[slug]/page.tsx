// src/app/[slug]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUserBySlug, User } from "@/data/users";

type RouteParams = Promise<{ slug: string }>; // <<< ÖNEMLİ: klasör adıyla aynı anahtar
import { users } from "@/data/users";
import SkillCloud from "@/components/SkillCloud";

export async function generateStaticParams() {
  // build sırasında iki slug da üretilecek
  return users.map((u) => ({ slug: u.slug }));
}

// ========== SEO Metadata (SSR) ==========
export async function generateMetadata({ params }: { params: RouteParams }) {
  const { slug } = await params;
  // console.log("[/slug] gelen slug:", slug);

  const u = getUserBySlug(slug?.toLowerCase());
  if (!u) return notFound();

  const title = `${u.name}${u.title ? " – " + u.title : ""}`;
  const description =
    u.summary ||
    `${u.name} danışmanlık profili. İletişim, WhatsApp ve e-posta için tek tık.`;
  const images = u.coverUrl ? [{ url: u.coverUrl }] : undefined;

  return {
    metadataBase:
      typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
        ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
        : new URL("http://localhost:3000"),
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "profile",
      siteName: u.brand || "Profil",
    },
    alternates: { canonical: u.siteUrl || undefined },
  };
}

// ========== Küçük yardımcılar ==========
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-3 py-1 text-sm font-medium text-white/95 backdrop-blur">
      {children}
    </span>
  );
}

function InfoRow({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value?: string;
  href?: string;
  icon?: React.ReactNode; // ← eklendi
}) {
  if (!value) return null;
  const content = (
    <div className="flex items-center gap-2">
      {" "}
      {/* ikonu göster */}
      {icon && <span aria-hidden>{icon}</span>}
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="hover:underline">
      {content}
    </a>
  ) : (
    content
  );
}

// ========== Sayfa ==========
export default async function Page({ params }: { params: RouteParams }) {
  const { slug } = await params; // <<< key 'slug'
  // console.log("[/slug] gelen slug:", slug);

  const user: User | null = getUserBySlug(slug?.toLowerCase()); // <<< slug ile bul
  if (!user) return notFound();

  const primary = user.theme?.primary || "#2563eb";
  const accent = user.theme?.accent || "#f59e0b";

  const waDigits = (user.whatsapp || user.phone || "").replace(/\D/g, "");
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
        `Merhaba ${user.name}, randevu almak istiyorum.`
      )}`
    : undefined;
  const mailHref = user.email
    ? `mailto:${user.email}?subject=Randevu Talebi&body=Merhaba ${user.name}, randevu almak istiyorum.`
    : undefined;

  // JSON-LD (ProfessionalService)
  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: user.name,
    url: user.siteUrl || "",
    image: user.coverUrl || user.avatarUrl || "",
    areaServed: user.city || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: user.address || "",
      addressLocality: user.city || "",
      addressCountry: "TR",
    },
    telephone: user.phone || "",
    email: user.email || "",
    sameAs: Object.values(user.social || {}).filter(Boolean),
    knowsAbout: user.specialties || [],
    priceRange: "₺₺",
  };

  // JSON-LD (FAQPage, varsa)
  const faqJsonLd = user.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: user.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  // opsiyonel alanları   direk tiple ile okuyalım
  const stats: User["stats"] = user.stats;
  const trainings: User["trainings"] = user.trainings;
  const skills: User["skills"] = user.skills;
  const modalities: User["modalities"] = user.modalities;
  const availability: User["availability"] = user.availability;

  // Harita kaynağı: mapEmbedUrl varsa onu kullan; yoksa adresten embed üret
  const mapSrc =
    user.mapEmbedUrl ||
    (user.address
      ? `https://www.google.com/maps?q=${encodeURIComponent(
          user.address
        )}&z=15&output=embed`
      : null);

  return (
    <div
      style={
        {
          "--primary": primary,
          "--accent": accent,
        } as React.CSSProperties
      }
      className="min-h-screen bg-gray-50 text-gray-900"
    >
      {/* ========== HERO ========== */}
      <header
        className="relative"
        style={{
          // görsel olmasa bile metin okunaklı:
          background:
            "linear-gradient(120deg, var(--primary) 0%, rgba(0,0,0,0.45) 60%)",
        }}
      >
        {/* arka plan görseli (opsiyonel) */}
        {/* {user.coverUrl && (
          <Image
            src={user.coverUrl}
            alt="Kapak"
            fill
            priority
            className="object-cover z-0"
            sizes="100vw"
          />
        )} */}

        {/* koyulaştırma katmanları */}
        <div className="absolute inset-0 z-0 bg-black/35" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />

        {/* içerik */}
        <div
          className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-20 text-white"
          style={{ minHeight: 420 }}
        >
          <div className="grid items-end gap-6 md:grid-cols-[auto,1fr]">
            {/* avatar */}
            <div className="flex h-fit items-center">
              <div className="rounded-full ring-4 ring-white/60">
                <div
                  className="relative overflow-hidden rounded-full"
                  style={{ width: 120, height: 120 }}
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-white/40" />
                  )}
                </div>
              </div>
            </div>

            {/* başlık */}
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                {user.name}
              </h1>
              {(user.title || user.city) && (
                <p className="mt-1 text-white/90">
                  {user.title}
                  {user.title && user.city ? " – " : ""}
                  {user.city}
                </p>
              )}

              {!!user.specialties?.length && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.specialties.map((sp) => (
                    <Badge key={sp}>{sp}</Badge>
                  ))}
                </div>
              )}

              {user.summary && (
                <p className="mt-4 max-w-3xl text-white/90">{user.summary}</p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-white shadow transition hover:opacity-95 motion-safe:animate-[fadeIn_.5s_ease]"
                    style={{ backgroundColor: primary }}
                    aria-label="WhatsApp’tan ön görüşme"
                  >
                    <span className="mr-2" aria-hidden>
                      📲
                    </span>
                    3 Dakikalık Ön Görüşme
                  </a>
                )}
                {mailHref && (
                  <a
                    href={mailHref}
                    className="inline-flex items-center rounded-xl border border-white/70 px-5 py-3 font-semibold text-white transition hover:bg-white/10 motion-safe:animate-[fadeIn_.6s_ease]"
                    aria-label="E-posta ile ilk yanıt"
                  >
                    <span className="mr-2" aria-hidden>
                      📧
                    </span>
                    İlk Yanıt Ücretsiz
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ikna metrikleri */}
          {stats && (stats.years || stats.clients || stats.satisfaction) && (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {typeof stats.years === "number" && (
                <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur">
                  <div className="text-3xl font-semibold">{stats.years}+</div>
                  <div className="text-white/90 text-sm mt-1">Yıl Deneyim</div>
                </div>
              )}
              {typeof stats.clients === "number" && (
                <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur">
                  <div className="text-3xl font-semibold">{stats.clients}+</div>
                  <div className="text-white/90 text-sm mt-1">Danışan/Çift</div>
                </div>
              )}
              {typeof stats.satisfaction === "number" && (
                <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur">
                  <div className="text-3xl font-semibold">
                    %{stats.satisfaction}
                  </div>
                  <div className="text-white/90 text-sm mt-1">Memnuniyet</div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Neden ben */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">
            Neden beni tercih etmelisiniz?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                h: "Bilimsel Yaklaşım",
                p: "Kanıta dayalı yöntemler: BDT, Çözüm Odaklı ve duygusal odaklı teknikler.",
              },
              {
                h: "Gizlilik & Güven",
                p: "Tüm süreç KVKK ve meslek etik ilkeleri çerçevesinde yürütülür.",
              },
              {
                h: "Ölçülebilir İlerleme",
                p: "Net hedefler, düzenli geri bildirim ve ev ödevleri ile somut dönüşüm.",
              },
            ].map((b) => (
              <div
                key={b.h}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{b.h}</h3>
                <p className="mt-2 text-gray-600">{b.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yaklaşım / Eğitim */}
      {(user.methods?.length || user.credentials?.length) && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6 grid gap-8 md:grid-cols-2">
            {!!user.methods?.length && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Yaklaşım</h2>
                <ul className="mt-4 grid gap-2 list-disc pl-5 text-gray-700">
                  {user.methods!.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {!!user.credentials?.length && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">
                  Eğitim & Sertifikalar
                </h2>
                <ul className="mt-4 grid gap-2 list-disc pl-5 text-gray-700">
                  {user.credentials!.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sertifikalar / Yetkinlikler */}
      {(trainings?.length || skills?.length) && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6 grid gap-8 md:grid-cols-2">
            {!!trainings?.length && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Sertifikalar</h2>
                <ul className="mt-4 space-y-3">
                  {trainings!.map((t, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1" aria-hidden>
                        ✅
                      </span>
                      <div>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-gray-600">
                          {[t.org, t.when].filter(Boolean).join(" • ")}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!skills?.length && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Yetkinlikler</h2>

                {/* SkillCloud burada */}
                <SkillCloud skills={skills ?? []} />

                {(modalities?.online || modalities?.in_person) && (
                  <p className="mt-4 text-sm text-gray-600">
                    {[
                      modalities?.online ? "Online" : null,
                      // modalities?.in_person ? "Yüz yüze" : null,
                    ]
                      .filter(Boolean)
                      .join(" • ")}{" "}
                    seans seçeneğimiz mevcut.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}
      {/* Hizmetler */}
      {!!user.services?.length && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-3xl font-semibold tracking-tight">
              Hizmetler
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {user.services!.map((s) => (
                <div
                  key={s.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <span
                      className="ml-3 rounded-full px-3 py-1 text-sm font-medium text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {s.duration || "Seans"}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{s.desc}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-700">
                    {s.price && (
                      <span className="font-semibold">💳 {s.price}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seans Süreci */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">
            Seans Süreci
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: 1,
                h: "Ön Görüşme",
                p: "Hedefleri netleştirir, yaklaşımı planlarız.",
              },
              {
                n: 2,
                h: "Danışmanlık",
                p: "Kanıta dayalı teknikler + ev ödevleri.",
              },
              {
                n: 3,
                h: "İlerleme",
                p: "Somut kazanımlar ve sürdürülebilir stratejiler.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="text-3xl mb-2">{s.n}</div>
                <h3 className="text-lg font-semibold">{s.h}</h3>
                <p className="mt-2 text-gray-600">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kazanımlar */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">
            Seanslardan Beklenen Kazanımlar
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "İletişimde netlik ve çatışma yönetimi",
              "Yakınlık ve güvenin güçlenmesi",
              "Çocuk davranışlarında düzen ve ebeveyn tutarlılığı",
              "Kaygı ve duygu düzenleme becerileri",
              "İlişkide ortak hedef ve ritüeller",
              "Pratik ev ödevleriyle kalıcı dönüşüm",
            ].map((b) => (
              <li
                key={b}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                • {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sık Görülen Konular */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">
            Sık Görülen Konular
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "İletişim sorunları & çatışma yönetimi",
              "Kıskançlık, güven, sınırlar",
              "Yakınlık & cinsel yaşamda zorluklar",
              "Ebeveynlik ve rol paylaşımı",
              "Duygu düzenleme & kaygı",
              "Aldatma sonrası yeniden yapılanma",
            ].map((k) => (
              <div
                key={k}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-gray-700">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uygunluk & KVKK */}
      {(availability || modalities) && (
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Uygunluk Kartı */}
              {!!availability?.length && (
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">Uygunluk</h2>

                    {/* Yalnızca online ise rozet */}
                    {modalities?.online && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {/* video/online ikon */}
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <rect x="3" y="5" width="13" height="14" rx="2" />
                          <path d="M16 9l5-3v12l-5-3z" />
                        </svg>
                        Online seans
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {availability.map((slot, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          {/* takvim/saat ikon */}
                          <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 7v5l3 2" />
                            </svg>
                          </span>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {slot.days}
                            </div>
                            <div className="text-sm text-slate-600">
                              {slot.hours}
                            </div>
                          </div>
                        </div>

                        {/* rozet */}
                        <span className="ml-3 hidden rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 md:inline-block">
                          Aktif
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* alt bilgi (opsiyonel) */}
                  <p className="mt-4 text-xs text-slate-500">
                    Randevu saatleri talebe göre güncellenebilir.
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-xl font-semibold">Gizlilik & KVKK</h3>
                <p className="mt-2 text-gray-700">
                  Tüm süreç meslek etiği ve KVKK kapsamında gizlidir.
                  Verileriniz üçüncü taraflarla paylaşılmaz.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Yorumlar */}
      {!!user.testimonials?.length && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-3xl font-semibold tracking-tight">
              Danışan Yorumları
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {user.testimonials!.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <blockquote className="text-gray-700">“{t.text}”</blockquote>
                  <figcaption className="mt-3 text-sm text-gray-500">
                    — {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SSS */}
      {!!user.faqs?.length && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-3xl font-semibold tracking-tight">
              Sık Sorulan Sorular
            </h2>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
              {user.faqs!.map((f, i) => (
                <details
                  key={i}
                  className="border-b border-gray-200 py-4 last:border-none"
                >
                  <summary className="cursor-pointer select-none text-lg font-medium">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* İletişim & Harita (yan yana kartlar) */}
      {(user.phone || user.email || user.address || mapSrc) && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-semibold tracking-tight">
                İletişim
              </h2>

              {/* Online rozeti (sadece online ise) */}
              {user.modalities?.online && (
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="3" y="5" width="13" height="14" rx="2" />
                    <path d="M16 9l5-3v12l-5-3z" />
                  </svg>
                  Online seans
                </span>
              )}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Kart 1: İletişim bilgileri */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 text-gray-700">
                  <InfoRow
                    label="Telefon"
                    value={user.phone}
                    href={user.phone ? `tel:${user.phone}` : undefined}
                    icon={
                      <svg
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.33 1.7.64 2.49a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.59-1.16a2 2 0 0 1 2.11-.45c.79.31 1.63.52 2.49.64A2 2 0 0 1 22 16.92z" />
                      </svg>
                    }
                  />
                  <InfoRow
                    label="E-posta"
                    value={user.email}
                    href={user.email ? `mailto:${user.email}` : undefined}
                    icon={
                      <svg
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M4 4h16v16H4z" />
                        <path d="m22 6-10 7L2 6" />
                      </svg>
                    }
                  />
                  <InfoRow
                    label="Adres"
                    value={user.address}
                    icon={
                      <svg
                        className="h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    }
                  />

                  {(user.social?.instagram || user.social?.linkedin) && (
                    <div className="flex gap-3 pt-2">
                      {user.social?.instagram && (
                        <a
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                          href={user.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.5A2.5 2.5 0 1 0 12 14a2.5 2.5 0 0 0 0-5.5Zm4.75-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
                          </svg>
                          Instagram
                        </a>
                      )}
                      {user.social?.linkedin && (
                        <a
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                          href={user.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.5 8h4.9v16H.5zM9 8h4.7v2.2h.1c.7-1.2 2.3-2.5 4.7-2.5 5 0 5.9 3.3 5.9 7.7V24H19.7v-7.2c0-1.7 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7V24H9z" />
                          </svg>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {waHref && (
                    <a
                      href={waHref}
                      className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-white shadow transition hover:opacity-95"
                      style={{ backgroundColor: primary }}
                      aria-label="WhatsApp’tan randevu al"
                    >
                      <span className="mr-2" aria-hidden>
                        📲
                      </span>
                      WhatsApp’tan Randevu Al
                    </a>
                  )}
                  {mailHref && (
                    <a
                      href={mailHref}
                      className="inline-flex items-center rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-800 transition hover:bg-gray-200"
                      aria-label="E-posta ile randevu al"
                    >
                      <span className="mr-2" aria-hidden>
                        📧
                      </span>
                      Mail ile Randevu Al
                    </a>
                  )}
                </div>
              </div>

              {/* Kart 2: Harita */}
              <div className="rounded-2xl border border-gray-200 bg-white p-0 shadow-sm">
                <div className="flex items-center justify-between px-4 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z" />
                      <path d="M9 4v13" />
                      <path d="M15 7v13" />
                    </svg>
                    <span>Konum</span>
                  </div>
                  {user.address && (
                    <span className="truncate px-4 py-1 text-xs text-gray-500">
                      {user.address}
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <iframe
                      src={
                        mapSrc ??
                        "https://www.google.com/maps?q=39.92077,32.85411&z=12&output=embed"
                      }
                      width="100%"
                      height="380"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Harita"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Güçlü CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div
            className="rounded-3xl p-8 md:p-10 text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), rgba(0,0,0,0.65))",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold">
              İlk adımı atmak için hazır mısınız?
            </h2>
            <p className="mt-2 text-white/90">
              Kısa bir ön görüşme ile hedeflerinizi netleştirelim ve size özel
              bir plan oluşturalım.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {waHref && (
                <a
                  href={waHref}
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 font-semibold text-gray-900 shadow hover:opacity-90"
                >
                  📲 WhatsApp’tan Yaz
                </a>
              )}
              {mailHref && (
                <a
                  href={mailHref}
                  className="inline-flex items-center rounded-xl border border-white/70 px-5 py-3 font-semibold text-white hover:bg-white/10"
                >
                  📧 Mail Gönder
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA (mobil) */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div className="flex items-center justify-between rounded-2xl bg-gray-900 text-white px-4 py-3 shadow-lg">
            <span className="text-sm">
              Sorunuzu şimdi iletin, 24 saat içinde yanıtlayayım.
            </span>
            <div className="flex gap-2">
              {waHref && (
                <a
                  className="rounded-xl bg-white text-gray-900 px-3 py-2 text-sm font-semibold"
                  href={waHref}
                >
                  WhatsApp
                </a>
              )}
              {mailHref && (
                <a
                  className="rounded-xl border border-white/60 px-3 py-2 text-sm font-semibold"
                  href={mailHref}
                >
                  Mail
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 text-center text-sm text-gray-500">
        <div className="mx-auto max-w-6xl px-6">
          <p>
            © {new Date().getFullYear()} {user.brand || "Profil"}. Tüm hakları
            saklıdır.
          </p>
          <p className="mt-2">
            *Bu site yalnızca danışmanlık amaçlıdır; acil durumlar için 112’yi
            arayınız.
          </p>
        </div>
      </footer>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </div>
  );
}
