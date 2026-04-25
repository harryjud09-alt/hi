const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

const SHOWS = [
    { name: "Family Guy", id: "tt0182576" },
    { name: "The Simpsons", id: "tt0096697" },
    { name: "Rick and Morty", id: "tt2852451" },
    { name: "Marvel's What If...?", id: "tt10168312" },
    { name: "Superstore", id: "tt4477976" },
    { name: "Brooklyn Nine-Nine", id: "tt2467372" },
    { name: "Georgie & Mandy's First Marriage", id: "tt31737709" }
];

const manifest = {
    id: "org.animation.shuffle.v2",
    version: "2.1.0",
    name: "Ultimate Episode Shuffler",
    description: "Random episodes from your 7 favorite shows. Works with Torrentio.",
    resources: ["catalog", "stream"],
    types: ["series"],
    catalogs: [{ type: "series", id: "anim_shuffle", name: "Animation & Comedy Shuffle" }]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(() => {
    return Promise.resolve({
        metas: [{
            id: "shuffle_trigger",
            type: "series",
            name: "🎲 SHUFFLE ALL SHOWS",
            poster: "https://i.imgur.com/8N99vXq.png",
            description: "Click to play a random episode of The Simpsons, Brooklyn 99, and more!"
        }]
    });
});

builder.defineStreamHandler(async ({ id }) => {
    if (id === "shuffle_trigger" || id.startsWith("tt")) {
        const show = SHOWS[Math.floor(Math.random() * SHOWS.length)];
        try {
            const metaRes = await fetch(`https://v3-cinemeta.strem.io/meta/series/${show.id}.json`);
            const { meta } = await metaRes.json();
            const airedEpisodes = meta.videos.filter(v => v.released && new Date(v.released) < new Date());
            const randomEp = airedEpisodes[Math.floor(Math.random() * airedEpisodes.length)];

            return {
                streams: [{
                    title: `🎲 PLAYING: ${show.name}`,
                    description: `S${randomEp.season} E${randomEp.episode} - ${randomEp.name}`,
                    externalUrl: `stremio://detail/series/${show.id}/${randomEp.id}`
                }]
            };
        } catch (e) { console.error("Shuffle Error:", e); }
    }
    return { streams: [] };
});

const port = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port });
