import ns from "@ns";
import { getAllFilesInRepository } from "/gh/gh-comms";
import { RemoteFiles } from "/general/remote-file";

function sanitize(str: string) {
    return str.replace(/[^a-zA-Z0-9\s\/.]/g, '').replace(/[\s]+/g, '-');
}

export async function main(ns: ns.NS) {
    const repo = (ns.args[0] as string).replace("https://github.com/", "");
    const owner = repo.split('/')[0];
    const repository = repo.split('/')[1];
    const subdir = ns.args[1] as string;
    const branch = ns.args[2] as string;
    const remote = new RemoteFiles(ns);
    let auth;
    if (ns.fileExists("git-config/auth.txt", "home")) {
        auth = (await remote.read("git-config/auth.txt", "home")).trim();
    }
    const files = await getAllFilesInRepository(owner, repository, branch, subdir, auth);
    for (const file of files) {
        await handleFile(ns, file, repository, subdir);
    }
}

async function handleFile(ns: ns.NS, file: {name: string; path: string; url: string}, repo_name: string, subdir = '') {
    ns.tprint(`cloning file ${sanitize(file.name)} to ${repo_name}/${sanitize(file.path.replace(subdir, ''))}`);
    const data = await (await fetch(file.url)).text();
    ns.write(`${repo_name}/${sanitize(file.path.replace(subdir, ''))}`, data);
    ns.tprint(`cloned file ${sanitize(file.name)} to ${repo_name}/${sanitize(file.path.replace(subdir, ''))}`);
}