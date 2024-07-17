import axios from "axios";

async function checkCollaborators(username , owner , repo, token){

    const response = await axios({
        method: "get",
        url: `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if(response.status === 204){
        return true;
    }

    return false;
};


export default checkCollaborators;
