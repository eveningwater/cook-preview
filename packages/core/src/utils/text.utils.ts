/**
 * 正确解码Base64编码的UTF-8内容
 */
export function decodeBase64UTF8(base64String: string): string {
  try {
    // 先解码Base64
    const binaryString = atob(base64String);
    // 将二进制字符串转换为UTF-8字符串
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // 使用TextDecoder解码UTF-8字节
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  } catch (error) {
    return base64String; // 如果解码失败，返回原始字符串
  }
}

/**
 * 判断是否为中文目录
 */
export function isChineseDirectory(path: string): boolean {
  return /[\u4e00-\u9fa5]/.test(path);
}

/**
 * 判断是否为图片文件
 */
export function isImageFile(path: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
}

/**
 * 根据文件扩展名获取MIME类型
 */
export function getMimeType(filePath: string): string {
  const ext = filePath.toLowerCase().split('.').pop();
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
  };
  return mimeTypes[ext || ''] || 'image/jpeg';
}
