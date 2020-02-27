import React from 'react';

import {BrowserRouter as Router,Route,Redirect} from 'react-router-dom'

//导入首页和城市选择两个组件（页面）
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
//导入要使用的组件
import {Button} from 'antd-mobile'


function App() {
  return (
    <Router>
    <div className="App">
      <Route path="/" exact render={()=><Redirect to="/home" />}></Route>
   
      {/* 配置路由 */}
      <Route path="/home" component={Home}></Route>
      <Route path="/citylist" component={CityList}></Route>
      <Route path="/map" component={Map}></Route>
    </div>
    </Router>
  );
}

export default App;
