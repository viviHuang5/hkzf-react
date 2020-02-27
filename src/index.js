import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//导入antd-mobile的样式
import 'antd-mobile/dist/antd-mobile.css'

//导入react-virtualized 组件的样式
import 'react-virtualized/styles.css'

//导入字体图标库的样式文件
import './assets/fonts/iconfont.css'
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

