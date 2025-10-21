export interface Environment {
  production: boolean;
  gitBase: string;
  apiBase: string;
  token: string;
  repoOwner: string;
  repoName: string;
  repoPath: string;
  repoUrl: string;
  rawUrlPrefix: string;
  blobUrlPrefix: string;
}

export const createEnvironment = (config: {
  production?: boolean;
  gitBase?: string;
  apiBase?: string;
  token?: string;
  repoOwner?: string;
  repoName?: string;
}): Environment => {
  const {
    production = false,
    gitBase = 'https://atomgit.com',
    apiBase = 'https://api.atomgit.com',
    token = 'atp_1o5nk6p3ofq0xuet98x4qt5y8qqrlcw0',
    repoOwner = 'eveningwater',
    repoName = 'CookLikeHOC'
  } = config;

  return {
    production,
    gitBase,
    apiBase,
    token,
    repoOwner,
    repoName,
    get repoPath() {
      return `${this.repoOwner}/${this.repoName}`;
    },
    get repoUrl() {
      return `${this.gitBase}/${this.repoOwner}/${this.repoName}`;
    },
    get rawUrlPrefix() {
      return `${this.gitBase}/${this.repoOwner}/${this.repoName}/raw/main`;
    },
    get blobUrlPrefix() {
      return `${this.gitBase}/${this.repoOwner}/${this.repoName}/blob/main`;
    }
  };
};
