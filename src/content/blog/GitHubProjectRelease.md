---
title: GitHub Actions Auto Release
tags: [GitHub]
categories: [DevOps]
index_img: https://cdn.jsdelivr.net/gh/ReaJason/blog_imgs/17wanxiaoCheckInSCF_index_img.jpg
date: "2025-03-05 23:00:00"
description: "DevOps 之拥有一个自己 GitHub Repo 的发布 CI"
---

## 目标

> 其实很多大的开源项目手动发布 Release 的，不过对于个人项目来说，弄一个自动发布的 CI 当时是事半功倍的事情。

1. 每次提交 TAG 的时候自动触发 Release CI 进行发布
2. 将 CHANGELOG 中以 TAG 版本号为开头的内容当作 GitHub Release 的详情
3. 后续可做的事情包括 Docker Push，Maven Publish，Update Deployment 等等

## 实操

### 编写 CHANGELOG

在项目根目录创建一个 CHANGELOG.md 文件来记录日志，格式推荐参考 [如何维护更新日志](https://keepachangelog.com/zh-CN/1.1.0/)，也可以查看你喜欢的开源项目是如何组织 CHANGELOG 的，都可以学习和借鉴一下。以下是我做了一些修改：

1. 添加了 `@ReaJason`，这个参考 [官方文档/创建发行版](https://docs.github.com/zh/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) 第八点，当在 Release Body 里面 @ 某人时，会自动新增 Contributors 来展示贡献者的头像。
2. Full Changelog 这一项在许多开源项目中都有，直接照抄

```md
## [v1.5.0](https://github.com/ReaJason/MemShellParty/releases/tag/v1.5.0) - 2025-03-01

### Added

- 支持 NeoreGeorg 内存马生成 by @ReaJason
- 支持 UI 显示更新按钮跳转到 GitHub Release 界面

### Changed

- 简化 Valve 内存马代码
- 升级 Gradle 8.13

**Full Changelog:** [v1.4.0...v1.5.0](https://github.com/ReaJason/MemShellParty/compare/v1.4.0...v1.5.0)
```

具体效果可以直接查看 [MemShellParty Release v1.5.0](https://github.com/ReaJason/MemShellParty/releases/tag/v1.5.0)

### 编写指定版本解析 CHANGELOG 脚本

这块有些项目直接使用 bash 脚本来完成，其实 GitHub Runner 里面自带 Python 环境，写写 Python 脚本来做也是蛮好的，直接问大模型要代码就可以了，以下是我生成的脚本：

1. 如果你想知道 Runner 里面还有自带其他什么环境，可直接在 [官方文档/用于公共存储库的 GitHub 托管的标准运行器](https://docs.github.com/zh/actions/writing-workflows/choosing-where-your-workflow-runs/choosing-the-runner-for-a-job#%E7%94%A8%E4%BA%8E%E5%85%AC%E5%85%B1%E5%AD%98%E5%82%A8%E5%BA%93%E7%9A%84-github-%E6%89%98%E7%AE%A1%E7%9A%84%E6%A0%87%E5%87%86%E8%BF%90%E8%A1%8C%E5%99%A8) 点击最右边的工作流标签跳到镜像构建的仓库就能看到了

```py
import argparse
import sys

if __name__ == '__main__':
    capture = False
    result_lines = []
    parser = argparse.ArgumentParser(description="Extract changelog for a specific version")
    parser.add_argument("version", help="The version of the changelog to extract, e.g. 'v1.0.0'")
    args = parser.parse_args()
    version = args.version
    # 这个需要指定脚本与 CHANGELOG 的相对路径，可能需要修改
    with open("../../CHANGELOG.md") as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith(f"## [{version}]"):
                capture = True
            elif capture and line.startswith("## ["):
                break
            elif capture:
                result_lines.append(line)
    if not result_lines:
        print("Specified version not found.", file=sys.stderr)
        sys.exit(1)
    print("".join(result_lines).strip())
```

使用方式就是执行 `python parse_changelog_of_version.py v1.5.0` 就能获取 1.5.0 版本相关的日志内容。
后续因为有小伙伴问我这个东西怎么运行不了，所以我修改了脚本，每次 Release Body 里面都添加运行步骤，参考如下：

```py
import argparse
import sys

if __name__ == '__main__':
    capture = False
    result_lines = []
    parser = argparse.ArgumentParser(description="Extract changelog for a specific version")
    parser.add_argument("version", help="The version of the changelog to extract, e.g. 'v1.0.0'")
    args = parser.parse_args()
    version = args.version

    with open("../../CHANGELOG.md") as f:
        lines = f.readlines()
        for line in lines:
            if line.startswith(f"## [{version}]"):
                capture = True
            elif capture and line.startswith("## ["):
                break
            elif capture:
                result_lines.append(line)
    if not result_lines:
        print("Specified version not found.", file=sys.stderr)
        sys.exit(1)
    result_lines.append("## 更新方式\n")
    result_lines.append("### Docker 部署\n")
    result_lines.append("```bash\n")
    result_lines.append("docker rm -f memshell-party\n\n")
    result_lines.append("docker run --pull=always --rm -it -d -p 8080:8080 --name memshell-party reajason/memshell-party:latest\n")
    result_lines.append("```\n")
    result_lines.append("### Jar 包启动\n")
    result_lines.append("> 仅支持 JDK17 及以上版本\n")
    result_lines.append("```bash\n")
    result_lines.append(f"java -jar --add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED --add-opens=java.xml/com.sun.org.apache.xalan.internal.xsltc.runtime=ALL-UNNAMED boot-{version.strip('v')}.jar\n")
    result_lines.append("```\n")
    print("".join(result_lines).strip())
```

### 编写 CI 脚本

#### 只有 push tag 的时候才触发

```yaml
on:
  push:
    tags:
      - 'v*' # tag 需要以 v 开头才会触发，例如 v1.0.0
```

#### 解析 TAG 中的 version 以及 CHANGELOG

在部分构建过程中可能都需要能拿到当前版本信息，而版本信息在 TAG 里面，单独抽取出来一个 job 这样解析一次就可以了

```yaml
info:
    name: Parse release info
    runs-on: ubuntu-latest
    outputs: # 暴露当前 job 解析出来的参数，供其他 job 使用
      version: ${{ steps.get_version.outputs.version }} # TAG，即 v1.0.0
      version-without-v: ${{ steps.get_version.outputs.version-without-v }} # 去掉 v 的版本，即 1.0.0
      changelog: ${{ steps.get_changelog.outputs.changelog }} # 解析出来的版本变更日志
    steps:
      - uses: actions/checkout@v4

      - name: Get Version # 参考 https://github.com/orgs/community/discussions/26686#discussioncomment-3252857
        id: get_version
        run: |
          VERSION=${GITHUB_REF#refs/tags/}
          VERSION_WITHOUT_V=${VERSION#v}
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "version-without-v=$VERSION_WITHOUT_V" >> $GITHUB_OUTPUT

      - name: Get ChangeLog
        id: get_changelog
        working-directory: .github/scripts # parse_changelog_of_version.py 脚本位置我放在了 .github/scripts 下
        # 此处参考 https://github.com/openai-translator/openai-translator/blob/c3bc4bb5de7404d597fe7cd6cea44941f1831bd3/.github/workflows/release.yaml#L28
        # 使用上面的 echo "changelog=${}" 不好使，可能是因为 markdown 格式里面有换行符之类的
        run: |
          echo "changelog<<EOF" >> $GITHUB_OUTPUT
          echo "$(python parse_changelog_of_version.py ${{ steps.get_version.outputs.version }})" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT
```

#### 构建应用并上传构建物

```yaml
build-jar:
    name: Build Jar
    runs-on: ubuntu-latest
    needs: [ info ] # 在需要用到版本信息的，都需要去依赖前面的 info job
    steps:
      - uses: actions/checkout@v4

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: 17

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Build Web with Bun
        working-directory: web
        run: bun install --frozen-lockfile && bun run build

      - name: Build Boot with Gradle
        run: ./gradlew -Pversion=${{ needs.info.outputs.version-without-v }} :boot:bootjar -x test

      - name: Upload Boot Jar
        uses: actions/upload-artifact@v4
        with:
          name: boot
          path: boot/build/libs/boot-${{ needs.info.outputs.version-without-v }}.jar
```

#### 构建 Docker 多架构镜像并 Push

```yaml
docker-push:
    name: Docker Push
    needs: [ info, build-jar ]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download Boot Jar
        uses: actions/download-artifact@v4
        with:
          name: boot
          path: boot/build/libs

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          registry: docker.io
          username: ${{ vars.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: boot
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            docker.io/reajason/memshell-party:${{ needs.info.outputs.version-without-v }}
            docker.io/reajason/memshell-party:latest
            ghcr.io/reajason/memshell-party:${{ needs.info.outputs.version-without-v }}
            ghcr.io/reajason/memshell-party:latest
```

#### 创建 GitHub Release

```yaml
create-release:
    name: Create Release
    needs: [ info, docker-push ]
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Download Boot Jar
        uses: actions/download-artifact@v4 # 下载上一步的 jar 包，因为我希望用户能直接在 release 里面也能下载到 jar 包
        with:
          name: boot
          path: boot/build/libs

      - name: Calculate SHA-256
        id: calculate_sha256
        run: |
          sha256sum boot/build/libs/boot-${{ needs.info.outputs.version-without-v }}.jar > boot/build/libs/boot-${{ needs.info.outputs.version-without-v }}.sha256

      - name: Release
        uses: ncipollo/release-action@v1
        with:
          name: ${{ needs.info.outputs.version }}
          tag: ${{ needs.info.outputs.version }}
          body: ${{ needs.info.outputs.changelog }}
          artifacts: boot/build/libs/boot-${{ needs.info.outputs.version-without-v }}.jar,boot/build/libs/boot-${{ needs.info.outputs.version-without-v }}.sha256
```

#### 更新部署镜像

这个的话，看应用是如何部署的，如果部署在自己服务器可以通过 SSH 来重新部署，如果其他方式可能都有类似的 API 或 SDK 来实现，我这儿就是因为 northflank 官方的 Actions 年久失修，索性直接调 API 算了。

```yaml
deploy-northflank:
    name: Deploy to Northflank
    needs: [ docker-push ]
    runs-on: ubuntu-latest
    env:
        NORTHFLANK_API_KEY: ${{ secrets.NORTHFLANK_API_KEY }}
    steps:
        - name: Update Deployment
        run: |
            curl --header "Content-Type: application/json" \
                --header "Authorization: Bearer $NORTHFLANK_API_KEY" \
                --request POST \
                --data '{"external":{"imagePath":"docker.io/reajason/memshell-party:latest","credentials":"docker-hub"},"docker":{"configType":"default"}}' \
                https://api.northflank.com/v1/projects/memshellparty/services/memshellparty/deployment
```

#### 完整示例

参考 [MemShellParty/release.yaml](https://github.com/ReaJason/MemShellParty/blob/master/.github/workflows/release.yaml)，have fun 👋 ~

By the way，写完可能会调试个十几次 CI，不过坚持就是胜利。
