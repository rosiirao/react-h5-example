// eslint-disable-next-line node/no-unpublished-require
const {createProxyMiddleware} = require('http-proxy-middleware');

const proxyApiTarget = import.meta.env.PROXY_API_TARGET;

module.exports =
  proxyApiTarget !== undefined
    ? ((app) => {
        app.use(
          '/api',
          createProxyMiddleware({
            target: proxyApiTarget,
            pathRewrite: {
              '^/api': '', // remove base path
            },
            cookiePathRewrite: {
              '/auth/refresh_token': '/api/auth/refresh_token',
            },
            changeOrigin: true,
            secure: false,
          })
        );
      })
    : undefined;
