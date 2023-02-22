import fetch from "node-fetch";
import { metadata } from "@/data/Metadata";

const handler = async (req, res) => {
    const { startIndex, maxResults } = req.query;
    const apiUrl = `${metadata.url}/feeds/posts/summary?start-index=${parseInt(startIndex)}&max-results=${parseInt(maxResults)}&alt=json`;

    try {
        const response = await fetch(apiUrl);
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

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

export default handler