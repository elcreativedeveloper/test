import Image from "next/image";
import Link from "next/link";
import React from "react";

const Posts = ({ postID, postCategory, postCategoryFirst, postTitle, postTitleAlt, postAuthorName, postPublished, postSummary, postThumbnail, postLink }) => {
    const absoluteUrlMiddleware = (src) => {
        if (src.startsWith('//')) {
            return `https:${src}`;
        } else {
            return src;
        }
    };

    return (
        <article id={postID} className="flex w-full flex-col items-center relative select-none justify-between overflow-hidden xl:rounded-lg xl:border rounded-none border-b xl:bg-white bg:transparent xl:mb-3 xl:p-3 mb-3 pb-3 last:mb-0 xl:last:mb-0">
            <div className="flex w-full items-center justify-between xl:flex-row flex-row">
                <div className="flex w-full flex-col items-start justify-between xl:mr-3 mr-2">
                    {postCategory && (
                        <Link href={`/label/${encodeURIComponent(postCategoryFirst)}`} alt={postCategoryFirst} className="mb-1 flex h-7 flex-row items-center justify-center text-sm font-medium no-underline text-gray-600 hover:text-blue-700"><span>{postCategoryFirst}</span></Link>
                    )}
                    <Link href={`/post/${encodeURIComponent(postTitleAlt)}-${postID}`} alt={postTitle} className="mb-1 xl:text-lg hover:text-blue-700">
                        <h2 className="w-full font-bold">{postTitle}</h2>
                    </Link>
                    <div className="mb-[2px] flex justify-start text-sm flex-row items-center text-gray-600">
                        <div className="line-clamp-1 md:flex md:flex-row md:items-center md:justify-center md:line-clamp-none">
                            <span className="font-medium">{postAuthorName}</span>
                        </div>
                        <div className="flex flex-row items-center justify-center whitespace-nowrap md:whitespace-normal xl:before:mx-1 xl:before:content-['\0000a0\002022\0000a0'] before:mx-1 before:content-['\0000a0\002022\0000a0']">
                            <time className="relative flex flex-row items-center justify-center overflow-hidden whitespace-pre-line" dateTime={postPublished}>
                                {/* <span className="transition-transform line-clamp-1 md:line-clamp-none">{postPublished}</span> */}
                            </time>
                        </div>
                    </div>
                    <div className="relative text-ellipsis text-[13px] hidden xl:line-clamp-2 xl:block text-gray-600">{postSummary}</div>
                </div>

                <div className="flex flex-col items-start justify-between xl:w-auto w-auto">
                    <Link href={`/post/${encodeURIComponent(postTitleAlt)}-${postID}`} alt={postTitle} title={postTitle} className="relative block overflow-hidden pb-0 h-[100px] w-[100px] rounded-lg">
                        <Image src={absoluteUrlMiddleware(postThumbnail)} width={100} height={100} alt={postTitle} className="rounded-lg object-cover object-center bg-gray-300 text-transparent" />
                    </Link>
                </div>
            </div>

            <div className="flex w-full flex-row flex-wrap items-center justify-between xl:mt-3 mt-2">
                <Link href={postLink} alt={postTitle} className="flex flex-row items-center justify-center text-sm text-blue-700 hover:underline" target="_blank" rel="noopener noreferrer">Lihat Postingan Asli</Link>
            </div>
        </article>
    );
};

export default Posts