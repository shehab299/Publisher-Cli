import { createOAuthDeviceAuth } from '@octokit/auth-oauth-device';


const clientId = 'Ov23liqZr7tHgzYreUKw';
const clientSecret = '9d41928499e880be3b2836c9c0b16a95db9d345e';

const auth = createOAuthDeviceAuth({
    clientType: 'oauth-app',
    clientId: clientId,
    clientSecret: clientSecret,
    scopes: ['repo', 'user'], 
    onVerification({ user_code, verification_uri }) {
      console.log(`Open ${verification_uri}`);
      console.log(`Enter code: ${user_code}`);
    }
});
  
  
export default auth;
  