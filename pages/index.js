import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { formatDistance } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { metadata } from "@/data/Metadata"

const Home = ({ posts }) => {
  const router = useRouter()
  const [startIndex, setStartIndex] = useState(6);

  useEffect(() => {
    setStartIndex(6);
  }, [router.asPath]);

  const handleLoadMore = async () => {
    setStartIndex(startIndex + 6);

  };

  const absoluteUrlMiddleware = (src) => {
    if (src.startsWith('//')) {
      return `https:${src}`;
    } else {
      return src;
    }
  };

  return (
    <>
      <div className="mx-auto max-w-3xl p-4">
        <main>
          {posts.slice(0, startIndex).map((post) => (
            <article key={post.id} id={post.id} className="flex w-full flex-col items-center relative select-none justify-between overflow-hidden xl:rounded-lg xl:border rounded-none border-b xl:bg-white bg:transparent xl:mb-3 xl:p-3 mb-3 pb-3 last:mb-0 xl:last:mb-0">
              <div className="flex w-full items-center justify-between xl:flex-row flex-row">
                <div className="flex w-full flex-col items-start justify-between xl:mr-3 mr-2">
                  {post.category && (
                    <Link href="#" alt={post.category[0]} className="mb-1 flex h-7 flex-row items-center justify-center text-sm font-medium no-underline text-gray-600 hover:text-blue-700"><span>{post.category[0]}</span></Link>
                  )}
                  <Link href={`/${encodeURIComponent(post.title.toLowerCase().replace(/\s/g, "-").replace(/[^a-zA-Z0-9-]/g, "_"))}`} alt={post.title} className="mb-1 text-lg hover:text-blue-700">
                    <h2 className="w-full font-bold">{post.title}</h2>
                  </Link>
                  <div className="mb-[2px] flex justify-start text-sm flex-row items-center text-gray-600">
                    <div className="text-ellipsis line-clamp-1 md:flex md:flex-row md:items-center md:justify-center md:line-clamp-none">
                      <span className="font-medium">{post.author.name}</span>
                    </div>
                    <div className="flex flex-row items-center justify-center whitespace-nowrap md:whitespace-normal xl:before:mx-1 xl:before:content-['\0000a0\002022\0000a0'] before:mx-1 before:content-['\0000a0\002022\0000a0']">
                      <time className="relative flex flex-row items-center justify-center overflow-hidden whitespace-pre-line" dateTime={post.published}>
                        <span className="transition-transform line-clamp-1 md:line-clamp-none">{post.publishedAgo}</span>
                      </time>
                    </div>
                  </div>
                  <div className="relative text-ellipsis text-[13px] hidden xl:line-clamp-2 xl:block text-gray-600">{post.summary}</div>
                </div>

                <div className="flex flex-col items-start justify-between xl:w-auto w-auto">
                  <Link href={`/${encodeURIComponent(post.title.toLowerCase().replace(/\s/g, "-").replace(/[^a-zA-Z0-9-]/g, "_"))}`} alt={post.title} title={post.title} className="relative block overflow-hidden pb-0 h-[100px] w-[100px] rounded-lg">
                    <Image src={absoluteUrlMiddleware(post.thumbnail)} width={100} height={100} alt={post.title} className="rounded-lg object-cover object-center bg-gray-600" />
                  </Link>
                </div>
              </div>
              <div className="flex w-full flex-row flex-wrap items-center justify-between xl:mt-3 mt-2">
                <Link href={post.link} alt={post.title} className="flex flex-row items-center justify-center text-sm text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Lihat Postingan Asli</Link>
              </div>
            </article>
          ))}
        </main>
        {startIndex < posts.length && (
          <div className="mx-auto w-max mt-4">
            <button aria-label="Load More Posts" type="button" onClick={handleLoadMore} className="relative inline-flex cursor-pointer select-none appearance-none items-center justify-center overflow-hidden whitespace-nowrap rounded-[4px] text-sm font-medium px-3 py-2 text-white bg-blue-600 shadow hover:bg-blue-600/90">Load More Posts</button>
          </div>
        )}
      </div>
    </>
  );
};

export const getStaticProps = async () => {
  const res = await fetch(`${metadata.urlOrigin}feeds/posts/summary?max-results=99999&start-index=1&alt=json`);
  const data = await res.json();

  const posts = data.feed.entry.map((post) => ({
    idAlt: entry.id.$t.split("-").pop(),
    category: entry.category ? entry.category.map((category) => category.term) : "",
    categoryFirst: entry.category ? entry.category[0].term : "",
    title: entry.title.$t,
    titleAlt: entry.title.$t.toLowerCase().replace(/[^\w\s:-\\/]/g, '').replace(/[:/]/g, '-').replace(/[\\/]/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').trim().replace(/ /g, '-'),
    published: entry.published.$t,
    summary: entry.summary.$t.trim().replace(/\s+/g, ' '),
    link: entry.link[4].href,
    author: {
      name: entry.author[0].name.$t,
      url: entry.author[0].uri.$t,
      image: entry.author[0].gd$image.src,
    },
    thumbnail: entry.media$thumbnail ? entry.media$thumbnail.url.replace(/\/s[0-9]+(\-c)?/, '/s600-c').replace(/=s[0-9]+(\-c)?/, '=s600-c').replace(/-h[0-9]+(\-c)?/, '').replace(/.*?:\/\//g, '//') : "https://resources.blogblog.com/img/blank.gif",
  }));

  return {
    props: {
      posts: posts,
    },
  };
}

export default Home