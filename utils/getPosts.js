export const getPosts = (entry, maxResults) => {
    const availableMaxResults = Math.min(maxResults, entry.length);

    return entry.slice(0, availableMaxResults).map((entry) => ({
        idAlt: entry.id.$t.split("-").pop(),
        category: entry.category ? entry.category.map((category) => category.term) : "",
        categoryFirst: entry.category ? entry.category[0].term : "",
        title: entry.title.$t,
        titleAlt: entry.title.$t.toLowerCase()
            .replace(/[^\w\s:-\\/]/g, '')
            .replace(/[:/]/g, '-')
            .replace(/[\\/]/g, '-')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            .replace(/ /g, '-'),
        published: entry.published.$t,
        summary: entry.summary.$t.trim().replace(/\s+/g, " "),
        link: entry.link.find((link) => link.rel === "alternate").href,
        author: {
            name: entry.author[0].name.$t,
            url: entry.author[0].uri ? entry.author[0].uri.$t : "",
            image: entry.author[0].gd$image.src,
        },
        thumbnail: entry.media$thumbnail ? entry.media$thumbnail.url.replace(/\/s[0-9]+(\-c)?/, '/s600-c').replace(/=s[0-9]+(\-c)?/, '=s600-c').replace(/.*?:\/\//g, '//') : "https://resources.blogblog.com/img/blank.gif",
    }));
};