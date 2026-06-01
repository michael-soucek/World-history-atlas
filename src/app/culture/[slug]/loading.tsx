export default function Loading() {
  return (
    <main className="page-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-14 animate-pulse">
        <div className="h-3 w-48 bg-paper rounded mb-8" />
        <div className="h-5 w-24 bg-paper rounded mb-4" />
        <div className="h-14 w-80 bg-paper rounded mb-6" />
        <div className="h-4 w-3/4 bg-paper rounded mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-60 bg-paper rounded-2xl" />
            <div className="h-4 w-full bg-paper rounded" />
            <div className="h-4 w-10/12 bg-paper rounded" />
            <div className="h-4 w-9/12 bg-paper rounded" />
          </div>
          <div className="h-56 bg-paper rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
