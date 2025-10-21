import { createEnvironment } from '@cook/core';

// 环境变量配置示例文件
// 复制此文件并重命名为 environment.ts 或 environment.development.ts
// 接口数据来源的配置，可以fork我的仓库，然后配置自己的仓库,仓库地址: https://atomgit.com/eveningwater/CookLikeHOC
// 也可以fork： https://github.com/eveningwater/CookLikeHOC，不过就需要修改接口地址和基础地址

export const environment = createEnvironment({
  production: false,
  token: 'your_token_here',
  repoOwner: 'your_repo_owner',
  repoName: 'your_repo_name'
});
