import { useRouter } from "next/router";

const Post = ({ post }) => {
    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.content}</p>
        </div>
    );
};

export const getServerSideProps = async ({ params }) => {
    const encodedTitle = params.id;
    const title = encodedTitle.match(/(\d+)$/);
    const number = title ? title[1] : null;
    // const res = await fetch(`https://www.elcreativeacademy.com/feeds/posts/default?alt=json&q=${encodeURIComponent(title)}`);
    const res = await fetch(`https://www.elcreativeacademy.com/feeds/posts/default/${encodeURIComponent(number)}?alt=json`);
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
}


export default Post;
