import Button from "@/components/Buttons";
import Navbar from "@/components/Navbar";
import PostIndex from "@/components/Post/Posts";
import React, { useState } from "react";
import { metadata } from "@/data/Metadata";

const Labels = ({ initialData, labelName }) => {
    const [posts, setPosts] = useState(initialData);
    const [startIndex, setStartIndex] = useState(7);
    const [maxResults, setMaxResults] = useState(6);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        const response = await fetch(`/api/labels?labelName=${encodeURIComponent(labelName)}&startIndex=${startIndex}&maxResults=${maxResults}`);
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
                        <Button onClick={fetchData}>
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

export const getServerSideProps = async ({ params }) => {
    const labelName = params.id;

    const startIndex = 1;
    const maxResults = 6;

    const response = await fetch(`${metadata.url}/feeds/posts/summary/-/${encodeURIComponent(labelName)}?max-results=${maxResults}&start-index=${startIndex}&alt=json`);
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
            initialData: posts,
            labelName: labelName
        },
    };
};

export default Labels;