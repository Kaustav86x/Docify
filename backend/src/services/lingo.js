import axios from 'axios';
const lingoApi = axios.create({
    baseURL: 'https://api.lingo.dev/v1',
    headers: {
        Authorization: `Bearer ${process.env.LINGO_API_KEY}`
    }
});
export async function translateText(text, language) {
    try {
        const { data } = await lingoApi.post('/translate', {
            text,
            target_language: language,
            context: 'documentation'
        });
        return data.translated_text || text;
    }
    catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}
export async function batchTranslate(texts, languages) {
    const results = {};
    for (const lang of languages) {
        results[lang] = {};
        for (const text of texts) {
            const translated = await translateText(text, lang);
            results[lang][text] = translated;
            await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit
        }
    }
    return results;
}
export function parseMarkdownForTranslation(markdown) {
    const lines = markdown.split('\n');
    const textLines = [];
    let inCodeBlock = false;
    for (const line of lines) {
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (!inCodeBlock && line.trim()) {
            textLines.push(line);
        }
    }
    return textLines;
}
//# sourceMappingURL=lingo.js.map