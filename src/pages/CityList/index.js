import React from 'react'

import { NavBar,Toast } from 'antd-mobile'
import { List, AutoSizer } from 'react-virtualized';

import './index.scss'

import axios from 'axios'

// 导入utils 中获取当前定位城市的方法
import { getCurrentCity } from '../../utils/index'

// 数据格式化的方法
const formatCityData = (list) => {
    const cityList = {}
    let cityIndex = []
    //1.遍历list数组
    list.forEach(item => {
        //2.获取每一个城市的首字母
        const first = item.short.substr(0, 1)
        //3.判断cityList 中是否有该分类
        if (cityList[first]) {
            //4.如果有，直接往该分类中push数据，
            //cityList[first] => [{},{}]
            cityList[first].push(item)
        } else {
            //5.如果没有，就先创建一个数据，然后把当前城市信息放到数组中
            cityList[first] = [item]
        }
    })

    //获取索引数据
    cityIndex = Object.keys(cityList).sort()

    return {
        cityList,
        cityIndex
    }
}
// 步骤
// 1 将获取到的citylist和cityIndex 添加为组件的状态数据
// 2 修改List组件的rowCount为cityIndex数组的长度
// 3 将rowRenderer函数，添加到组件中，以便在函数中获取到状态数据cityList和cityIndex
// 4 修改List组件的rowRenderer为组件中的rowRenderer 方法
// 5 修改rowRender 方法中渲染的每行结构和样式
// 6 修改List组件的rowHeight 为函数，动态计算每一行的高度（因为每一行的高度都不相同）

// 列表数据的数据源
// const list = Array(100).fill('react-virtualized')
// 渲染每一行数据的渲染函数
// 函数的返回值就表示最终渲染在页面中的内容
// function rowRenderer({
//     key, // Unique key within array of rows
//     index, // 索引号
//     isScrolling, // 当前项是否正在滚动中
//     isVisible, // 当前项在list中是可见的
//     style, //注意：重点属性，一定要给每一行书库添加该样式，作用：指定每一行的位置
// }) {
//     return (
//         <div key={key} style={style}>
//             123- {list[index]}
//         </div>
//     );
// }

// 索引（A，B等）的高度
const TITLE_HEIGHT = 36
// 每个城市名称的高度
const NAME_HEIGHT = 50
// 有房源的城市
const HOUSE_CITY = ['北京','上海','广州','深圳']

//封装处理字母索引的方法
const formatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}
export default class CityList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            cityList: {},
            cityIndex: [],
            //指定右侧字母索引列表高亮的索引号
            activeIndex:0
        }
        //创建ref对象
        this.cityListComponent = React.createRef()
    }
    
    async componentDidMount() {
        await this.getCityList()
        //调用 measureAllRows,提前计算List中每一行的高度，实现scrollToRow 的精确跳转
        //注意：调用这个方法的时候，需要保证List组件中已经有数据了，如果List组件中的数据为空，就会导致调用该方法报错
        //解决：只要保证这个方法是在获取到数据之后 调用即可
        this.cityListComponent.current.measureAllRows()
    }

    // 动态计算每一行高度的方法
    getRowHeight = ({ index }) => {
        // 索引标题高度+城市数量*城市名称的高度
        // TITLE_HEIGHT + cityList[cityIndex[index]].length*NAME_HEIGHT 
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }

    // 获取城市列表数据的方法
    async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        // console.log('城市列表的数据：', res.data.body)
        const { cityList, cityIndex } = formatCityData(res.data.body)

        //    获取热门城市
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        // console.log('热门城市的数据', hotRes.data.body)
        //    将数据添加到cityList中
        cityList['hot'] = hotRes.data.body

        //    将索引添加到cityIndex中
        cityIndex.unshift('hot')

        //    获取当前定位城市
        const curCity = await getCurrentCity()
        // 将当前定位城市数据添加到 cityList 中
        cityList['#'] = [curCity]

        // 将当前定位城市的索引添加到 cityIndex 中
        cityIndex.unshift('#')
        // console.log(cityList, cityIndex, curCity)
        this.setState({
            cityList,
            cityIndex
        })
    }

    changeCity({label,value}){
        if(HOUSE_CITY.indexOf(label) > -1){
            // 有
            localStorage.setItem('hkzf_city',JSON.stringify({label,value}))
            this.props.history.go(-1)
        }else{
            Toast.info('该城市暂无房源数据', 1,null,false);
        }
        
    }

    //List组件渲染，每一行的方法：
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // 索引号
        isScrolling, // 当前项是否正在滚动中
        isVisible, // 当前项在list中是可见的
        style //注意：重点属性，一定要给每一行书库添加该样式，作用：指定每一行的位置
    }) => {
        // 获取每一行的字母索引
        const { cityIndex, cityList } = this.state
        const letter = cityIndex[index]
        //获取指定字母索引下的城市列表数据
    


        return (
            <div key={key} style={style} className="city">
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    cityList[letter].map(item => <div className="name" key={item.value} onClick={()=>this.changeCity(item)}>{item.label}</div>

                    )}

            </div>
        );
    }
    // 1.给索引列表绑定点击事件
    // 2.在点击事件中，通过index 获取到当前项索引号
    // 3.调用List组件的 scrollToRow方法，让List 组件滚动到指定行
    // 3.1在constructor 中，调用React.createRef()创建ref对象
    // 3.2将创建好的ref对象，添加为List 组件的ref 属性
    // 3.3通过ref的current属性，获取组件实例，再调用组件的scrollToRow 方法
    // 4.设置List组件的scrollAlignment 配置项为start，保证被点击行出现在页面的顶部
    // 5.对于点击索引无法正确定位的问题，吊桶List组件的measureAllRows 方法，提前计算高度来解决

    // 渲染右侧渲染索引的办法
    renderCityIndex(){
        //获取到cityIndex,并遍历实现渲染
        const { cityIndex,activeIndex} = this.state
       return cityIndex.map((item,index) =>
        <li className="city-index-item" key={item} onClick={()=>{
            // console.log('当前索引号',index)
            this.cityListComponent.current.scrollToRow(index)

            }}>
            <span className={activeIndex ===index?'index-active':''}>{item==='hot'?'热':item.toUpperCase()}</span>
        </li>
    )
    }

    // 1.给List组件添加 onRowsRendered 配置项，用于获取当前列表渲染的行信息
    // 2.通过参数 startIndex获取到，起始行索引（也就是城市列表可视区最顶部一行的索引号）
    // 3.判断startIndex 和 activeIndex 是否相同（判断的目的是为乐提升性能，避免不要得state更新）

    //用于获取List组件中渲染行的信息
    onRowsRendered = ({startIndex}) =>{
        console.log('startIndex',startIndex)
        if(this.state.activeIndex !==startIndex){
            this.setState({
                activeIndex:startIndex
            })
        }
    }

    render() {
        return (
            <div className="citylist">
                <NavBar
                    className="navbar"
                    mode="light"
                    icon={<i className="iconfont icon-zuojiantou"></i>}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>
                {/* 城市选择 */}
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref={this.cityListComponent}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                            width={width}
                            onRowsRendered = {this.onRowsRendered}
                            scrollToAlignment = 'start'
                        />
                    )}
                </AutoSizer>
                {/* 1. 封装renderCityIndex 方法，用来渲染城市索引列表
                2. 在方法中，获取到索引数组 cityIndex,遍历cityIndex，渲染索引列表
                3. 将索引hot 替换为热
                4. 在state 中添加状态 activeIndex,来指定当前高亮的索引
                5. 在遍历CityIndex时，添加当前字母索引是否高亮的判断条件 */}
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
        </div>)
    }
}
