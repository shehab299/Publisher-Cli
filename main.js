#!/usr/bin/env node

import { Octokit } from '@octokit/core';
import config from './config.js';
import auth from './auth.js';
import { checkToken, saveToken } from './checkToken.js';
import checkCollaborators from './publisher/checkCollabs.js';
import parseLink from './publisher/parseLink.js';
import publish from './publisher/publish.js';
import path from 'path'

async function getToken(){

    let token = await checkToken();

    if(token) {
      return token;
    }

    const result = await auth({ type: "oauth" });
    token = result.token;
    await saveToken(token);

    return token;
}


async function main() {

  config(); 

  if(!process.env.FAUST_PATH) {
    throw new Error('FAUST_PATH not set');
  }

  const registryUrl = 'https://github.com/shehab299/Registry.git';
  const registryPath = path.join(process.env.FAUST_PATH, '.reg');
  const downloadsFolder = path.join(process.env.FAUST_PATH, '.downloads');

  const pkgurl = process.argv[2];

  if (!pkgurl) {
    throw new Error('No package URL provided');
  }

  const { owner, repo } = parseLink(pkgurl);

  let token = await getToken();

  const octokit = new Octokit({
    auth: token
  });

  let username = null;

  const { data: user } = await octokit.request('GET /user');

  const isCollab = await checkCollaborators(user.login, owner, repo, token);

  if (!isCollab) {
    throw new Error('User is not a collaborator on the repository');
  }

  if(!pkgurl || !registryPath || !registryUrl){
    throw new Error("Missing required parameters");
  }
 
  await publish(registryPath, registryUrl, pkgurl, downloadsFolder, user.login);

  console.log('Package published successfully');
}


main().catch((err) => {
  console.log(err);
  console.error('error occurred:', err.message);
  process.exit(1);
});
