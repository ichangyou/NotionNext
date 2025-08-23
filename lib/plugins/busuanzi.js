/* eslint-disable */
let bszCaller, bszTag, scriptTag, ready
let isUsingFallback = false // 标记是否使用了备用服务

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
    
    // 添加错误处理
    scriptTag.onerror = function() {
      console.warn('[Busuanzi] 主服务加载失败，尝试备用服务...');
      if (errorCallback && typeof errorCallback === 'function') {
        errorCallback();
      }
    };
    
    // 添加超时处理
    const timeoutId = setTimeout(() => {
      console.warn('[Busuanzi] 主服务请求超时，尝试备用服务...');
      if (errorCallback && typeof errorCallback === 'function') {
        errorCallback();
      }
    }, 8000); // 8秒超时
    
    document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    window[callbackName] = this.evalCall(callback, timeoutId)
  },
  evalCall: function (callback, timeoutId) {
    return function (data) {
      // 清除超时计时器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
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

// 备用服务加载函数
const loadFallbackService = () => {
  if (isUsingFallback) {
    console.log('[Busuanzi] 备用服务已加载，跳过重复加载');
    return;
  }
  
  console.log('[Busuanzi] 正在加载备用服务...');
  isUsingFallback = true;
  
  const fallbackScript = document.createElement('SCRIPT');
  fallbackScript.type = 'text/javascript';
  fallbackScript.async = true;
  fallbackScript.src = 'https://busuanzi.icodeq.com/busuanzi.pure.mini.js';
  
  fallbackScript.onload = function() {
    console.log('[Busuanzi] 备用服务加载成功');
    // 备用服务加载完成后，显示统计信息
    setTimeout(() => {
      bszTag.shows();
    }, 1000);
  };
  
  fallbackScript.onerror = function() {
    console.error('[Busuanzi] 备用服务也加载失败');
    bszTag.hides();
  };
  
  document.getElementsByTagName('HEAD')[0].appendChild(fallbackScript);
}

const fetch = () => {
  if (bszTag) {
    bszTag.hides();
  }
  
  // 重置备用服务标记
  isUsingFallback = false;
  
  console.log('[Busuanzi] 尝试加载主服务...');
  
  bszCaller.fetch(
    '//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback', 
    function (data) {
      // 主服务成功回调
      console.log('[Busuanzi] 主服务加载成功');
      if (data && (data.site_pv || data.site_uv || data.page_pv)) {
        bszTag.texts(data);
        bszTag.shows();
      } else {
        console.warn('[Busuanzi] 主服务返回数据异常，尝试备用服务...');
        loadFallbackService();
      }
    },
    function () {
      // 主服务失败回调，加载备用服务
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