/**
 * 规范化路径，处理各种相对路径格式
 */
export function normalizePath(path: string): string {
  // 如果已经是完整URL，直接返回
  if (path.startsWith('http') || path.startsWith('//')) {
    return path;
  }

  let cleanPath = path;
  
  // 移除开头的 ./ 或 /
  if (cleanPath.startsWith('./')) {
    cleanPath = cleanPath.substring(2);
  } else if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  // 处理 ../ 的情况
  while (cleanPath.startsWith('../')) {
    cleanPath = cleanPath.substring(3);
  }
  
  return cleanPath;
}

/**
 * 生成图片的完整URL
 */
export function getImageUrl(imagePath: string, blobUrlPrefix: string): string {
  // 如果已经是完整URL，直接返回
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // 规范化路径
  const cleanPath = normalizePath(imagePath);
  
  // 确保路径以images/开头
  const finalPath = cleanPath.startsWith('images/') ? cleanPath : `images/${cleanPath}`;
  
  return `${blobUrlPrefix}/${finalPath}`;
}

/**
 * 生成链接的完整URL
 */
export function getLinkUrl(
  linkPath: string, 
  rawUrlPrefix: string, 
  categoryPath?: string,
  baseUrl?: string
): string {
  // 如果已经是完整URL，直接返回
  if (linkPath.startsWith('http') || linkPath.startsWith('//')) {
    return linkPath;
  }
  
  // 规范化路径
  let cleanPath = normalizePath(linkPath);
  
  // 如果提供了分类路径，且链接路径不包含分类，则添加分类路径
  if (categoryPath && !cleanPath.includes('/') && !cleanPath.startsWith(categoryPath)) {
    cleanPath = `${categoryPath}/${cleanPath}`;
  }

  // 生成 AtomGit raw URL
  const url = `${rawUrlPrefix}/${cleanPath}`;
  if (url.includes('.md') && baseUrl) {
    return `${baseUrl}/recipe/${cleanPath.replace('.md', '')}`;
  }
  return url;
}
