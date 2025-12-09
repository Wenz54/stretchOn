import apiClient from '../services/api';
import {useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

export function useWorkoutDetails(item) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const Api = apiClient();

  const [errors, setErrors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [details, setDetails] = useState({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  async function handleLoadDetails() {
    //mock of response=>data
    const data = {
      workoutDeatails: {
        id: 1,
        time: 20,
        kcal: 100,
        zone:'Core, Stability',
        name: 'Утренняя медитация',
        category: 'Медитация, утро',
        description:
          'Утренняя медитация помогает настроиться на активный день и зарядиться силами. Делай так каждый день и спина болеть не булет.',
        image:
          'https://s0.rbk.ru/v6_top_pics/media/img/0/36/756607154751360.jpg',
      },
    };

    return Api.post(`/api/workoout/${item.id}`)
      .then(res => {
        setDetails(res?.data?.workoutDeatails);
        return [];
      })
      .catch(err => {
        setDetails(data?.workoutDeatails);

        return [{url: err?.request._url, message: err.message}];
      });
  }

  async function handleRefresh() {
    setErrors([]);
    let errs = [...(await handleLoadDetails())];
    //setErrors(errs);
    setRefreshing(false);
    setIsFirstLoad(false)
  }

  useEffect(() => {
    handleRefresh();
  }, []);

  return {
    details,
    refreshing,
    errors,
    handleRefresh,
    isFirstLoad
  };
}
