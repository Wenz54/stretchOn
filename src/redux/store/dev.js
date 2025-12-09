import {createStore, applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';
import logger from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage'
import rootReducer from '../reducers/index.js';

const persistConfig = {
    key: 'root',
    storage: FilesystemStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const  store = createStore(
    persistedReducer,
    applyMiddleware(thunk, 
       // logger
    ),
);

const rehydrationCallback = () => {};

export const persistor = persistStore(store, null, rehydrationCallback);

