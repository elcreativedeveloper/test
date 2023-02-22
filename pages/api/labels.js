import fetch from "node-fetch";
import { Metadata } from "@/data/Metadata";
import { getPosts } from "@/utils/getPosts";

const LabelsAPI = async (req, res) => {
    const { labelName, startIndex, maxResults } = req.query;
    const apiUrl = `${Metadata.url}/feeds/posts/summary/-/${encodeURIComponent(labelName)}?start-index=${parseInt(startIndex)}&max-results=${parseInt(maxResults)}&alt=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const posts = getPosts(data.feed.entry, Math.min(parseInt(maxResults), parseInt(data.feed.openSearch$totalResults.$t)));

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
};

export default LabelsAPI