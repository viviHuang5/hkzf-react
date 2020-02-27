import React from 'react';
import { Route } from 'react-router-dom';

import News from '../News';
import Index from '../Index'
import Profile from '../Profile';
import HouseList from '../HouseList';

//导入Tabbar
import { TabBar } from 'antd-mobile';

//导入组件自己的样式文件
import './index.scss'

//TabBar 数据
const tabItems = [
    {
        title:'首页',
        icon:'icon-shouye',
        path:'/home'
    },
    {
        title:'找房',
        icon:'icon-dituzhaofang',
        path:'/home/list'
    },
    {
        title:'资讯',
        icon:'icon-zixun',
        path:'/home/news'
    },
    {
        title:'我的',
        icon:'icon-wode',
        path:'/home/profile'
    }
]


export default class Home extends React.Component {
    state = {
        //默认选中的TabBar菜单项
        selectedTab: this.props.location.pathname,
        //用于控制TabBar的展示和隐藏
        hidden: false
    }

componentDidUpdate(prevProps){
    if(prevProps.location.pathname !== this.props.location.pathname){
        //此时说明路由发生切换了
        this.setState({
            selectedTab: this.props.location.pathname,
        })
    }
}

    //渲染TabBar.Item
    renderTabBarItem(){
        return tabItems.map(item => <TabBar.Item
            title={item.title}
            key={item.title}
            icon={
                <i className={`iconfont ${item.icon}`}/>
            }
            selectedIcon={
                <i className={`iconfont ${item.icon}`}/>
            }
            selected={this.state.selectedTab === item.path}
            onPress={() => {
                this.setState({
                    selectedTab: item.path,
                });

                //路由切换
                this.props.history.push(item.path)
            }}
           
            ></TabBar.Item>)
    }


    render() {
        return <div className="home">
            {/* 渲染子路由 */}
            <Route exact path="/home" component={Index} />
            <Route path="/home/list" component={HouseList} />
            <Route path="/home/news" component={News} />
            <Route path="/home/profile" component={Profile} />
            {/* TabBar */}
            <div>
                <TabBar
                    unselectedTintColor="#888"
                    noRenderContent={true}
                    tintColor="#21b97a"
                    barTintColor="white"
                    hidden={this.state.hidden}
                   
                >
                    
                {this.renderTabBarItem()}
                </TabBar>
            </div>
        </div>
    }
}