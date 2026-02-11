/* eslint-disable */
let bszCaller, bszTag, scriptTag, ready
let isUsingFallback = false
let isFetching = false

let intervalId;
let executeCallbacks;
let onReady;
let isReady = false;
let callbacks = [];

// 修复Node同构代码的问题
if (typeof document !== 'undefined') {
  ready = function (callback) {
    if (isReady || document.readyState === 'interactive' || document.readyState === 'complete') {
      callback.call(document);
    } else {
      callbacks.push(function () {
        return callback.call(this);
      });
    }
    return this;
  };

  executeCallbacks = function () {
    for (let i = 0, len = callbacks.length; i < len; i++) {
      callbacks[i].apply(document);
    }
    callbacks = [];
  };

  onReady = function () {
    if (!isReady) {
      isReady = true;
      executeCallbacks.call(window);
      if (document.removeEventListener) {
        document.removeEventListener('DOMContentLoaded', onReady, false);
      } else if (document.attachEvent) {
        document.detachEvent('onreadystatechange', onReady);
        if (window == window.top) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }
  };

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', onReady, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (/loaded|complete/.test(document.readyState)) {
        onReady();
      }
    });
    if (window == window.top) {
      intervalId = setInterval(function () {
        try {
          if (!isReady) {
            document.documentElement.doScroll('left');
          }
        } catch (e) {
          return;
        }
        onReady();
      }, 5);
    }
  }
}

bszCaller = {
  fetch: function (url, callback, errorCallback) {
    const callbackName = 'BusuanziCallback_' + Math.floor(1099511627776 * Math.random())
    url = url.replace('=BusuanziCallback', '=' + callbackName)
    scriptTag = document.createElement('SCRIPT');
    scriptTag.type = 'text/javascript';
    scriptTag.defer = true;
    scriptTag.src = url;
    scriptTag.referrerPolicy = "no-referrer-when-downgrade";

    scriptTag.onerror = function() {
      isFetching = false
      if (errorCallback && typeof errorCallback === 'function') {
        errorCallback();
      }
    };

    const timeoutId = setTimeout(() => {
      isFetching = false
      if (errorCallback && typeof errorCallback === 'function') {
        errorCallback();
      }
    }, 8000);

    document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    window[callbackName] = this.evalCall(callback, timeoutId)
  },
  evalCall: function (callback, timeoutId) {
    return function (data) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      isFetching = false

      ready(function () {
        try {
          callback(data);
          if (scriptTag && scriptTag.parentElement && scriptTag.parentElement.contains(scriptTag)) {
            scriptTag.parentElement.removeChild(scriptTag);
          }
        } catch (e) {
          console.error('[Busuanzi] 数据处理失败:', e);
        }
      })
    }
  }
}

// 备用服务只加载一次
const loadFallbackService = () => {
  if (isUsingFallback) {
    return;
  }

  isUsingFallback = true;

  const fallbackScript = document.createElement('SCRIPT');
  fallbackScript.type = 'text/javascript';
  fallbackScript.async = true;
  fallbackScript.src = 'https://busuanzi.icodeq.com/busuanzi.pure.mini.js';

  fallbackScript.onload = function() {
    setTimeout(() => {
      bszTag.shows();
    }, 1000);
  };

  fallbackScript.onerror = function() {
    bszTag.hides();
  };

  document.getElementsByTagName('HEAD')[0].appendChild(fallbackScript);
}

const fetch = () => {
  // 防止并发请求
  if (isFetching) {
    return;
  }

  if (bszTag) {
    bszTag.hides();
  }

  // 如果备用服务已加载，不再重复请求（备用服务的脚本会自动更新DOM）
  if (isUsingFallback) {
    setTimeout(() => {
      bszTag.shows();
    }, 500);
    return;
  }

  isFetching = true;

  bszCaller.fetch(
    '//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback',
    function (data) {
      if (data && (data.site_pv || data.site_uv || data.page_pv)) {
        bszTag.texts(data);
        bszTag.shows();
      } else {
        loadFallbackService();
      }
    },
    function () {
      loadFallbackService();
    }
  );
}

bszTag = {
  bszs: ['site_pv', 'page_pv', 'site_uv'],
  texts: function (data) {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_value_' + key)
      if (elements) {
        for (var element of elements) {
          element.innerHTML = data[key];
        }
      }
    })
  },
  hides: function () {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_container_' + key)
      if (elements) {
        for (var element of elements) {
          element.style.display = 'none';
        }
      }
    })
  },
  shows: function () {
    this.bszs.map(function (key) {
      const elements = document.getElementsByClassName('busuanzi_container_' + key)
      if (elements) {
        for (var element of elements) {
          element.style.display = 'inline';
        }
      }
    })
  }
}

module.exports = {
  fetch
}
