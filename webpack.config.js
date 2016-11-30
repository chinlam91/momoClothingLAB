//var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');

var cfg = {
    entry: {
    	app:'./src/app.js',
    	vendor: [
	        'classnames',
	        'lodash',
	        'moment',
	        'react',
	        'react-addons-css-transition-group',
	        'react-addons-pure-render-mixin',
	        'react-addons-update',
	        'react-dom',
	        'react-dom/server',
	        'react-draggable',
	        'underscore.string'
	    ],
    },
    devtool: 'source-map',
    output: {
        path: 'assets/js/',
        filename: 'app.js'
    },
    module: {
        loaders: [
        	{
	            test: /\.js$/,
	            exclude: /node_modules/,
	            loaders: ['babel-loader'/*,'eslint-loader'*/]
        	}/*,
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }*/
        ]
    },/*
	eslint: {
	  	configFile: './.eslintrc'
	},*/
    plugins: [
        /*new ExtractTextPlugin("assets/css/all.webpack.css", {
        	allChunks: true
        }),*/
	    new webpack.optimize.CommonsChunkPlugin(
	    	/* chunkName= */"vendor", 
	    	/* filename= */"vendor.js"
	    )/*,
	    new webpack.optimize.UglifyJsPlugin({
		    compress: {
		        warnings: false
		    }
		})*/,
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
};

if (process.env.NODE_ENV === 'production') {
    cfg.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                screw_ie8: true
            }
        })
    )
}


module.exports = cfg