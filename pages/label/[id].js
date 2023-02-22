import Button from "@/components/Buttons";
import Navbar from "@/components/Navbar";
import PostIndex from "@/components/Post/Posts";
import React, { useState } from "react";
import { Metadata } from "@/data/Metadata";
import { getPosts } from "@/utils/getPosts";

const Labels = ({ initialData, labelName }) => {
    const [posts, setPosts] = useState(initialData);
    const [startIndex, setStartIndex] = useState(6);
    const [maxResults] = useState(6);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/labels?labelName=${encodeURIComponent(labelName)}&startIndex=${startIndex}&maxResults=${maxResults}`);
            const data = await response.json();

            if (!Array.isArray(data) || data.length < maxResults) {
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

    const response = await fetch(`${Metadata.url}/feeds/posts/summary/-/${encodeURIComponent(labelName)}?start-index=${startIndex}&max-results=${maxResults}&alt=json`);
    const data = await response.json();

    return {
        props: {
            initialData: getPosts(data.feed.entry, Math.min(parseInt(maxResults), data.feed.openSearch$totalResults.$t)),
            labelName: labelName
        }
    }
}

export default Labels;