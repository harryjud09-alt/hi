const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

// The pool of shows your addon will shuffle from
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
    description: "24/7 Randomizer for Fire Stick. Works with Torrentio.",
    resources: ["catalog", "stream"],
    types: ["series", "movie"],
    catalogs: [{ 
        type: "series", 
        id: "anim_shuffle", 
        name: "Animation Shuffle" 
    }],
    idPrefixes: ["tt", "shuffle_now"]
};

const builder = new addonBuilder(manifest);
