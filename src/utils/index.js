// 导入axios
import axios from 'axios'
// 1. 在until目录中，新建index.js,在该文件中封装这个函数
// 2. 创建并导出获取定位城市的函数 getCurrentCity 
export const getCurrentCity = () => {
// 3. 判断localStorage 中是否有定位城市
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'))
    if(!localCity){
    // 4. 如果没有，就使用首页中获取城市的代码来获取，并且存储到本地存储中，然后返回该城市数据
    return new Promise((resolve,reject) => {
        const curCity = new window.BMap.LocalCity()
        curCity.get(async res => {
            console.log('当前城市信息:',res)
            try{
                const result = await axios.get(`http://localhost:8080/area/info?name=${res.name}`)
                console.log(result)
                //result.data.body => {label:'上海',value:''}
                // 存储到本地存储中(只能存储字符串，必须转字符串先)
                localStorage.setItem('hkzf_city',JSON.stringify(result.data.body))
                //返回该城市数据
                //return result.data.body
                resolve(result.data.body)
            }catch(e){
                // 获取定位城市失败
                reject(e)
            }
            
        }); 
        })
    }

// 5. 如果有，直接返回本地存储中的城市数据
// 注意：因为上面为了处理异步操作，使用了 Promise 因此，为了该函数返回值的统一，此处也应该使用Promise
// 因为此处的 Promise 不会失败，所以，此处，只要返回一个成功的Promise即可
    return Promise.resolve(localCity)

}
