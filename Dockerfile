# build stage
# 拉取最小体积的node环境容器,并安装cnpm
FROM node:lts-alpine as build-stage
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

# 进入容器的app目录，然后拷贝当前目录的所有文件到容器的当前目录中(app)
WORKDIR /app
COPY . .

# 删除vue环境配置文件（主要想通过容器的环境变量来达到不同的环境切换，以及为了部署到阿里云的容器服务，通过配置项来配置相关的环境变量，如果不需要可以删除以下代码）
# RUN rm -rf .env.*

ENV VUE_APP_TEST_VALUE="My test value"

# 在容器内build
RUN cnpm run build

# production stage
# 最后通过nginx部署build出来的文件(/dis)
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]