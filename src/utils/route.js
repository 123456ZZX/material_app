/*
 * @Author: gao_m3
 * @Date: 2022-08-05 09:01:50
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-05 14:41:33
 * @Descripttion:
 */
/*
 * @Author: wei_jt@ecidi.com
 * @Date: 2020-08-27 20:29:37
 * @LastEditors: wei_jt@ecidi.com
 * @LastEditTime: 2022-04-21 18:01:45
 * @Description: 权限相关方法
 */
import { setRoutes } from '@/router'
import { getRouter } from '@/api/user'
import { arrayToTree } from '@/utils/array'
import { uuid, isJSON, evil } from '@/utils/util'
import store from '@/store'
import storage from '@/utils/storage'
import { subApp, mainApp, appPathPrefix, useMainRoute } from '@/config'
import deepmerge from 'deepmerge'
import { getAppList } from '@/microapp/qiankun'
import { router } from '@/views/FormCenter/commonFormRoute'
import Vue from 'vue'
import { exportFile } from '@/utils/file'

/**
 * @description: 加载本地路由
 * @param {type} 
 * @return {type} 
 */
export const getLocalRoutes = async function () {
    let routes = []
    const reqs = require.context('@/views', true, /route\.js$/, 'lazy')

    //根据路径载入route文件
    const analysis = async function (arr, reg) {
        for (let k = 0; k < reqs.keys().length; k++) {
            let dpath = reqs.keys()[k]
            if (reg.test(dpath)) {
                let getModule = () => import(`@/views/${dpath.replace('./', '')}`)
                let cReq = await getModule()
                const md = deepmerge({ meta: { menuId: uuid(18) } }, cReq.default, { clone: true })
                arr ? arr.push(md) : arr = [md]
                let reg = new RegExp('^' + dpath.replace('/route.js', '') + '\/[a-zA-Z]+\/route\.js$')
                md.children || (md.children = [])
                await analysis(md.children, reg)
            }
        }
    }


    await analysis(routes, /^\.\/[a-zA-Z]+\/route\.js$/)



    routes = addSpecialBaseRoute(routes)

    //首页置顶
    routes.sort((v1, v2) => {
        return '/home' == v2.path ? 1 : -1
    })


    store.commit('SET_ROUTES', routes)
    setRoutes(routes)

    return routes.length > 0
}




/**
 * @description: 加载线上路由
 */
export const getUserRoutes = function () {
    return new Promise((resolve, reject) => {

        //当处于qiankun下的子应用，且设置为使用父应用传入的数据作为路由数据源
        if (useMainRoute && Vue.prototype.$InQianKun) {
            return resolve(getOwnRoutes(Vue.prototype.$fksMainStore.state.subRoutes))
        }
        else {
            getRouter().then(res => {
                return resolve(getOwnRoutes(res.data))
            }).catch((e) => {
                console.log(e)
                return resolve(getOwnRoutes())
            })
        }
    })
}



/**
 * @description:  只保留路径与基础路径一致的节点
 */
export const getOwnRoutes = function (routeList = []) {

    let res = {
        data: routeList
    }
    let routes = []

    let prefix = Vue.prototype.$appBasePath

    if (res.data instanceof Array) {

        let array = parseMenu(res.data)
        //排序
        array.sort((v1, v2) => {
            //自定义应用往后排

            if (v1.meta?.config?.indexOf('customApp') - v2.meta?.config?.indexOf('customApp') != 0) {
                return (v1.meta.config.indexOf('customApp') - v2.meta.config.indexOf('customApp'))
            }
            return isNaN(v1.sort) && isNaN(v2.sort) ? 0 : (isNaN(v2.sort) ? -v1.sort - 1 : isNaN(v1.sort) ? v2.sort + 1 : v1.sort - v2.sort)
        })

        try {
            // 解析为带children树结构的格式
            array = arrayToTree(array, 'parentId')
        } catch (error) {
            console.error(error)
        }

        routes = routes.concat(array.filter((a) => {
            return !a.meta.config.includes('customApp') || (a.children instanceof Array && a.children.length > 0)
        }))
    }

    // routes只保留路径与基础路径一致的节点
    routes = routes.filter(item => {
        return item.path.includes(prefix)
    })


    //子应用将以/sub_app_xx为根节点下的二级节点提升为一级节点
    if (subApp) {
        let newRoutes = []
        for (let route of routes) {
            if (route.children && route.path == prefix)
                route.children.forEach(child => {
                    if (child.path.indexOf('/') !== 0)
                        child.path = '/' + child.path
                    newRoutes.push(child)
                })
            else {
                newRoutes.push(route)
            }
        }
        routes = newRoutes
    }



    //添加路由异名并开始导入组件
    for (let i = 0; i < routes.length; i++) {
        addAlias(routes[i])
        importComponent(routes[i])
    }

    routes = addSpecialBaseRoute(routes)


    store.commit('SET_ROUTES', routes)
    setRoutes(routes)

    return routes.length > 0


}

const parseMenu = function (menus) {
    const array = []
    const formTemp = []
    for (let i = 0; i < menus.length; i++) {
        try {
            //路由转换
            const menuItem = { ...menus[i] }
            menuItem.meta = isJSON(menuItem.meta) ? JSON.parse(menuItem.meta) : {}
            if (!menuItem.meta.config) {
                menuItem.meta.config = []
            }
            if (menuItem.meta?.config?.includes('disabled') || menuItem.enable === false) {
                continue
            }
            // menuItem.component = () => import(`@/views${menus[i].component}`)
            menuItem.name = menuItem.code

            menuItem.meta.query || (menuItem.meta.query = {})

            if (menuItem.meta.query instanceof Array) {
                menuItem.meta.query = menuItem.meta.query.reduce((pval, val) => {
                    pval[val.key] = val.value
                    return pval
                }, {})
            }

            //链接携带token
            if (menuItem.meta?.config?.includes('token')) {
                Object.assign(menuItem.meta.query, { token: storage.get('access_token') })

            }

            //链接携带token
            if (menuItem.meta?.config?.includes('form')) {
                formTemp.push(...router(menuItem.path, menuItem.id))
            }

            //内嵌页面处理
            if (menuItem.meta.type == 'iframe') {
                Object.assign(menuItem.meta.query, { url: menuItem.path })
                menuItem.path = '/iframe/' + menuItem.id
                menuItem.component = '/Iframe/index.vue'
            }


            //1.8.3及之前版本后可兼容菜单显影

            // if (menuItem.hidden) {
            //   menuItem.meta.config instanceof Array ? (!menuItem.meta.config.includes('invisible') && menuItem.meta.config.push('invisible')) : menuItem.meta.config = ['invisible']
            // }

            menuItem.path || (menuItem.path = '')
            menuItem.meta.menuId = menuItem.id
            array.push(menuItem)
        } catch (error) {
            console.error(error)
        }
    }
    array.push(...formTemp)
    return array
}


/**
 * @description: 根节点为路径为/sub_app_xx时，对其下的子节点进行处理
 *               route的name由yy改为sub_app_xx_yy
 *               路径从/XX 改为/sub_app_xx/XX
 *               添加路径/sub_app_xx/home及/sub_app_xx/404 
 */
export function addAlias (route) {
    if (!subApp) return

    let nodeBasePath = Vue.prototype.$appBasePath

    let nodeBaseName = Vue.prototype.$appName

    //route的name由yy改为sub_app_xx_yy
    if (route.name && !route.name.includes(nodeBaseName)) { route.name = nodeBaseName + '_' + route.name }

    // 路径从/XX 改为/sub_app_xx/XX
    if (route.path.indexOf('/') === 0 && route.path.indexOf(nodeBasePath) != 0) {
        route.alias = nodeBasePath + route.path
        // route.path = nodeBasePath + route.path
    }

    if (route.children) {
        for (let childroute of route.children) {
            addAlias(childroute)
        }
    }
}

const addSpecialBaseRoute = function (routes) {
    //非子应用下加入*通配
    if (!Vue.prototype.$InQianKun) {
        routes.push({ path: '*', redirect: '/404', meta: { config: ['invisible'] } })
    }

    //主应用增加/sub_app_xx/* 路由
    if (mainApp) {
        let subApp = getAppList()
        for (let i = 0; i < subApp.length; i++) {
            let path = subApp[i].activeRoute + '/*'
            if (routes.some(item => item.path == path)) {
                continue
            }
            routes.push({ path: path, meta: { config: ['invisible'] } })
        }
    }
    return routes
}


const deleteComponent = function (item) {
    if (item.component)
        delete item.component
    if (item.children) {
        for (let i = 0; i < item.children.length; i++) {
            deleteComponent(item.children[i])
        }
    }
}


const importComponent = function (item) {

    //主应用模式下，不加载子级的子应用的组件
    if (mainApp) {
        let subPrefix = '/' + appPathPrefix
        if (item.path.includes(subPrefix)) {
            deleteComponent(item)
            return false
        }
    }

    try {
        let uri = item.component
        if (/^ModuleView/.test(uri)) {
            item.component = evil(uri)
        } else {
            item.component = () => import(`@/views${uri}`)
        }
    }
    catch (e) {
        debugger
        // return e 
    }

    if (item.children) {
        for (let i = 0; i < item.children.length; i++) {
            importComponent(item.children[i])
        }
    }
}

/**
 * @description: 将本地路由导出为可用于导入线上路由的文件
 *               默认不添加特殊属性
 *               若想进行特殊处理请自行修改newItem的属性计算方法
 * @param {Array} routes 
 */
export const exportLocalRoute = function (routes) {

    let transRouteToExportItem = async function (route) {

        let newItem = {
            path: route.path,
            redirect: route.redirect,
            code: route.name,
            title: (route.meta && route.meta.title) ? route.meta.title : route.name,
            meta: JSON.stringify({ ...route.meta }),
            children: [],
            hidden: false,
            isAuth: false,
            icon: '',
        }

        if (route.component && typeof (route.component) == 'function') {
            let result = await route.component()
            newItem.component = result.default.__file.replace(/src\/views(.*)/, '$1')
        }

        if (route.children) {
            for (let i = 0; i < route.children.length; i++) {
                let child = await transRouteToExportItem(route.children[i])
                newItem.children.push(child)
            }
        }
        else {
            delete newItem.children
        }

        return newItem
    }

    let exportRoute = routes.map(item => {
        return transRouteToExportItem(item)
    })

    Promise.all(exportRoute).then((res) => {

        let response = {
            data: JSON.stringify(res),
            headers: { 'content-disposition': 'attachment; filename="localMenus.json"' }
        }
        exportFile(response)
    })
}
