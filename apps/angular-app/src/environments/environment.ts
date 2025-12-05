import { createEnvironment } from '@cook/core';

// 从全局变量中获取环境变量（通过构建时注入）
// 在部署时（如 GitHub Actions），可以通过 --define 参数注入
declare const GIT_TOKEN: string | undefined;

export const environment = createEnvironment({
  production: false,
  token: typeof GIT_TOKEN !== 'undefined' ? GIT_TOKEN : 'PEC8ABsV93-Ve1FAAkTmecMx',
  repoOwner: 'eveningwater11',
  repoName: 'CookLikeHOC'
});
