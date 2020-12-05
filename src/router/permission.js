import router from "../router"

// 路由判断登录 根据路由配置文件的参数
router.beforeEach(
    (to, from, next) => {
        // 根据配置判断该路由是否需要登录权限
        if(to.matched.some(record => record.meta.requireAuth)) {
            // 从localStorage中取token
            const token = localStorage.getItem("token")
            // 如果token存在则正常跳转，否则跳转到login页面
            if(token){
                if(to.path === '/login'){

                } else {
                    next()
                }
            } else {
                next({path: '/login'})
            }
        } else {
            next()
        }
    }
)