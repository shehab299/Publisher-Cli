function parseLink(link) {

    let url = new URL(link);

    const parts = url.pathname.split("/");

    if (parts.length < 3) {
        throw new Error("Not A Valid GitHub URL");
    };

    const owner = parts[1];
    const repo = parts[2];

    return { owner, repo };
}

export default parseLink;