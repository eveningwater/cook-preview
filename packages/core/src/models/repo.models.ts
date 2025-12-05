export interface RepoItem {
  sha: string;
  name: string;
  type: 'tree' | 'blob' | string;
  path: string;
  mode: string;
  md5?: string;
}

export interface RepoContent {
  type: string;
  encoding?: string;
  size: number;
  name: string;
  path: string;
  content?: string; // Base64 编码的内容
  sha: string;
  url?: string;
  html_url?: string;
  download_url?: string;
  _links?: {
    self?: string;
    html?: string;
  };
  // 兼容旧格式
  entries?: RepoItem[];
  git_url?: string;
}

export interface RecipeCategory {
  name: string;
  path: string;
  sha: string;
  recipes?: Recipe[];
  pagination?: PaginationInfo; // 分页信息
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

/**
 * 分页信息
 */
export interface PaginationInfo {
  totalCount: number; // 总数据数
  totalPage: number; // 总页数
  currentPage: number; // 当前页码
  perPage: number; // 每页数量
}

/**
 * 带分页信息的菜谱列表响应
 */
export interface PaginatedRecipeResponse {
  recipes: Recipe[];
  pagination: PaginationInfo;
}
