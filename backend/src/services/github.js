import { Octokit } from 'octokit';
let octokit;
export function initGithub(token) {
    octokit = new Octokit({ auth: token });
}
export async function getUserRepos(token) {
    const octo = new Octokit({ auth: token });
    const { data } = await octo.rest.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: 'updated'
    });
    return data;
}
export async function getRepoFile(token, owner, repo, path) {
    const octo = new Octokit({ auth: token });
    try {
        const { data } = await octo.rest.repos.getContent({
            owner,
            repo,
            path
        });
        if ('content' in data) {
            return Buffer.from(data.content, 'base64').toString('utf-8');
        }
    }
    catch (error) {
        console.error('File fetch error:', error);
    }
    return null;
}
export async function createPullRequest(token, owner, repo, branchName, title, body, files) {
    const octo = new Octokit({ auth: token });
    // Get default branch
    const { data: repoData } = await octo.rest.repos.get({ owner, repo });
    const baseBranch = repoData.default_branch;
    // Get latest commit SHA
    const { data: refData } = await octo.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${baseBranch}`
    });
    const parentCommitSha = refData.object.sha;
    // Create tree with file changes
    const treeData = await octo.rest.git.createTree({
        owner,
        repo,
        base_tree: parentCommitSha,
        tree: files.map(f => ({
            path: f.path,
            mode: '100644',
            type: 'blob',
            content: f.content
        }))
    });
    // Create commit
    const commitData = await octo.rest.git.createCommit({
        owner,
        repo,
        message: title,
        tree: treeData.data.sha,
        parents: [parentCommitSha]
    });
    // Create branch
    await octo.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha: commitData.data.sha
    });
    // Create PR
    const prData = await octo.rest.pulls.create({
        owner,
        repo,
        title,
        body,
        head: branchName,
        base: baseBranch
    });
    return prData.data;
}
//# sourceMappingURL=github.js.map