import React from 'react';
import { Select } from 'antd';
import { CodeOutlined, ThunderboltOutlined, RocketOutlined } from '@ant-design/icons';
import { createVersionSwitcher } from '@cook/core';

interface VersionSwitcherProps {
  currentVersion: string;
  onVersionChange: (version: string) => void;
}

const VersionSwitcher: React.FC<VersionSwitcherProps> = ({
  currentVersion,
  onVersionChange,
}) => {
  const versionSwitcher = createVersionSwitcher();

  const handleVersionChange = (version: string) => {
    onVersionChange(version);
    versionSwitcher.switchToVersion(version);
  };

  const options = [
    {
      value: 'react',
      label: 'React 版本',
      icon: <ThunderboltOutlined />,
    },
    {
      value: 'angular',
      label: 'Angular 版本',
      icon: <CodeOutlined />,
    },
    {
      value: 'vue',
      label: 'Vue 版本',
      icon: <RocketOutlined />,
    },
  ];

  return (
    <Select
      value={currentVersion}
      onChange={handleVersionChange}
      style={{ width: 150 }}
      size="middle"
      options={options.map(option => ({
        value: option.value,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {option.icon}
            <span>{option.label}</span>
          </div>
        ),
      }))}
    />
  );
};

export default VersionSwitcher;
