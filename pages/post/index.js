import Button from "@/components/Buttons";
import Navbar from "@/components/Navbar";
import PostIndex from "@/components/Post/Posts";
import React, { useState } from "react";
import { metadata } from "@/data/Metadata";

const Posts = ({ initialData }) => {
    const [posts, setPosts] = useState(initialData);
    const [startIndex, setStartIndex] = useState(6);
    const [maxResults] = useState(6);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/posts?startIndex=${parseInt(startIndex)}&maxResults=${parseInt(maxResults)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response);
            }
            const data = await response.json();

            if (!Array.isArray(data)) {
                setHasMore(false);

                return;
            };

            setPosts((prevPosts) => [...prevPosts, ...data]);
            setStartIndex((prevStartIndex) => prevStartIndex + maxResults);

            if (data.length < maxResults) {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
            // handle the error here, e.g. show an error message to the user
        }
    };

    return (
        <>
            <Navbar />

            <div className="mx-auto max-w-3xl pt-20 p-4">
                <main>
                    {posts.map((post, index) => (
                        <PostIndex
                            key={index}
                            postID={post.idAlt}
                            postCategory={post.category}
                            postCategoryFirst={post.categoryFirst}
                            postTitle={post.title}
                            postTitleAlt={post.titleAlt}
                            postAuthorName={post.author.name}
                            postPublished={post.published}
                            postSummary={post.summary}
                            postThumbnail={post.thumbnail}
                            postLink={post.link}
                        />
                    ))}
                    {hasMore ? (
                        <Button onClick={fetchData} ariaLabel="Load More">
                            Load More
                        </Button>
                    ) : (
                        <Button disabled>
                            No Results Found!
                        </Button>
                    )}
                </main>
            </div>
        </>
    );
};

export const getStaticProps = async () => {
    const startIndex = 1;
    const maxResults = 6;

    const response = await fetch(`${metadata.url}/feeds/posts/summary?start-index=${startIndex}&max-results=${maxResults}&alt=json`);
    const data = await response.json();

    const posts = data.feed.entry.map((entry) => ({
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
            initialData: posts
        },
    };
};

export default Posts;