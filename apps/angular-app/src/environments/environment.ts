import { createEnvironment } from '@cook/core';

// 从全局变量中获取环境变量（通过构建时注入）
// 在部署时（如 GitHub Actions），可以通过 --define 参数注入
declare const GIT_TOKEN: string | undefined;

export const environment = createEnvironment({
  production: false,
  token: typeof GIT_TOKEN !== 'undefined' ? GIT_TOKEN : 'atp_1o5nk6p3ofq0xuet98x4qt5y8qqrlcw0',
  repoOwner: 'eveningwater',
  repoName: 'CookLikeHOC'
});
