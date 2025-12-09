import React from 'react';
import {View, TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles';
import config from '../config';

export default function SupportChat({navigation}) {
  // Use URL from server instead of inline HTML
  const jivoURL = `${config.baseUrl}/jivo-chat.html`;
  
  const jivoHTML = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src *; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';">
      <title>Support Chat</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #fff;
        }
        #jivo-container {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .loading {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 16px;
          color: #666;
          gap: 20px;
        }
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #00D4AA;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .debug {
          position: fixed;
          bottom: 10px;
          left: 10px;
          right: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 10px;
          font-size: 12px;
          border-radius: 8px;
          max-height: 150px;
          overflow-y: auto;
          z-index: 99999;
        }
      </style>
    </head>
    <body>
      <div id="jivo-container">
        <div class="loading">
          <div class="spinner"></div>
          <div>Загрузка чата...</div>
        </div>
      </div>
      
      <div class="debug" id="debug"></div>
      
      <script>
        function log(msg) {
          console.log('[Jivo]', msg);
          var debug = document.getElementById('debug');
          if (debug) {
            debug.innerHTML += msg + '<br>';
            debug.scrollTop = debug.scrollHeight;
          }
        }
        
        log('Starting Jivo load...');
        
        // Load Jivo script with explicit HTTPS
        (function() {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = 'https://code.jivo.ru/widget/DZMofX7f2d';
          
          script.onload = function() {
            log('Jivo script loaded successfully');
            checkJivoAPI();
          };
          
          script.onerror = function(error) {
            log('ERROR loading Jivo script: ' + error);
            document.querySelector('.loading div').textContent = 'Ошибка загрузки чата';
          };
          
          document.head.appendChild(script);
          log('Jivo script added to head');
        })();
        
        var attempts = 0;
        var maxAttempts = 40;
        
        function checkJivoAPI() {
          attempts++;
          log('Check attempt ' + attempts + ': jivo_api = ' + (typeof window.jivo_api));
          
          if (window.jivo_api && typeof window.jivo_api.open === 'function') {
            log('Jivo API ready! Opening chat...');
            try {
              window.jivo_api.open();
              document.querySelector('.loading').style.display = 'none';
              log('Chat opened successfully');
              // Hide debug after 3 seconds
              setTimeout(function() {
                var debug = document.getElementById('debug');
                if (debug) debug.style.display = 'none';
              }, 3000);
            } catch(e) {
              log('ERROR opening chat: ' + e.message);
            }
          } else if (attempts < maxAttempts) {
            setTimeout(checkJivoAPI, 500);
          } else {
            log('ERROR: Max attempts reached. Jivo not loaded.');
            document.querySelector('.loading div').textContent = 'Не удалось загрузить чат';
          }
        }
        
        // Start checking after initial load
        setTimeout(checkJivoAPI, 1000);
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: styles.colors.background}}>
      <View style={{flex: 1}}>
        {/* Back Button */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 16,
            left: 10,
            zIndex: 1000,
            backgroundColor: '#000',
            borderRadius: 50,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-outline"
            size={styles.fonSize.lg}
            color={styles.colors.gray5}
          />
        </TouchableOpacity>

        {/* WebView with Jivo Chat */}
        <WebView
          source={{uri: jivoURL}}
          style={{flex: 1, backgroundColor: '#fff'}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
              <ActivityIndicator size="large" color={styles.colors.primary} />
            </View>
          )}
          scalesPageToFit={true}
          bounces={false}
          scrollEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          mixedContentMode="always"
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          geolocationEnabled={false}
          cacheEnabled={true}
          incognito={false}
          onMessage={(event) => {
            console.log('WebView message:', event.nativeEvent.data);
          }}
          onError={(syntheticEvent) => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent);
          }}
          onLoadStart={() => {
            console.log('WebView started loading');
          }}
          onLoad={() => {
            console.log('WebView finished loading');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

