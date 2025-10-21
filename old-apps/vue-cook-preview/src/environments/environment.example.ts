// 环境变量配置示例文件
// 复制此文件并重命名为 environment.ts
// 接口数据来源的配置，可以fork我的仓库，然后配置自己的仓库,仓库地址: https://atomgit.com/eveningwater/CookLikeHOC
// 也可以fork： https://github.com/eveningwater/CookLikeHOC，不过就需要修改接口地址和基础地址

export const environment = {
  production: false, // 生产环境设为 true，开发环境设为 false
  
  // Git 平台相关配置（支持 AtomGit、GitHub 等）
  gitBase: 'https://atomgit.com',  // Git 平台网站基础地址（也可以是 https://github.com）
  apiBase: 'https://api.atomgit.com',  // API 基础地址（也可以是 https://api.github.com）
  
  // 仓库配置
  // Token 获取优先级：
  // 1. 环境变量 VITE_GIT_TOKEN（推荐用于部署）
  // 2. 下面配置的默认值（用于本地开发）
  token: import.meta.env.VITE_GIT_TOKEN || 'your_token_here',
  repoOwner: import.meta.env.VITE_REPO_OWNER || 'your_repo_owner', // 仓库所有者
  repoName: import.meta.env.VITE_REPO_NAME || 'your_repo_name', // 仓库名称
  
  // 便捷方法：获取完整的仓库路径
  get repoPath() {
    return `${this.repoOwner}/${this.repoName}`;
  },
  
  // 便捷方法：获取仓库主页URL
  get repoUrl() {
    return `${this.gitBase}/${this.repoOwner}/${this.repoName}`;
  },
  
  // 便捷方法：获取Raw文件URL前缀
  get rawUrlPrefix() {
    return `${this.gitBase}/${this.repoOwner}/${this.repoName}/raw/main`;
  },
  
  // 便捷方法：获取Blob文件URL前缀
  get blobUrlPrefix() {
    return `${this.gitBase}/${this.repoOwner}/${this.repoName}/blob/main`;
  }
};

