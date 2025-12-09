import apiClient from '../services/api';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useMeditationsList() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const Api = apiClient();

  const [errors, setErrors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState([]);
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  async function handleLoadItems() {
    //mock of response=>data
    const data = {
      meditations: [
        {
          id:1,
          total: 20,
          current: 20,
          name: 'Утренняя медитация',
          image:
            'https://s0.rbk.ru/v6_top_pics/media/img/0/36/756607154751360.jpg',
        },
        {
          id:2,
          total: 10,
          current: 8,
          name: 'Вечерняя медитация',
          image: 'https://tengritravel.kz/userdata/images/u337/resized/c22eafd90330273e6c6bd5637e974bce.jpg',
        },
      ],
    };

    return Api.get(
      '/api/meditations/list',
      {
        params: {
          // query: query.length && query,
          // category: selectedCategory.length && selectedCategory,
          // level: selectedLevel.length && selectedLevel,
        },
      },
    )
      .then(res => {
        console.log(res)
        setItems(res?.data?.meditations);
        return [];
      })
      .catch(err => {
       // setItems(data?.meditations);
        console.log(err.response)
        return [{url: err?.request._url, message: err.message}];
      });
  }

  async function handleLoadFilters() {
    //mock of response=>data
    const data = {
      categories: [
        {
          key: '1',
          name: 'Направление 1',
        },
        {
          key: '2',
          name: 'Направление 2',
        },
        {
          key: '3',
          name: 'Направление 3',
        },
        {
          key: '4',
          name: 'Направление 4',
        },
      ],
      levels: [
        {
          key: 'low',
          name: 'Утренние',
        },
        {
          key: 'middle',
          name: 'Вечерние',
        },
      ],
    };

    return Api.post('/api/meditations/filters')
      .then(res => {
        setCategories(res?.data?.categories);
        setLevels(res?.data?.levels);
        return [];
      })
      .catch(err => {
        setCategories(data?.categories);
        setLevels(data?.levels);
        return [{url: err?.request._url, message: err.message}];
      });
  }

  async function handleRefresh() {
    setErrors([]);
    let errs = [...(await handleLoadItems()), ...(await handleLoadFilters())];
    //setErrors(errs);
    setRefreshing(false);
    setIsFirstLoad(false)
  }

  async function handleSearch() {
    setRefreshing(true);
    setErrors([]);
    let errs = [...(await handleLoadItems())];
    //setErrors(errs);
    setRefreshing(false);
    
  }

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    if (query.length > 3) {
      handleSearch();
    }
  }, [query]);

  function handleCategorySelect(val) {
    setSelectedCategory(val);
    handleSearch();
  }

  function handleLevelSelect(val) {
    setSelectedLevel(val);
    handleSearch();
  }

  return {
    items,
    query,
    selectedCategory,
    selectedLevel,
    levels,
    categories,
    refreshing,
    errors,
    handleRefresh,
    setQuery,
    handleCategorySelect,
    handleLevelSelect,
    isFirstLoad
  };
}
