<template>
    <div>
        <Header></Header>
        <div class="mblog">
            <h2>{{blog.title}}</h2>
            <!-- 添加编辑按钮 -->
            <el-button icon="el-icon-edit">
                <router-link :to="{name: 'BlogEdit', params: {blogId: blog.id}}" v-show="ownBlog">
                    编辑
                </router-link>
            </el-button>
            <el-divider></el-divider>
            <!-- 使用github-markdown-css插件中的markdown-body格式再美化markdown格式的内容 -->
            <div class="markdown-body" v-html="blog.content"></div>
        </div>
    </div>
</template>

<script>
import Header from "../components/Header";
import "github-markdown-css";
export default {
    name: "BlogDetail.vue",
    components: { Header },
    data() {
        return {
            blog: {
                id: "",
                title: "默认",
                content: "内容"
            },
            ownBlog: false
        }
    },
      // 页面创建时执行
  created() {
      const blogId = this.$route.params.blogId
      const _this = this
      if (blogId) {
          this.$axios.get("/blog/"+blogId).then(res => {
              const blog = res.data.data
              _this.blog.id = blog.id
              _this.blog.title = blog.title

                // 使用markdown-it插件对markdown格式的内容进行渲染
                var MarkdownIt = require("markdown-it")
                var md = new MarkdownIt()
                var result = md.render(blog.content)

              _this.blog.content = result

            //   检查当前博客用户为当前用户时有权限进行编辑
            _this.ownBlog = (blog.userId === _this.$store.getters.getUser.id)
          })
      }
  }
}
</script>

<style scoped>
.mblog {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 700px;
    padding: 20px 15px;
}
</style>