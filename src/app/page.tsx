import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold">Profil Link</h1>
      <p className="mt-2 text-gray-600">
        Hoş geldin! Örnek profiller:{" "}
        <Link className="underline" href="/derya">
          /derya
        </Link>{" "}
        ve{" "}
        <Link className="underline" href="/ayse">
          /ayse
        </Link>
      </p>
    </main>
  );
}
