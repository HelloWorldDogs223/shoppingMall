'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';
import { useManagerFetch } from '@/app/hooks/useManagerFetch';
import Tags from '@/app/components/Tags';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_DOMAIN;

export default function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { accessToken } = useManagerFetch();

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/product/types`);
      setProductTypes(response.data.productTypeList);
    } catch (err) {
      console.error('Error fetching product types:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = async (e: any) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/product/type`,
        { typeName: newTag },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      await fetchProductTypes();
      setNewTag('');
    } catch (err) {
      console.error('Error adding new tag:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" component="h1" gutterBottom>
        Product Types
      </Typography>

      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <div className="space-y-2">
        {productTypes.map((type: any) => (
          <Tags key={type.id} el={type} fetchData={fetchProductTypes} />
        ))}
      </div>

      <form onSubmit={addTag} className="flex items-center gap-3 mt-8">
        <TextField
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add new tag"
          variant="outlined"
          size="small"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          새로 태그 생성하기
        </Button>
      </form>
    </div>
  );
}
