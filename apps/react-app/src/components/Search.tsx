import React, { useState } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

const { Search: AntSearch } = Input;

interface SearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  loading?: boolean;
}

const Search: React.FC<SearchProps> = ({
  onSearch,
  onClear,
  placeholder = "搜索菜谱...",
  loading = false,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchValue('');
    onClear();
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <Space.Compact style={{ width: '100%' }}>
        <AntSearch
          placeholder={placeholder}
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          loading={loading}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ flex: 1 }}
        />
        {searchValue && (
          <Button
            icon={<CloseOutlined />}
            onClick={handleClear}
            size="large"
          >
            清除
          </Button>
        )}
      </Space.Compact>
    </div>
  );
};

export default Search;
