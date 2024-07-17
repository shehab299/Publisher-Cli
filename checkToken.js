import fs from 'fs'
import path from "path";
import axios from "axios";
import { Octokit } from '@octokit/core';


function checkCredsFile(credentialsPath) {
    return fs.existsSync(credentialsPath);
}

async function checkToken() {

    const credentialsPath = path.join(process.env.FAUST_PATH, 'user.json');
  
    if (!fs.existsSync(credentialsPath)) {
      return null;
    }
  
    let user = null;
  
    try {
      user = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    } catch (e) {
      await fs.promises.rm(credentialsPath);
      return null;
    }
  
    if (!user.token || user.token === '') {
      return null;
    }  
    const octokit = new Octokit({
      auth: user.token
    });
  
    try {
      await octokit.request('HEAD /user');
      return user.token; // Token is valid
    } catch (e) {
      await fs.promises.rm(credentialsPath); 
      return null;
    }
  }
  
async function saveToken(token){

    let credentialsPath = path.join(process.env.FAUST_PATH, 'user.json');

    if(!checkCredsFile(credentialsPath)) {
        fs.writeFileSync(credentialsPath, JSON.stringify({
            token
        }));
    }

    let user = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    user.token = token;
    fs.writeFileSync(credentialsPath, JSON.stringify(user));
};


export { saveToken, checkToken };


