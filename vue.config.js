module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://47.244.14.16',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}