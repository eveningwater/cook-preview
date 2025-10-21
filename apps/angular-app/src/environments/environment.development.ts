import { createEnvironment } from '@cook/core';

export const environment = createEnvironment({
  production: false,
  token: 'your_token_here',
  repoOwner: 'your_repo_owner',
  repoName: 'your_repo_name'
});
