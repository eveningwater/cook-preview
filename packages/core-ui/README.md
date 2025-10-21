# @cook/core-ui

Core UI components for Cook applications. This package provides framework-agnostic UI components that can be used across React, Vue, and Angular applications.

## Installation

```bash
npm install @cook/core-ui
# or
pnpm add @cook/core-ui
# or
yarn add @cook/core-ui
```

## Components

### CookingLoader

A cooking-themed loading animation component.

#### Usage in React

```tsx
import React from 'react';
import { generateCookingLoaderHTML } from '@cook/core-ui';
import '@cook/core-ui/dist/components/loading/cooking-loader.css';

const MyComponent = () => {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: generateCookingLoaderHTML({ 
          text: '正在烹饪美味菜谱...',
          subText: '请稍候，我们正在为您准备详细的制作步骤'
        }) 
      }} 
    />
  );
};
```

#### Usage in Vue

```vue
<template>
  <div v-html="loaderHTML"></div>
</template>

<script setup>
import { generateCookingLoaderHTML } from '@cook/core-ui';
import '@cook/core-ui/dist/components/loading/cooking-loader.css';

const loaderHTML = generateCookingLoaderHTML({
  text: '正在烹饪美味菜谱...',
  subText: '请稍候，我们正在为您准备详细的制作步骤'
});
</script>
```

#### Usage in Angular

```typescript
import { Component } from '@angular/core';
import { generateCookingLoaderHTML } from '@cook/core-ui';
import '@cook/core-ui/dist/components/loading/cooking-loader.css';

@Component({
  template: `
    <div [innerHTML]="loaderHTML"></div>
  `
})
export class MyComponent {
  loaderHTML = generateCookingLoaderHTML({
    text: '正在烹饪美味菜谱...',
    subText: '请稍候，我们正在为您准备详细的制作步骤'
  });
}
```

## API

### generateCookingLoaderHTML(config?)

Generates the HTML structure for the cooking loader.

**Parameters:**
- `config.text?` - Main loading text (default: '正在烹饪美味菜谱...')
- `config.subText?` - Sub loading text (default: '请稍候，我们正在为您准备详细的制作步骤')
- `config.className?` - Additional CSS class name

**Returns:** `string` - HTML string

### createCookingLoaderElement(config?)

Creates a DOM element for the cooking loader.

**Parameters:** Same as `generateCookingLoaderHTML`

**Returns:** `HTMLElement` - DOM element

### injectCookingLoaderCSS()

Injects the CSS styles into the document head (browser only).

## CSS Variables

The component uses CSS variables for theming:

- `--ant-color-border` - Border color
- `--ant-color-shadow` - Shadow color
- `--ant-color-text` - Text color
- `--ant-color-text-secondary` - Secondary text color

## License

MIT
