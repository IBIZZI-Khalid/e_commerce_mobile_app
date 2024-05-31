import { useState } from 'react';
import { searchProduct } from './Api';

const UseSearchHandler = () => {
  const [loading, setLoading] = useState(false);
  const [searchResult, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    setResult([]);
    try {
      const data = await searchProduct(searchQuery);
      setResult(data.data);
      console.log('search.sj : search result :' , data.data)
      return (data.data);

      // setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { handleSearch };

};

export default UseSearchHandler;
