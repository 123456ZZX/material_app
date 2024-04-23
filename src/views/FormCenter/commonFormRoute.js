/*
 * @Author: gao_m3
 * @Date: 2022-08-05 09:13:25
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-05 09:13:26
 * @Descripttion:
 */
export function router (active, pid) {
    return [
        {
            // 对应添加表单的路由type = add
            path: 'form/:type/:formKey',
            hidden: true,
            component: () => import('./index'),
            meta: {
                activeMenu: active,
                config: ['invisible']
            },
            parentId: pid,
            id: 6151813
        },
        {
            // 对应编辑/查看/执行表单的路由type = edit/view
            path: 'form/:type/:formKey/:bizId',
            hidden: true,
            component: () => import('./index'),
            meta: {
                activeMenu: active,
                config: ['invisible']
            },
            parentId: pid,
            id: 6151813
        },
        {
            // 带taskId对应执行表单的路由type = execute
            path: 'form/:type/:formKey/:bizId/:taskId/:taskKey',
            hidden: true,
            component: () => import('./index'),
            meta: {
                activeMenu: active,
                config: ['invisible']
            },
            parentId: pid,
            id: 6151813
        }
    ]
}
