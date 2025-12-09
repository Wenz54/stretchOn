import React from 'react';
import {
  ScrollView,
  View, RefreshControl
} from 'react-native';
import styles from '../styles';
import { useTranslation } from 'react-i18next';
import { useComments } from '../hooks/useComments';
import HeaderBack from '../headers/HeaderBack';
import CommentItem from '../components/CommentItem';
import CommentInput from '../footers/CommentInput';
export default function Comments({navigation, route}) {
  const {t} = useTranslation();
  const {
    text,
    comments,
    refreshing,
    errors,
    setText,
    handleRefresh,
    handleLoadMore,
    handleSendComment
  } = useComments(route?.params?.item);
  return (
    <View style={{flex: 1, backgroundColor: styles.colors.background}}>
      <HeaderBack title={t('Comments')} action={()=>navigation.pop()} />
      <ScrollView
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: styles.colors.background,
          }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          rowGap: styles.paddingHorizontal,
          paddingTop: styles.paddingHorizontal,
          paddingHorizontal: styles.paddingHorizontal,          
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
          {comments.map((comment,index)=>(
            <CommentItem item={comment} key={index} />
          ))}
      </ScrollView>
      <CommentInput value={text} onChange={setText} handleSend={handleSendComment}/>
    </View>
  );
}
