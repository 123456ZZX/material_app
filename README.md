# mobile-template

### 介绍

基于 [fawkes-mobile-lib ](http://172.20.79.29:9529/#/zh-CN/)组件库搭建的移动端业务框架。

### 安装

由于组件库目前只发布在公司 nexus 私服上，安装前全局设置仓库地址。

```bash
yarn/npm config set registry http://nexus.simulate.com:8081/repository/npm-group/
```

然后执行安装。

```bash
yarn/npm install
```

<b>注意事项：</b>本项目使用 npm 作为默认的依赖包管理工具，若偏向于使用 yarn，可自行选择，记得删除 package-lock.json，最好不要混用，以免产生未知的依赖冲突问题。

### 开发

本地开发、调试时请执行以下命令。

```bash
yarn serve
# or
npm run serve
```

### 构建

编译工程请使用以下命令。

```bash
yarn build
# or
npm run build
```

在 vue.config.js 文件中添加了可视化分析工具，打包完成后会自行在浏览器窗口打开结果，不需要则可屏蔽。

```js
config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin)
```

### 代码规范

本项目默认安装 eslint 和 prettier 依赖，使用 eslint 检查代码语法和查找错误，prittier 统一代码编写风格，如是否在语句末尾添加分号，缩进空格个数等。可在 .prettierrc 和 .eslintrc.js 文件中配置自定义规范。

### git 规范

为规范 git 提交代码时的说明信息，本工程使用 commitizen + cz-conventional-changelog 辅助插件，开发人员在 commit 代码时可使用以下命令：

```bash
yarn commit
# or
npm run commit
```

<b>Note：最好不要手动编辑 commit 信息，以免出现不符合工具要求格式的报错。请使用上述命令！！！</b>

按照提示一步一步填写信息即可，提交信息时可参考下表关于类型说明。

| **类型** | **描述**                                               |
| -------- | ------------------------------------------------------ |
| build    | 编译相关的修改，例如发布版本、对项目构建或者依赖的改动 |
| chore    | 其他修改, 比如改变构建流程、或者增加依赖库、工具等     |
| ci       | 持续集成修改                                           |
| docs     | 文档修改                                               |
| feat     | 新特性、新功能                                         |
| fix      | 修改 bug                                               |
| perf     | 优化相关，比如提升性能、体验                           |
| refactor | 代码重构                                               |
| revert   | 回滚到上一个版本                                       |
| style    | 代码格式修改, 注意不是 css 修改                        |
| test     | 测试用例修改                                           |

git 提供了许多 hook 函数，让我们可以在不同的阶段,对代码进行不同的操作,控制提交到仓库的代码的规范性和准确性，本项目安装了 husky 工具实现操作钩子函数的功能。

#### 提交的代码规范

需要安装本地暂存代码检查工具 lint-staged

- **pre-commit**
- 描述: 通过钩子函数,判断提交的代码是否符合规范
- 命令：`npx lint-staged`

#### 提交的信息规范

需要信息校验工具 commitlint

- **commit-msg**
- 描述: 通过钩子函数,判断 commit 信息是否符合规范
- 命令：`npx --no-install commitlint --edit $1`
