import apiClient from '../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

export function useComments(current) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const logged = auth.logged;
  const [notifications, setNotifications] = useState([]);
  const Api = apiClient();

  const [errors, setErrors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  async function handleLoadComments() {
    //mock of response=>data

    let data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        id: i,
        user_id: i * 2,
        user_name: `User ${i * 2}`,
        text: `Comment ${i}`,
        date: new Date().getTime(),
        user_avatar:
          i % 2 === 1
            ? 'https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg'
            : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png',
      });
    }
    return Api.get(`/api/comments/${current.id}?page=${page}`)
      .then(res => {
        if (!res.data?.comments?.length > 0) {
          return [];
        }
        setComments([...comments, ...res.data.comments]);
        return [];
      })
      .catch(err => {
        setComments([...comments, ...data]);
        return [{url: err?.request._url, message: err.message}];
      });
  }

  async function handleRefresh() {
    setRefreshing(true);
    setComments([]);
    setErrors([]);
    let errs = await handleLoadComments();
    //setErrors(errs);
    setRefreshing(false);
    setIsFirstLoad(false)
  }

  async function handleLoadMore() {
    if (hasMore) {
      setPage(page + 1);
      let errs = await handleLoadComments();
      //setErrors(errs);
      setRefreshing(false);
    }
  }

  async function handleSendComment() {
    if(!text.length) return null
    return Api.post("/api/comments/create",{
      workout_id:current.id,
      text
    }).then(()=>handleRefresh()).catch(()=>{
      setText('')
    })
  }

  useEffect(() => {
    if (!logged) {
      return navigation.replace('Login');
    }
  }, [logged]);

  useEffect(() => {
    handleRefresh();
  }, []);

  return {
    text,
    comments,
    refreshing,
    errors,
    setText,
    handleRefresh,
    handleLoadMore,
    handleSendComment,
    isFirstLoad
  };
}
