const fetch = require("node-fetch");
const fs = require("fs");
const Promise = require("bluebird");
const multistream = require("multistream");

// eslint-disable-next-line no-useless-escape
const regex = /[^\.!\?]+[\.!\?]+["']?|.+$/g;

class GoogleTTS {
    constructor(language = "en") {
        this.root = "http://translate.google.com/translate_tts";

        this.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0"
        };

        this.language = language;
    }

    async stream(text) {
        const parts = this.tokenize(text);
        const streams = await Promise.map(parts, async (part, index) => {
            const args = this.generateArgs(part, parts.length, index);
            return await this.request(`${this.root}?${args}`);
        });

        return new multistream(streams);
    }

    async save(file, text) {
        const writeStream = fs.createWriteStream(file);
        const stream = await this.stream(text);
        
        return await new Promise(resolve => {
            stream.once("end", () => resolve(file));
            stream.pipe(writeStream);
        })
    }

    async request(url) {
        const request = await fetch(url, {
            method: "GET",
            headers: this.headers
        });

        return request.body;
    }

    generateArgs(text, partsLen, index) {
        return new URLSearchParams({
            ie: "UTF-8",
            tl: this.language,
            q: text,
            total: partsLen,
            idx: index,
            client: "tw-ob",
            textlen: text.length
        });
    }

    tokenize(text) {
        const match = text.matchAll(regex);
        const parts = Array.from(match).flat();
        return parts.map(part => part.trim());
    }
}

module.exports = GoogleTTS;