import Link from "next/link";
import React, { useState } from "react";

const Post = ({ initialData }) => {
    const [posts, setPosts] = useState(initialData);
    const [startIndex, setStartIndex] = useState(7);
    const [maxResults, setMaxResults] = useState(6);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        const response = await fetch(`/api/posts?startIndex=${startIndex}&maxResults=${maxResults}`);
        const data = await response.json();
        if (!Array.isArray(data)) {
            setHasMore(false);
            return;
        }
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setStartIndex((prevStartIndex) => prevStartIndex + maxResults);

        if (data.length < maxResults) {
            setHasMore(false);
        }
    };

    return (
        <div>
            {posts.map((post, index) => (
                <div key={index} className="mb-4" id={post.id}>
                    <Link href={`/post/${encodeURIComponent(post.title.toLowerCase() // convert to lowercase
                        .replace(/[^\w\s:-\\/]/g, '') // remove non-alphanumeric characters except forward slash, colon, and space
                        .replace(/[:/]/g, '-') // replace colons and forward slashes with hyphens
                        .replace(/[\\/]/g, '-') // replace colons and forward slashes with hyphens
                        .replace(/\s+/g, '-') // replace spaces with hyphens
                        .replace(/-+/g, '-') // replace consecutive hyphens with a single hyphen
                        .trim() // remove any leading or trailing whitespace
                        .replace(/ /g, '-') // replace any remaining spaces with hyphens
                    )}-${post.id}`}>
                        <h2>{post.title}</h2>
                    </Link>
                </div>
            ))}
            {hasMore ? (
                <button onClick={fetchData}>Load More</button>
            ) : (
                "No Results Found!"
            )}
        </div>
    );
};

export const getServerSideProps = async () => {
    const startIndex = 1;
    const maxResults = 6;

    const response = await fetch(`https://www.elcreativeacademy.com/feeds/posts/summary?max-results=${maxResults}&start-index=${startIndex}&alt=json`);
    const data = await response.json();

    const posts = data.feed.entry.map((entry) => ({
        id: entry.id.$t.split("-").pop(),
        title: entry.title.$t,
        link: entry.link[4].href,
    }));
    return {
        props: { initialData: posts },
    };
}


export default Post;