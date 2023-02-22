import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { Metadata } from "@/data/Metadata";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
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

            setSanitizedContent(dirty);
        }, [content]);

        return sanitizedContent;
    };

    return (
        <>
            <Head>
                <title>{post.title}</title>
                <meta content='Material Design Multipurpose Blogger x Next.js Template Inspired by Google Material Design.' name='description' />
                <meta content='Material Design Multipurpose Blogger x Next.js Template Inspired by Google Material Design.' name='keywords' />
                <meta content='Material Design Multipurpose Blogger x Next.js Template Inspired by Google Material Design.' name='news_keywords' />
                <meta content='Yasya El Hakim' name='author' />
                <meta content='Yasya El Hakim' name='copyright' />
                <meta content='en' name='language' />

                <meta content="Materia X Next" property='og:site_name' />
                <meta content='https://test-elca.vercel.app/' property='og:url' />
                <meta content={post.title} property='og:title' />
                <meta content='en' property='og:locale' />
                <meta content='website' property='og:type' />
                <meta content='Material Design Multipurpose Blogger x Next.js Template Inspired by Google Material Design.' property='og:description' />
                <meta content='/images/featured-image.jpg' property='og:image' />

                <meta content={post.title} name='twitter:title' />
                <meta content='/images/featured-image.jpg' property='twitter:image' />
                <meta content='Material Design Multipurpose Blogger x Next.js Template Inspired by Google Material Design.' property='twitter:description' />
                <meta content='https://test-elca.vercel.app/' name='twitter:url' />
                <meta content='https://test-elca.vercel.app/' name='twitter:domain' />
                <meta content='summary_large_image' name='twitter:card'/>
            </Head>

            <Navbar />

            <div className="mx-auto max-w-3xl pt-20 p-4">
                <main>
                    <article className="post_article flex w-full flex-col items-center justify-center">
                        <div className="flex w-full items-center justify-between flex-col border-b pb-2">
                            <div className="flex w-full flex-col items-start justify-between">
                                <nav className="mb-2 flex flex-row items-center justify-center text-sm">
                                    <Link href="/" alt="Home" className="font-bold hover:text-blue-700">Home</Link>
                                    <span className="text-gray-600 mx-1">/</span>
                                    <Link href="/" alt={post.categoryFirst} className="text-gray-600 hover:text-blue-700">{post.categoryFirst}</Link>
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
                                                    <span className="transition-transform line-clamp-1 md:line-clamp-none">{post.published}</span>
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
                </main>
            </div>
        </>
    );
};

export const getServerSideProps = async ({ params }) => {
    const encodedTitle = params.id;
    const title = encodedTitle.match(/(\d+)$/);
    const number = title ? title[1] : null;
    const res = await fetch(`${Metadata.url}/feeds/posts/default/${encodeURIComponent(number)}?alt=json`);
    const data = await res.json();

    const post = {
        title: data.entry.title.$t,
        content: data.entry.content.$t,
        categoryFirst: data.entry.category ? data.entry.category[0].term : "",
        author: {
            name: data.entry.author[0].name.$t,
            url: data.entry.author[0].uri ? data.entry.author[0].uri.$t : "",
            image: data.entry.author[0].gd$image.src,
        },
        published: data.entry.published.$t,
    };

    return {
        props: {
            post: post,
        },
    };
};

export default Post;
