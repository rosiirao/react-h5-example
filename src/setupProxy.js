// eslint-disable-next-line prettier/prettier
const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dev.notacup.com:3443',
      pathRewrite: {
        '^/api': '', // remove base path
      },
      changeOrigin: true,
      secure: false,
    })
  );
};
