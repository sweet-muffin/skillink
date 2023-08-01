const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        createProxyMiddleware("/v1/", {
            target: process.env.REACT_APP_WANTED_ENDPOINT,
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware("/api", {
            target: "http://localhost:8080/",
            changeOrigin: true,
        })
    );
};
