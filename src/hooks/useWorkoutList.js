import apiClient from '../services/api';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useWorkoutList() {
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
      workouts: [
        {
          id:1,
          total: 20,
          current: 20,
          name: 'Тренировка на пресс',
          image:
            'https://kirasport.by/files/images/_thumbs/super.ua-1527859164-1024x683.jpg',
        },
        {
          id:2,
          total: 10,
          current: 8,
          name: 'Йога для спины',
          image: 'https://bolivspine.by/upload/iblock/uslugi/0804.jpg',
        },
      ],
    };

    return Api.get(
      '/api/training/get-all',
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
        if(res.data?.success){
          setItems(res?.data?.result?.trainings);
        }
        return [];
      })
      .catch(err => {
        console.log(err.response)
        //setItems(data?.workouts);

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
          name: 'Легкие',
        },
        {
          key: 'middle',
          name: 'Средние',
        },
      ],
    };

    return Api.post('/api/workouts/filters')
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
