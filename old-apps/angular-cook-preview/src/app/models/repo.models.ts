export interface RepoItem {
  mode: string;
  path: string;
  sha: string;
  type: 'tree' | 'blob';
}

export interface RepoContent {
  content?: string;
  download_url?: string;
  encoding?: string;
  entries?: RepoItem[];
  git_url?: string;
  html_url?: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
  url?: string;
}

export interface RecipeCategory {
  name: string;
  path: string;
  sha: string;
  recipes?: Recipe[];
  isExpanded?: boolean;
  hasSearchMatch?: boolean;
}

export interface Recipe {
  name: string;
  path: string;
  sha: string;
  content?: string;
  images?: string[];
}
