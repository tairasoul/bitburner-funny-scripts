import { NS } from "@ns";

export async function getAllFilesInRepository(owner: string, repo: string, branch = 'main', path = '', token?: string) {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const headers = token ? { 'Authorization': `Bearer ${token}`} : undefined;
    const response = await fetch(apiUrl, { headers });

    const data = await response.json();

    const files: {name: string, path: string, url: string}[] = [];

    for (const item of data) {
        if (item.type === 'file') {
            const fileName = item.name;
            const fileUrl = item.download_url;
            let filePath = path ? `${path}/${fileName}` : fileName;

            if (fileName.endsWith('.js')) {
                files.push({ name: fileName, path: filePath, url: fileUrl });
            } else if (fileName.endsWith('.md')) {
                files.push({ name: fileName.replace(/\.md$/, '.txt'), path: filePath.replace(/\.md$/, '.txt'), url: fileUrl });
            }
        } else if (item.type === 'dir') {
            const subFiles = await getAllFilesInRepository(owner, repo, branch, item.path, token);
            files.push(...subFiles);
        }
    }

    return files;
}