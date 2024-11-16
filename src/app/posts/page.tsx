import PostList from "@/components/PostList";
import { Suspense } from "react";

export default async function page() {
  return (
    <main className="text-center mt-5">
      <h1 className="text-4xl md:text-5xl font-bold">All Posts</h1>
      <Suspense fallback="Loading...">
        <PostList />
      </Suspense>
    </main>
  );
}
