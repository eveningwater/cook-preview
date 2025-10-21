import { createEnvironment } from '@cook/core';

const env = import.meta.env as Record<string, string>;

export const environment = createEnvironment({
  production: false,
  token: env.VITE_GIT_TOKEN || 'atp_1o5nk6p3ofq0xuet98x4qt5y8qqrlcw0',
  repoOwner: env.VITE_REPO_OWNER || 'eveningwater',
  repoName: env.VITE_REPO_NAME || 'CookLikeHOC'
});
