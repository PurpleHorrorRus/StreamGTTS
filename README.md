## Stream GTTS

Lightweight and simple library for implementation of Google TTS.

### Installation
```bash
npm install https://github.com/PurpleHorrorRus/StreamGTTS
or
yarn add https://github.com/PurpleHorrorRus/StreamGTTS
```

### Usage

Stream audio

```javascript
import TTS from "stream-gtts";
const TTSClient = new TTS("en");
const stream = TTSClient.stream("Hello World!");
```

Save to file

```javascript
import TTS from "stream-gtts";
const TTSClient = new TTS("en");
const file = TTSClient.save("./tts.mp3", "Hello World!");
```