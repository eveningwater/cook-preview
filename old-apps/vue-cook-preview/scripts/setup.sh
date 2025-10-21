#!/bin/bash

# 老乡鸡菜谱预览 - 快速设置脚本

echo "🥢 老乡鸡菜谱预览 - 项目设置"
echo "================================"
echo ""

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm 未安装"
    echo "请选择安装方式："
    echo "1. npm install -g pnpm"
    echo "2. 使用 npm 替代 pnpm"
    read -p "请输入选择 (1/2): " choice
    
    if [ "$choice" = "1" ]; then
        npm install -g pnpm
    elif [ "$choice" = "2" ]; then
        PKG_MANAGER="npm"
    else
        echo "❌ 无效选择，退出"
        exit 1
    fi
else
    PKG_MANAGER="pnpm"
fi

echo ""
echo "📦 安装依赖..."
$PKG_MANAGER install

echo ""
echo "✅ 依赖安装完成！"
echo ""
echo "⚙️  接下来请配置环境变量："
echo "编辑 src/environments/environment.ts 文件"
echo "填入你的 Token、仓库所有者和仓库名称"
echo ""
echo "然后运行以下命令启动开发服务器："
echo "  $PKG_MANAGER dev"
echo ""
echo "🎉 祝你使用愉快！"

