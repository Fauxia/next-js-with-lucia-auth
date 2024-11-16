import Link from "next/link";

export default async function PostList() {
  type Post = {
    id: string;
    title: string;
  };

  //Fetch data
  const res = await fetch("https://dummyjson.com/posts?limit=10");
  const data = await res.json();
  return (
    <div>
      <ul>
        {data.posts.map((post: Post) => (
          <li key={post.id} className="text-lg">
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
