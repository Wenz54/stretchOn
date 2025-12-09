import has from 'lodash/has';
import get from 'lodash/get';
import {useCallback, useEffect, useRef} from 'react';
import {debounce} from 'lodash';

export function formatPrice(x) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

export function useLazyEffect(effect, deps = [], wait = 300) {
  const cleanUp = useRef();
  const effectRef = useRef();
  const updatedEffect = useCallback(effect, deps);
  effectRef.current = updatedEffect;
  const lazyEffect = useCallback(
    debounce(() => {
      cleanUp.current = effectRef.current?.();
    }, wait),
    [],
  );
  useEffect(lazyEffect, deps);
  useEffect(() => {
    return () => {
      cleanUp.current instanceof Function ? cleanUp.current() : undefined;
    };
  }, []);
}

export const stripTags = str => {
  if (!str) {
    return str;
  }
  return str
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/(<([^>]+)>)/gi, '')
    .trimLeft();
};

export const clearText = str => {
  return str.replaceAll(/&nbsp;/g, '');
};

export function objectToArray(object) {
  return Object.keys(object).map(i => object[i]);
}

export function handleErrorResponse(e, setErrors) {
  console.log(e)
  let errs = [];
  let message = e.response?.data?.message;
  if (message) {

    Object.keys(message).forEach(i => {
      errs.push({path:i, message:message[i]})
    });
    setErrors(errs);
  } else {
    if (e.response?.data?.error) {
      setErrors([{path: 'global', message: e.response?.data?.error}]);
    }
  }
}

export const removeHtmlTags = (text) => {
  return text?.replaceAll(/<\/?[^>]+(>|$)/g, '').replaceAll('&nbsp;', ' ')||'';
};

/**
 * Фильтрует тренировки/медитации по языку пользователя
 * @param {Array} items - массив тренировок/медитаций
 * @param {string} currentLang - текущий язык из i18n (например 'ru-RU', 'en-US')
 * @returns {Array} отфильтрованный массив
 */
export const filterByLanguage = (items, currentLang) => {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  
  // Извлекаем короткий код языка: "ru" из "ru-RU"
  const shortLang = currentLang?.split('-')[0] || 'en';
  
  // Фильтруем по полю lang
  return items.filter(item => {
    // Если у элемента нет поля lang, пропускаем его
    if (!item.lang) {
      return false;
    }
    
    // Сравниваем короткий код языка
    const itemLang = item.lang.split('-')[0];
    return itemLang === shortLang;
  });
};

/**
 * Возвращает локализованное название направления
 * @param {Object} direction - объект направления
 * @param {string} currentLang - текущий язык из i18n (например 'ru-RU', 'en-US')
 * @returns {string} локализованное название
 */
export const getDirectionName = (direction, currentLang) => {
  if (!direction) return '';
  
  // Формируем имя поля: name_ru-RU, name_en-US и т.д.
  const nameField = `name_${currentLang}`;
  
  // Если есть локализованное поле, используем его, иначе fallback на обычное name
  return direction[nameField] || direction.name || '';
};

/**
 * Возвращает локализованное описание направления
 * @param {Object} direction - объект направления
 * @param {string} currentLang - текущий язык из i18n (например 'ru-RU', 'en-US')
 * @returns {string} локализованное описание
 */
export const getDirectionDescription = (direction, currentLang) => {
  if (!direction) return '';
  
  // Формируем имя поля: description_ru-RU, description_en-US и т.д.
  const descField = `description_${currentLang}`;
  
  // Если есть локализованное поле, используем его, иначе fallback на обычное description
  return direction[descField] || direction.description || '';
};