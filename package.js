const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

// Use your actual Trakt List ID or keep these IDs as the "Pool"
const SHOWS = [
    { name: "Family Guy", id: "tt0182576" },
    { name: "The Simpsons", id: "tt0096697" },
    { name: "Rick and Morty", id: "tt2852451" },
    { name: "Marvel's What If...?", id: "tt10168312" }
];

const manifest = {
    id: "org.animation.shuffle.cloud",
    version: "1.0.0",
    name: "Animation Shuffle Cloud",
    description: "24/7 Randomizer for Fire Stick",
    resources: ["stream"],
    types: ["series"],
    idPrefixes: ["tt"] 
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ id }) => {
    // This triggers when you click the 'Shuffle' button we'll put in your Trakt List
    const show = SHOWS[Math.floor(Math.random() * SHOWS.length)];
    
    try {
        const metaRes = await fetch(`https://v3-cinemeta.strem.io/meta/series/${show.id}.json`);
        const { meta } = await metaRes.json();
        const airedEpisodes = meta.videos.filter(v => v.released && new Date(v.released) < new Date());
        const randomEp = airedEpisodes[Math.floor(Math.random() * airedEpisodes.length)];

        return {
            streams: [{
                title: `🎲 Play Random: ${show.name}`,
                description: `S${randomEp.season} E${randomEp.episode}`,
                externalUrl: `stremio://detail/series/${show.id}/${randomEp.id}`
            }]
        };
    } catch (e) {
        return { streams: [] };
    }
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
