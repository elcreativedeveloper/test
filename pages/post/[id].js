import Navbar from "@/components/Navbar";
import React from "react";
import { metadata } from "@/data/Metadata";

const Post = ({ post }) => {
    return (
        <>
            <Navbar />

            <div className="mx-auto max-w-3xl pt-20 p-4">
                <main>
                    <h1>{post.title}</h1>
                    <div className="relative mb-3 w-full border-b pb-3 leading-[1.7rem]" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                </main>
            </div>
        </>
    );
};

export const getServerSideProps = async ({ params }) => {
    const encodedTitle = params.id;
    const title = encodedTitle.match(/(\d+)$/);
    const number = title ? title[1] : null;
    const res = await fetch(`${metadata.url}/feeds/posts/default/${encodeURIComponent(number)}?alt=json`);
    const data = await res.json();
    const post = {
        title: data.entry.title.$t,
        content: data.entry.content.$t,
    };

    return {
        props: {
            post: post,
        },
    };
};

export default Post;
