import Link from "next/link";

export default function Page() {
  return (
    <section className="w-full  py-12 md:py-24 lg:py-32">
      <div className="container px-4 text-center md:px-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to Pokemon Team Builder
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 md:text-xl">
            For S&apos;NCE, by Lorenzo Cherubin
          </p>
          <div className="flex justify-center gap-4">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="/teams"
            >
              Team List
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border  border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800  dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              href="/teams/create"
            >
              Create Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
