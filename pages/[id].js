import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { id } from "date-fns/locale";
import DOMPurify from "dompurify";

const Post = ({ post }) => {
    const absoluteUrlMiddleware = (src) => {
        if (src.startsWith('//')) {
            return `https:${src}`;
        } else {
            return src;
        }
    };

    const modifyClassHook = (node) => {
        if (node.hasAttribute("class")) {
            node.removeAttribute("class");
        } else if (node.hasAttribute("id")) {
            node.removeAttribute("id");
        };

        return node
    };

    const useSanitizeContent = (content) => {
        const [sanitizedContent, setSanitizedContent] = useState('');

        useEffect(() => {
            const dirty = DOMPurify.sanitize(content, {
                ADD_TAGS: ['pre'],
                FORBID_ATTR: ["style"],
                USE_PROFILES: { html: true },
                transformers: {
                    // Modify the <a> elements
                    // `aConfig` is an object that contains the `href` and `target` attributes
                    // `env` is an object that contains any additional environment information
                    // In this case, we check if the `href` attribute starts with `http` or `https`
                    // If it does, we set the `target` attribute to `_blank`
                    // If it doesn't, we leave the `target` attribute empty
                    // The `return` statement returns the modified element
                    element: (element, { aConfig, env }) => {
                        if (element.tagName === 'a' && /^https?:\/\//i.test(aConfig.href)) {
                            element.setAttribute('target', '_blank');
                        };

                        return element
                    }
                }
            });

            const clean = dirty.split("<br>").map((paragraph) => `<p>${paragraph}</p>`);
            const clean1 = clean.join("").replace(/<([^>]+?)>(\s|&nbsp;)*<\/\1>/g, '').trim();
            DOMPurify.addHook("afterSanitizeAttributes", modifyClassHook);

            setSanitizedContent(clean1);
        }, [content]);

        return sanitizedContent;
    };

    return (
        <div className="mx-auto max-w-3xl p-4">
            <Head>
                <title>{post.title}</title>
            </Head>
            <article className="post_article flex w-full flex-col items-center justify-center">
                <div className="flex w-full items-center justify-between flex-col border-b pb-2">
                    <div className="flex w-full flex-col items-start justify-between">
                        <nav className="mb-2 flex flex-row items-center justify-center text-sm">
                            <Link href="/" alt="Home" className="font-bold hover:text-blue-700">Home</Link>
                            <span className="text-gray-600 mx-1">/</span>
                            <Link href="/" alt="{post.category[0]}" className="text-gray-600 hover:text-blue-700">{post.category[0]}</Link>
                        </nav>
                        <h1 className="w-full text-2xl font-bold mb-2">{post.title}</h1>
                        <div className="mb-1 flex w-full flex-row items-center justify-between text-sm">
                            <div className="flex flex-row items-center justify-between">
                                <div className="relative h-[42px] w-[42px] rounded-full mr-2">
                                    <Image src={absoluteUrlMiddleware(post.author.image)} width={42} height={42} alt={post.author.name} title={post.author.name} className="rounded-full" />
                                </div>
                                <div className="flex flex-col flex-wrap items-start justify-between">
                                    <div className="flex flex-row items-center justify-center"><span className="notranslate font-bold line-clamp-1">{post.author.name}</span></div>
                                    <div className="flex flex-row items-center justify-center text-gray-600">
                                        <time className="relative flex flex-row items-center justify-center overflow-hidden whitespace-pre-line" dateTime={post.published}>
                                            <span className="transition-transform line-clamp-1 md:line-clamp-none">{post.publishedAgo}</span>
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between">

                        </div>
                    </div>
                </div>
                <div className="post_body flex w-full flex-row flex-wrap items-center justify-between mt-2">
                    <div className="relative mb-3 w-full border-b pb-3 leading-[1.7rem]" dangerouslySetInnerHTML={{ __html: useSanitizeContent(post.content) }}></div>
                </div>
            </article>
        </div>
    );
};


export async function getServerSideProps({ params }) {
    const encodedTitle = params.id;
    const title = encodedTitle.replace(/-/g, " ").replace(/_/g, " ");
    const res = await fetch(`https://www.elcreativeacademy.com/feeds/posts/default?alt=json&q=${encodeURIComponent(title)}`);
    const data = await res.json();

    const post = {
        id: data.feed.entry[0].id.$t.split(".").pop().replace("post-", ""),
        category: data.feed.entry[0].category.map((category) => category.term),
        title: data.feed.entry[0].title.$t,
        published: data.feed.entry[0].published.$t,
        publishedAgo: formatDistance(new Date(data.feed.entry[0].published.$t), new Date(), { addSuffix: true, locale: id }),
        updated: data.feed.entry[0].updated.$t,
        content: data.feed.entry[0].content.$t,
        link: data.feed.entry[0].link[4].href,
        author: {
            name: data.feed.entry[0].author[0].name.$t,
            url: data.feed.entry[0].author[0].uri.$t,
            image: data.feed.entry[0].author[0].gd$image.src,
        },
        thumbnail: data.feed.entry[0].media$thumbnail.url,
        comments: data.feed.entry[0].thr$total.$t,
    };

    return {
        props: {
            post: post,
        },
    };
}


export default Post;