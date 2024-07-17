#!/usr/bin/env node

import { Octokit } from '@octokit/core';
import config from './config.js';
import auth from './auth.js';
import { checkToken, saveToken } from './checkToken.js';
import checkCollaborators from './publisher/checkCollabs.js';
import parseLink from './publisher/parseLink.js';
import publish from './publisher/publish.js';


const REGISTRY_URL= 'https://github.com/shehab299/Registry.git'
const REGISTRY_PATH= '/home/shehab/Desktop/faust-env/Registry'
const DOWNLOADS_FOLDER= '/home/shehab/Desktop/faust-env/downloads'

config(); 

if(!process.env.FAUST_PATH) {
  console.error('FAUST_PATH not set');
  process.exit(1);
}


async function main() {

  const pkgurl = process.argv[2];

  if (!pkgurl) {
    throw new Error('No package URL provided');
  }

  const { owner, repo } = parseLink(pkgurl);

  let token = null;

  try {
    token = await checkToken();
    if(!token) {
      throw new Error('No valid token found');
    }
  } catch (error) {
    try {
      const result = await auth({ type: "oauth" });
      token = result.token;
      await saveToken(token);
    } catch (authError) {
      console.error('Authentication failed:', authError.message);
      process.exit(1);
    }
  }

  const octokit = new Octokit({
    auth: token
  });


  let username = null;

  try {
    const { data: user } = await octokit.request('GET /user');
    username = user.login;
  } catch (apiError) {
    console.log(apiError);
    console.error('Failed to fetch authenticated user:', apiError.message);
    process.exit(1);
  }

  const isCollab = await checkCollaborators(username, owner, repo, token);

  if (!isCollab) {
    throw new Error('User is not a collaborator on the repository');
  }

  const registryUrl = REGISTRY_URL;
  const registryPath = REGISTRY_PATH;
  const downloadsFolder = DOWNLOADS_FOLDER;

  if(!pkgurl || !registryPath || !registryUrl){
    throw new Error("Missing required parameters");
  }

  await publish(registryPath, registryUrl, pkgurl, downloadsFolder, username);
}

main().catch((err) => {
  console.log(err);
  console.error('error occurred:', err.message);
  process.exit(1);
});
