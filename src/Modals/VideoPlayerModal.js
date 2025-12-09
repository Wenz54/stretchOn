import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Text from '../components/Text';
import StandardButton from '../components/StandardButton';
import Video, {VideoRef, ViewType} from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import Orientation from 'react-native-orientation-locker';
import Slider from '@react-native-community/slider';

export default VideoPlayerModal = ({
  isVisible = false,
  hide = () => {},
  startInPlayState = false,
  startInFullscreen = false,
  initialTime = 0,
  updateTime = () => {},
  containerStyle = {}, // Проп для стилей контейнера
  fullscreenStyle = {}, // Проп для стилей в полноэкранном режиме
  showVideo,
  setShowVideo,
  showClose = false,
  hideResize = false,
  videos = [],
  onNext = () => {},
  onPrev = () => {},
  onFullscreenChange = () => {}, // Callback для изменения fullscreen состояния
}) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const videoPlayer = useRef(null);
  const [paused, setPaused] = useState(!startInPlayState);
  const [fullscreen, setFullscreen] = useState(startInFullscreen);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1.0);

  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    console.log(videos);
    setActiveVideo(videos[0]);
  }, []);

  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;

  const handlers = {
    play: () => {
      setPaused(false);
    },
    pause: () => {
      setPaused(true);
    },
    stop: () => {
      setPaused(true);
      videoPlayer.current.seek(0);
      setCurrentTime(0);
    },
    seek: time => {
      videoPlayer.current.seek(time);
      setCurrentTime(time);
    },
    rotate: () => {
      const newFullscreenState = !fullscreen;
      setFullscreen(newFullscreenState);
      onFullscreenChange(newFullscreenState);
    },
  };

  useEffect(() => {
    if (duration) {
      setIsFirstLoad(false);
      if (initialTime) {
        videoPlayer.current.seek(initialTime);
        setCurrentTime(initialTime);
      }
    }
  }, [duration]);

  const onSlide = value => {
    videoPlayer.current.seek(value);
    setCurrentTime(value);
  };

  const formatTime = timeInSeconds => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  const onProgress = data =>
    data.currentTime && setCurrentTime(data.currentTime);

  const onBuffer = ({isBuffering}) => isBuffering && setError(false);

  const toggleMute = () => setVideoVolume(videoVolume === 0.0 ? 1.0 : 0.0);
  useEffect(() => {
    const backAction = () => {
      updateTime(currentTime);
      hide();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // Сброс fullscreen при закрытии модалки
  useEffect(() => {
    if (!isVisible) {
      setFullscreen(false);
      onFullscreenChange(false);
    }
  }, [isVisible]);
  if (!isVisible) {
    return;
  }
  return (
    <View
      activeOpacity={1}
      style={{
        position: fullscreen ? 'absolute' : 'static',
        top: 0,
        bottom: 0,
        zIndex: 999,
        width: fullscreen ? fullscreenStyle.width : containerStyle.width,
        height: fullscreen ? fullscreenStyle.height : containerStyle.height,
        backgroundColor: '#000000f8',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: fullscreen
          ? fullscreenStyle.borderRadius
          : containerStyle.borderRadius,
        overflow: 'hidden',
      }}>
      {showClose && (
        <View
          style={{
            position: 'absolute',
            top: 15,
            zIndex: 9,
            paddingHorizontal: 15,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: 38,
              height: 38,
              borderRadius: 40,
              backgroundColor: '#FFFFFF22',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setFullscreen(false);
              updateTime(currentTime);
              hide();
            }}>
            <Ionicons
              name="close-outline"
              size={styles.fonSize.h1}
              color={styles.colors.white}
            />
          </TouchableOpacity>
        </View>
      )}

      <Video
        key={activeVideo?.uri || 'empty'}
        source={{
          uri: activeVideo?.uri,
          headers: {
            Authorization: `Bearer ${auth.token}`, 
          },
        }}
        ref={videoPlayer}
        onLoad={data => {
          setDuration(data.duration);
          setLoading(false);
          currentTime > 0 && handlers.seek(currentTime);
        }}
        onBuffer={onBuffer}
        onError={err => {
          console.log(err)
          setError(true);
        }}
        style={
          fullscreen
            ? {
                zIndex: 4,
                width: '100%',
                height: '100%',
              }
            : {
                zIndex: 4,
                width: '100%',
                height: '100%',
                borderRadius: containerStyle.borderRadius,
              }
        }
        fullscreen={false}
        controls={false}
        paused={paused}
        rate={1}
        volume={videoVolume}
        onProgress={onProgress}
        bufferConfig={{
          minBufferMs: 5000,
          maxBufferMs: 30000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000,
        }}
        viewType={ViewType.TEXTURE}
        renderLoader={() =>
          error ? (
            <View
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}>
              <Text>
                Error while trying to load video.{'\n'} Please try another
                resolution
              </Text>
              <TouchableOpacity
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 40,
                  backgroundColor: '#FFFFFF22',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  handlers.pause();
                  setError(false);
                  setActiveVideo(activeVideo);
                  handlers.play();
                }}>
                <Ionicons
                  name={'refresh-outline'}
                  size={styles.fonSize.h1}
                  color={
                    fullscreen ? styles.colors.primary : styles.colors.white
                  }
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{height: '100%', justifyContent: 'center'}}>
              <ActivityIndicator size="large" color={styles.colors.primary} />
            </View>
          )
        }
        resizeMode={'contain'}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 50,
          zIndex: 999999,
          width: fullscreen ? width * 0.9 : width,
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          padding: 8,
          borderRadius: 10,
        }}>
        {isSettingsVisible && (
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 5,
            }}>
            {videos.map((video, index) => (
              <TouchableOpacity
                style={{
                  width: '100%',
                  borderRadius: 5,
                  backgroundColor:
                    video.uri == activeVideo.uri ? '#FFFFFF22' : '#FFFFFF11',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}
                key={index}
                onPress={() => {
                  setActiveVideo(video);
                  setIsSettingsVisible(false);
                  setError(false);
                }}>
                <Text
                  style={{
                    width: '100%',
                    color:
                      video.uri == activeVideo.uri
                        ? styles.colors.primary
                        : styles.colors.white,
                  }}>
                  {video.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Slider
          style={{
            width: fullscreen ? width * 0.9 : width,
            transform: [{scaleY: 1.5}],
          }}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onValueChange={onSlide}
          minimumTrackTintColor={styles.colors.white}
          maximumTrackTintColor={'#ffffff'}
          thumbTintColor={styles.colors.white}
        />
        <View
          style={{
            paddingHorizontal: 15,
            width: fullscreen ? width * 0.9 : width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              backgroundColor: '#FFFFFF22',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onPrev}>
            <Ionicons
              name={'play-skip-back'}
              size={styles.fonSize.lg}
              color={styles.colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 100,
              height: 40,
              borderRadius: 16,
              backgroundColor: '#FFFFFF22',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
            onPress={() => {
              if (paused) {
                handlers.play();
              } else {
                updateTime(currentTime);
                handlers.pause();
              }
            }}>
            <Ionicons
              name={paused ? 'play' : 'pause'}
              size={styles.fonSize.lg}
              color={styles.colors.white}
            />
            <Text
              style={{
                color: styles.colors.white,
                fontSize: styles.fonSize.md,
                fontWeight: '500',
              }}>
              {paused ? 'Play' : 'Pause'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              backgroundColor: '#FFFFFF22',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={onNext}>
            <Ionicons
              name={'play-skip-forward'}
              size={styles.fonSize.lg}
              color={styles.colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              backgroundColor: '#FFFFFF22',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setIsSettingsVisible(!isSettingsVisible)}>
            <Ionicons
              name={'settings-outline'}
              size={styles.fonSize.lg}
              color={styles.colors.white}
            />
          </TouchableOpacity>
          {!hideResize && (
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: '#FFFFFF22',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => handlers.rotate()}>
              <AntDesign
                name={fullscreen ? 'shrink' : 'arrowsalt'}
                size={styles.fonSize.md}
                color={styles.colors.white}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
