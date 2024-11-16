export default async function page({ params }: { params: { id: string } }) {
  type Post = {
    title: string;
    body: string;
  };

  //Fetch data
  const res = await fetch(`https://dummyjson.com/posts/${params.id}`);
  const post: Post = await res.json();
  return (
    <div className="text-center mt-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <p className="leading-8 max-w-[750px] mx-auto">{post.body}</p>
    </div>
  );
}
