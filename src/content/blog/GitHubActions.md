---
title: GitHubActions
date: "2022-11-21 14:12:03"
tags: [Notes]
categories: [GitHub]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/GitHubActions_index_img.jpg
description: "记录一下 GitHub Actions 的简单使用，强大得很"
---
## 概述

GitHub Actions 是一种持续集成和持续交付 (CI/CD) 平台，可用于自动执行生成、测试和部署管道。我的理解，为 GitHub 项目进行自动化操作的工具，提供一个 Linux 系统对我们的代码进行运行、构建、发布等等。工作流在仓库的 `.github/workflows` 下面定义，文件名为 `*.yml`，每一个 `yml` 文件一个工作流程。下面实例为一个简单的定时运行项目根路径下 `index.py` 文件的实例：

```yml
# 这是完美校园打卡项目最初用 GitHub Actions 定时进行打卡的一个工作流程
name: 17wanxiaoCheckin  # 工作流的名字

on:
   push:
    branches: [ master ] # 当往 master 上 push 代码的时候会触发当前工作流
   schedule:
    - cron: 0 22 * * *  # cron 表达式，每天 22:00 运行当前工作流

jobs:
  build: # 当前 job 的名称
    runs-on: ubuntu-latest  # 指定当前运行环境

    steps:
    - uses: actions/checkout@v2 # 检索出当前代码，即 clone 仓库代码到当前工作目录下

    - name: Pip
      run: pip3 install requests pycryptodome # 安装所需依赖

    - name: HealthyCheckIn
      run: python3 index.py # 运行脚本
```

```yml
# 当前工作流会生成三个 job 分别构建 python3.6、3.7、3.9 的包并上传到 Actions 下的构件列表，可供下载
name: auto-build

on:
  push:
    branches: master

jobs:
  build:
    strategy:
      matrix:
        python-version: [ "3.6", "3.7", "3.9"]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-python@v4  # 安装 Python 环境
        with:
          python-version: ${{ matrix.python-version }}

      - name: Pip Install  # 安装所需依赖
        run:  |
          python -m pip install --upgrade pip
          pip install -r requirements.txt -t .

      - name: Upload a Build Artifact  # 上传构件
        uses: actions/upload-artifact@v3.1.1
        with:
            name: 17wanxiaoCheckin-CF.py${{ matrix.python-version }}
            path: ./
```

## 常用语法

### on

在 `on` 下定义如何触发当前工作流程，具体的非常多。[参考文档](https://docs.github.com/cn/actions/using-workflows/events-that-trigger-workflows)

- `push`，当 push 操作时触发
- `schedule`，定时任务
- `pull_request`，当 PR 时触发

### jobs

在 `jobs` 下定义工作流任务，可以有多个。[参考文档](https://docs.github.com/cn/actions/using-jobs/using-jobs-in-a-workflow)

- `needs`，确定 jobs 间的依赖，以下为确保顺序为 job1,job2,job3

  ```yml
  jobs:
    job1:
    job2:
      needs: job1
    job3:
      needs: [job1, job2]
  ```

- `if`，为 true 才执行当前任务，在 `if` 条件下使用表达式时，可以省略表达式语法 (`${{ }}`)

### runs-on

指定当前任务所使用的计算机类型。[参考文档](https://docs.github.com/cn/actions/using-jobs/choosing-the-runner-for-a-job)

- `windows-latest`：最新 windows 服务器镜像，Windows Server 2022
- `ubuntu-latest`：最新 Ubuntu 服务器镜像，Ubuntu 22.04
- `macos-latest`：最新 Mac 服务器镜像，macOS Big Sur 11

### steps

定义一个任务中每一步操作。[参考文档](https://docs.github.com/cn/actions/learn-github-actions/contexts)

- `name`：当前步骤的名称
- `if`：为真才执行当前步骤
- `uses`：使用指定的 action 操作，[marketplace](https://github.com/marketplace?type=actions)
  - [actions/checkout@v3](actions/checkout@v3)：检出代码
  - [actions/setup-python@v4](actions/setup-python@v4)：安装 python 环境
  - [softprops/action-gh-release@v0.1.14](softprops/action-gh-release@v0.1.14)： 发布 release
  - [actions/upload-artifact@v3.1.1](https://github.com/marketplace/actions/upload-a-build-artifact)：上传构件
- `run`：默认在所选操作系统内运行命令行
- `working-directory`：可指定当前 `run` 后的命令所运行的工作目录
- `sehll`：设置 `run` 所处的环境
- `with`：设置 `uses` 指定的 `action` 所使用的输入参数 
- `env`：当前步骤所使用的环境变量

### matrix

定义矩阵策略进行多维度自动化。[参考文档](https://docs.github.com/cn/actions/using-jobs/using-a-matrix-for-your-jobs)

```yml
jobs:
  example_matrix: # 这个名字是 job id
    strategy:
      matrix:
        version: [10, 12, 14]
        os: [ubuntu-latest, windows-latest]
```

当前策略会以不同版本和操作系统执行 6 次任务，默认情况下，GitHub 将根据运行器的可用性将并行运行的作业数最大化，矩阵在每次工作流运行时最多将生成 256 个作业。可以使用 `matrix.version` 和 `matrix.os` 来访问作业正在使用的 `version` 和 `os` 的当前值。

```yml
jobs:
  example_matrix:
    strategy:
      matrix:
        os: [ubuntu-22.04, ubuntu-20.04]
        version: [10, 12, 14]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v3

        with:
          node-version: ${{ matrix.version }}
```



### badge

添加工作流徽章，显示工作流执行结果状态。

`https://github.com/<OWNER>/<REPOSITORY>/actions/workflows/<WORKFLOW_FILE>/badge.svg`

例：[![](https://github.com/ReaJason/17wanxiaoCheckin/actions/workflows/main.yml/badge.svg)](https://github.com/ReaJason/17wanxiaoCheckin/actions/workflows/main.yml/badge.svg)

## 表达式

`${{ <expression> }}`，使用该语法获取表达式值，在 if 中会自动对表达式求值，因此在 if 中可不加 `${{}}`。[参考文档](https://docs.github.com/cn/actions/learn-github-actions/expressions)

上下文变量，[参考文档](https://docs.github.com/cn/actions/learn-github-actions/contexts)。

## 扩展阅读

- [GitHub Actions 官方文档](https://docs.github.com/cn/actions)
- [GitHub Actions 入门教程 —— 阮一峰](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

