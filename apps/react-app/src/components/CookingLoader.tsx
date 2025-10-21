import React from 'react';
import { generateCookingLoaderHTML, type CookingLoaderConfig } from '@cook/core-ui';
import '@cook/core-ui/dist/components/loading/cooking-loader.css';

interface CookingLoaderProps extends CookingLoaderConfig {
  className?: string;
}

const CookingLoader: React.FC<CookingLoaderProps> = ({
  text = '正在烹饪美味菜谱...',
  subText = '请稍候，我们正在为您准备详细的制作步骤',
  className = ''
}) => {

  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: generateCookingLoaderHTML({ text, subText, className }) 
      }} 
    />
  );
};

export default CookingLoader;
