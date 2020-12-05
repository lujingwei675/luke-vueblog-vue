<template>
  <div class="mcontaner">
    <Header></Header>
    <div class="block">
      <el-timeline>
        <el-timeline-item
          :timestamp="blog.created"
          placement="top"
          v-for="(blog, idx) in blogs"
          :key="idx"
        >
          <el-card>
            <h4>
              <router-link :to="{ name: 'BlogDetail', params: { blogId: blog.id } }">
                {{ blog.title }}
              </router-link>
            </h4>
            <p>{{ blog.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <!-- 分页 -->
      <el-pagination
        class="mpage"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="page"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "Blogs.vue",
  components: { Header },
  data() {
    return {
      blogs: {},
      currentPage: 1,
      total: 0,
      pageSize: 5,
    };
  },
  methods: {
    page(currentPage) {
      const _this = this;
      _this.$axios.get("/blogs?currentPage=" + currentPage).then((res) => {
        console.log(res);
        _this.blogs = res.data.data.records;
        _this.currentPage = parseInt(res.data.data.current,10);
        _this.pageSize = parseInt(res.data.data.size,10);
      });
    },
  },
  // 页面创建时调用
  created() {
    this.page(1);
  },
};
</script>

<style scoped>
.mpage {
  margin: 0 auto;
  text-align: center;
}
</style>
