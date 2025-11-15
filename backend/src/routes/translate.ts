import express, { type Request, type Response } from 'express';
import { getRepoFile, createPullRequest } from '../services/github.js';
import { batchTranslate, parseMarkdownForTranslation } from '../services/lingo.js';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { token, owner, repo, filePath, languages } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get original file
    const fileContent = await getRepoFile(token, owner, repo, filePath);
    if (!fileContent) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Parse markdown
    const textLines = parseMarkdownForTranslation(fileContent);

    // Translate
    const translations = await batchTranslate(textLines, languages);

    // Generate translated files
    const files = languages.map((lang : string) => {
      let translatedContent = fileContent;
      for (const line of textLines) {
        translatedContent = translatedContent.replace(
          line,
          translations[lang]?.[line] ?? line
        );
      }

      return {
        path: `${filePath.replace('.md', '')}.${lang}.md`,
        content: translatedContent
      };
    });

    // Create PR
    const branchName = `docs/localization-${Date.now()}`;
    const prData = await createPullRequest(
      token,
      owner,
      repo,
      branchName,
      `🌍 Add multilingual documentation (${languages.join(', ')})`,
      `This PR adds documentation in ${languages.join(', ')} using Docify AI localization.`,
      files
    );

    res.json({
      success: true,
      pr_url: prData.html_url,
      pr_number: prData.number,
      languages
    });
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message || 'Translation failed' });
  }
});

export default router;