import { notFound } from "next/navigation";

const users = ["ebru", "ayse", "derya"] as const;

type RouteParams = Promise<{ slug: string }>;

export default async function ProfilePage({ params }: { params: RouteParams }) {
  const { slug } = await params;

  // örnek eşleştirme (case-insensitive)
  const allowed = new Set(users.map((u) => u.toLowerCase()));
  if (!allowed.has(slug)) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold">/ {slug} profili</h1>
      {/* kullanıcıya özel içerik */}
    </main>
  );
}

// (SSG istiyorsan)
export function generateStaticParams() {
  return users.map((u) => ({ slug: u })); // <<< key klasör adıyla aynı
}
