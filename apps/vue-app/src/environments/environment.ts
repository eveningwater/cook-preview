import { createEnvironment } from '@cook/core';

const env = import.meta.env as Record<string, string>;

export const environment = createEnvironment({
  production: false,
  token: env.VITE_GIT_TOKEN || 'PEC8ABsV93-Ve1FAAkTmecMx',
  repoOwner: env.VITE_REPO_OWNER || 'eveningwater11',
  repoName: env.VITE_REPO_NAME || 'CookLikeHOC'
});