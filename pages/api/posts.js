import fetch from "node-fetch";

const handler = async (req, res) => {
    const { startIndex, maxResults } = req.query;
    const apiUrl = `https://www.elcreativeacademy.com/feeds/posts/summary?max-results=${maxResults}&start-index=${startIndex}&alt=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const posts = data.feed.entry.map((entry) => ({
            id: entry.id.$t.split("-").pop(),
            title: entry.title.$t,
            link: entry.link[4].href,
        }));

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handler