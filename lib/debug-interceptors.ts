'use client';

// Global request interceptor to catch all HTTP requests
if (typeof window !== 'undefined') {
  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(...args: Parameters<typeof fetch>) {
    const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || 'unknown';
    
    console.log('🌐 Global Fetch Intercepted:', {
      url: url,
      protocol: url.startsWith('https://') ? 'HTTPS' : (url.startsWith('http://') ? 'HTTP' : 'RELATIVE'),
      method: args[1]?.method || 'GET',
      headers: args[1]?.headers,
      stack: new Error().stack?.split('\n').slice(1, 4).join('\n')
    });
    
    // Check for mixed content
    if (window.location.protocol === 'https:' && url.startsWith('http://')) {
      console.error('🚨 MIXED CONTENT FETCH DETECTED:', {
        pageProtocol: window.location.protocol,
        requestURL: url,
        method: args[1]?.method || 'GET',
        stack: new Error().stack
      });
    }
    
    // Force HTTPS for API requests if they're accidentally HTTP
    if (url.startsWith('http://') && url.includes('adhd-task-manager-api')) {
      const httpsUrl = url.replace('http://', 'https://');
      console.warn('🔧 Forced HTTP->HTTPS conversion in fetch:', { original: url, converted: httpsUrl });
      
      // Replace the URL in args
      if (typeof args[0] === 'string') {
        args[0] = httpsUrl;
      } else if (args[0] instanceof Request) {
        args[0] = new Request(httpsUrl, args[0]);
      }
    }
    
    return originalFetch.apply(this, args);
  };

  // Intercept XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async?, user?, password?) {
    const urlStr = typeof url === 'string' ? url : url.toString();
    
    console.log('📡 XMLHttpRequest Intercepted:', {
      method,
      url: urlStr,
      protocol: urlStr.startsWith('http://') ? 'HTTP' : urlStr.startsWith('https://') ? 'HTTPS' : 'UNKNOWN',
      timestamp: new Date().toISOString(),
      stack: new Error().stack?.split('\n').slice(1, 4).join('\n')
    });
    
    // Check for mixed content
    if (window.location.protocol === 'https:' && urlStr.startsWith('http://')) {
      console.error('🚨 MIXED CONTENT XHR DETECTED:', {
        pageProtocol: window.location.protocol,
        requestURL: urlStr,
        method,
        stack: new Error().stack
      });
    }
    
    // Force HTTPS for API requests if they're accidentally HTTP
    let finalUrl = urlStr;
    if (urlStr.startsWith('http://') && urlStr.includes('adhd-task-manager-api')) {
      finalUrl = urlStr.replace('http://', 'https://');
      console.warn('🔧 Forced HTTP->HTTPS conversion in XMLHttpRequest:', { original: urlStr, converted: finalUrl });
    }
    
    return originalXHROpen.call(this, method, finalUrl, async as boolean, user as string, password as string);
  };

  console.log('🔍 Global request interceptors installed for mixed content debugging');
}
