---
title: Dockerfile 作用(翻译自官网)
tags:
  - Docker
categories:
  - Docker
date: 2021-05-25 10:07:22
updated:
---


[官网原文](https://docs.docker.com/engine/reference/builder/)

Docker 能够通过 `Dockerfile` 文件中的指令来自动构建镜像。一个 `Dockerfile` 文件是一个包含用户能够调用所有命令去构建新的镜像的文档的集合。使用 `docker build` 命令，用户可以创建一个基于连续的指令而自动构建镜像。

这篇文章描述了能在 `Dockerfile` 中使用的指令。当你完成阅读这篇文章，可以看看 [Dockerfile 最佳实践](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)，作为提示导向的指导。

<!-- more -->
# 使用
`docker build` 命令从一个 `Dockerfile` 文件和一个 `环境` 来构建镜像。构建的环境是指一个具体 `PATH` 下的文件集合或者是一个 `URL`。`PATH` 是一个你本地文件系统的目录，`URL` 是一个 Git 仓库地址。

构建环境会被递归地处理，因此，一个 `PATH` 如果包含了任意的子目录，或者是 `URL` 包含了子模块，都会被递归处理。下面的例子展示了在当前目录 `.` 作为构建环境， 使用 build 命令生成镜像：
```bash
docker build .
```

构建过程是被 `Docker daemon` 执行的，不是 cli。构建过程的首要工作是发送整个环境（递归的）给后台驻留程序（daemon）。在绝大部分场景中，最好是将一个空目录作为构建环境，并且保证你的 `Dockerfile` 文件在那个目录中。 __只添加构建过程中必要的文件。__

> __警告：<br/>__
> 不要在根目录，也就是 `/` 下，作为构建目录，因为它会造成构建过程中传递整个文件系统给 Docker 后台驻留程序。

在构建环境中使用一个文件，`Dockerfile` 指引着具体的文件，比如，一个 `COPY` 指令。为了增加构建的效率，可以通过添加 `.dockerignore` 文件到构建环境目录里，排除某些文件。关于如何使用 `.dockerignore` ，可以查看[文档](https://docs.docker.com/engine/reference/builder/#dockerignore-file)。

传统上，`Dockerfile` 文件就命名为：Dockerfile，而且就有构建环境的根上。你也可以在 `docker build` 上使用 `-f` 选项来指向你文件系统上的 Dockerfile 文件。
```bash
docker build -f /path/to/your/Dockerfile .
```

你可以指定一个仓库和标签，当新镜像构建成功后，会使用 仓库/标签 的形势存储这个镜像：
```bash
docker build -t shykes/myapp .
```

如果要命名为多个仓库，可以添加多个 `-t` 参数：
```bash
docker build -t shykes/myapp:1.0.2 -t shykes/myapp:latest .
```

在 Docker daemon 开始执行 `Dockerfile` 中的指令之前，它会执行一次预校验，如果语法错误，会直接返回错误：
```bash
docker build -t test/myapp .

[+] Building 0.3s (2/2) FINISHED
=> [internal] load build definition from Dockerfile                       0.1s
=> => transferring dockerfile: 60B                                        0.0s
=> [internal] load .dockerignore                                          0.1s
=> => transferring context: 2B                                            0.0s
error: failed to solve: rpc error: code = Unknown desc = failed to solve with frontend dockerfile.v0: failed to create LLB definition:
dockerfile parse error line 2: unknown instruction: RUNCMD
```

Docker daemon 一个接一个的执行 `Dockerfile` 里的指令，如果有必要，在最终输出你的新镜像 ID 之前，会提交每一个指令的结果给新的镜像。Docker daemon 会自动把构建环境清理干净。

注意到，每一个指令都是独立执行的，并且会导致产生新的镜像。因此， `RUN cd /tmp` 不会对下一条指令有任何影响。

如何可能，Docker 会使用构建缓存来显著提升 `docker build` 性能。这可以通过控制台的 console 输出看到，带有 `CACHED` 信息（更多信息可查看[Dockerfile 最佳实践](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/）:
```bash
docker build -t svendowideit/ambassador .

=> [internal] load build definition from Dockerfile                       0.1s
=>  => transferring dockerfile: 286B                                       0.0s
=>  [internal] load .dockerignore                                          0.1s
=>  => transferring context: 2B                                            0.0s
=>  [internal] load metadata for docker.io/library/alpine:3.2              0.4s
=>  CACHED [1/2] FROM docker.io/library/alpine:3.2@sha256:e9a2035f9d0d7ce  0.0s
=>  CACHED [2/2] RUN apk add --no-cache socat                              0.0s
=>  exporting to image                                                     0.0s
=>  => exporting layers                                                    0.0s
=>  => writing image sha256:1affb80ca37018ac12067fa2af38cc5bcc2a8f09963de  0.0s
=>  => naming to docker.io/svendowideit/ambassador                         0.0s
```

构建缓存默认上是基于上一次构建过程。 `--cache-from` 选项也让你能使用分发到镜像仓库的构建缓存，可参阅 [指定外部缓存源](https://docs.docker.com/engine/reference/commandline/build/#specifying-external-cache-sources) 章节中的 `docker build` 命名索引处。

当你构建完成后，你可以通过 `docker scan` 来查看你的镜像，也可以将它推送到 Docker Hub。

# BuildKit
从版本 18.09 开始，Docker 支持了新的构建后端，由 moby/buildkit 项目支持。BuildKit 后端提供了相对于老的实现方式更多的优势，包括：

- 检测和跳过执行无用的构建阶段
- 并行构建独立的构建阶段
- 在多次构建中，增量传递构建环境中变化了的文件
- 在构建环境中检测和跳过传递无用的文件
- 使用外部有更多特性的 Dockerfile 实现
- 避免其他 api 的副作用（中间镜像和容器）
- 优先考虑构建缓存来自动修剪

为了使用 BuildKit 后端，你需要在 cli 中设置环境变量 `DOCKER_BUILDKET=1`，在你执行 `docker build` 之前。

学习基于 BuildKit 构建的实验性的 Dockerfile 语法，可以参考[文档](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/experimental.md)。

# 格式
下面是 `Dockerfile` 的格式：
```Dockerfile
# comment
INSTRUCTION arguments
```

指令是大小写不敏感的。然而，把他们写成大写的话，更容易识别参数。

Docker 按序执行 `Dockerfile` 里的指令。一个 `Dockerfile` 文件 __必须以 FROM 指令开头__ ，这个指令可能在 [parser directives](https://docs.docker.com/engine/reference/builder/#parser-directives)、注释和其他全局[参数](https://docs.docker.com/engine/reference/builder/#arg)之后。 `FROM` 指令指定了你正在构建时用的[父镜像](https://docs.docker.com/glossary/#parent_image)。 `FROM` 也可能且仅可能后于一个或多个 `ARG` 指令，它是用于声明在 `FROM` 这一行中会使用到的参数。

Docker 将以 `#` 开头的作为注释，除非这一行是一个有效的[解析器指令](https://docs.docker.com/engine/reference/builder/#parser-directives)。一行中的其他位置的 `#` 标志被当做参数。比如：
```Dockerfile
# Comment
RUN echo 'we are running some # of cool things'
```

评论行在指令执行前会被移除，意味着下面的例子中，注释不会被处理，下面两个例子是一样的：
```Dockerfile
RUN echo hello \
# comment
world
```
```Dockerfile
RUN echo hello \
world
```

行连续字符（\\） 在注释中不被支持。

> 关于空格符<br/>
为了向后兼容，在注释符和指令（比如 RUN）前面的空格会被忽略，但不建议这么使用。前置的空格在这些情况下也不会被保留。但是在指令参数中的空白符会被保留。下面的例子是一样的：
```Dockerfile
        # this is a comment-line
    RUN echo hello
RUN echo world
```
```Dockerfile
# this is a comment-line
RUN echo hello
RUN echo world
```

# 解析器指令
解析器指令是可选的，影响着接下来的行如何被处理。解析器指令不会添加 layer 到构建中，也不会作为一个构建阶段来展示。解析器指令使用一中注释的特殊形式：`# directive=value`。一个单独的指令可能只会被使用一次。

一旦注释、空行或者构建指令被处理了，Docker 就不会再查找解析器指令了，而是把他们当做注释，不会再检查它们是否是有效的解析器指令。因此，所有解析器指令 __必须__ 放在 `Dockerfile` 文件的最顶上。

解析器指令是大小写不敏感的。然而，按规定它们是小写的。规定也说明，在任何解析器指令后应该有一个空白行。行连续符（\\）在指令中不生效。

由于这些规则，下面的例子是不合法的：
因为使用行连续符：
```Dockerfile
# direc \
tive=value
```
因为出现了两次：
```Dockerfile
# directive=value1
# directive=value2

FROM ImageName
```
因为在构建指令之后：
```Dockerfile
FROM ImageName
# directive=value
```
在一个注释之后，而被当做了注释：
```Dockerfile
# About my dockerfile
# directive=value
FROM ImageName
```
未知的指令同样被当做注释，除此之外，已知的指令由于出现在注释后，而被当做注释：
```Dockerfile
# unknowndirective=value
# knowndirective=value
```
在解析器指令中不允许使用换行符空格，因此下面的所有行都是一样的：
```Dockerfile
#directive=value
# directive =value
#	directive= value
# directive = value
#	  dIrEcTiVe=value
```
下面的解析器指令是被支持的：
- syntax
- escape

# syntax
```Dockerfile
# syntax=[remote image reference]
```
举例：
```Dockerfile
# syntax=docker/dockerfile:1
# syntax=docker.io/docker/dockerfile:1
# syntax=example.com/user/repo:tag@sha256:abcdef...
```

仅当使用 BuildKit 后端时才可用该特性，使用传统构建后端时会被忽略。

syntax 指令定义用于构建 Dockerfile 文件的 Dockerfile 语法的位置。BuildKit 后端允许无缝使用被分发为 Docker 镜像的外部实现，并在容器沙箱内部环境执行。

自定义 Dockerfile 实现，能让你：
- 自动获取 bugfixes 而不用更新 Docker daemon
- 确保所有用户使用相同的实现去构建你的 Dockerfile
- 使用最新的特性，而不用更新 Docker daemon
- 在新特定或者第三方特性集成进 Docker daemon 之前体验到
- 使用[替换的构建定义，或者创建你自己的](https://github.com/moby/buildkit#exploring-llb)

## 官方发布（略）



# escape（略）
```Dockerfile
# escape=\ (backslash)
or
# escape=` (backtick)
```
`escape` 指令设置了 Dockerfile 里的转义符。默认为：\\。

# 环境变量替换
环境变量（由 `ENV` 声明的）能够在一些指令中被使用。转义也可以通过在字面上将类似变量的语法包含到语句中来进行处理。

环境变量在 Dockerfile 中被声明为：`${variable_name}` 或者 `$variable_name`。

`${variable_name}` 语法也支持一些标准的 `bash` 修改符，如下：
- ${variable:-word}：判断`variable` 是否被设置，如果被设置，该值就是返回结构；如果没有被设置，`word` 就是返回结果；
- ${variable:+word}：判断`variable` 是否被设置，如果被设置，`word` 就是返回结果；否则，返回空字符串

在所有场景中， `word` 可以是任何字符串，包括环境变量。

转义符可能在变量前，\\$foo or \\${foo}，这样就会被转义为字符串自变量 $foo、${foo}。

例子：
```Dockerfile
FROM busybox
ENV FOO=/bar
WORKDIR ${FOO}   # WORKDIR /bar
ADD . $FOO       # ADD . /bar
COPY \$FOO /quux # COPY $FOO /quux
```

环境变量被以下指令所支持：
- ADD
- COPY
- ENV
- EXPOSE
- FROM
- LABEL
- STOPSIGNAL
- USER
- VOLUME
- WORKDIR
- ONBUILD (当与上面支持的指令组合时)

在整条指令中，环境变量替换会使用相同的值，比如：
```Dockerfile
ENV abc=hello
ENV abc=bye def=$abc
ENV ghi=$abc
```
`def` 会是 `hello`，而不是 `bye`，然后， `ghi` 的值是 `bye`，因为它在上一行赋值之外。

# .dockerignore 文件（略）
https://docs.docker.com/engine/reference/builder/#dockerignore-file

# FROM
```Dockerfile
FROM [--platform=<platform>] <image> [AS <name>]
or
FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
or
FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]
```

`FROM` 指令初始化一个新的构建阶段，并且为接下来的指令设置基础镜像。如此，一个有效的 Dockerfile 文件必须以 `FROM` 指令开始。镜像可以是任意有效的镜像，特别简单的开始是从公共仓库拉一个镜像。

- `ARG` 是唯一能够在 `FROM` 之前的指令。见下方。
- `FROM` 可以在一个 Dockerfile 中出现多次，创建多个镜像或者使用一个构建阶段作为其他构建阶段的依赖。在每个新的`FROM`指令前，会简单的输出最后一个镜像 ID 到控制台上。每一个`FROM`指令会清除上一个指令产生的所有状态。
- 可选的 name 通过 `AS name`  添加到 `FROM` 的末尾，别名为一个新的构建阶段。这个别名可以在接下来的 `FROM` 和 `COPY --from=<name>` 指令中使用。
- tag 或者 digest 值是可选的。如果你或略他们，构建器会默认使用 `latest`作为 `tag`。如果不能找到这个 tag，会返回错误。

可选的 `--platform` 标志可以用于指定`FROM` 索引了多个平台的镜像时，某个平台使用的镜像。比如：`linux/amd64`、`linux/arm64`、`windows/amd64`等。默认的，构建请求的目标平台会被使用。全局构建参数也能在这个标志位中使用，比如[automatic platform ARGS](https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope) 允许你强制一个阶段来本地化构建平台（`--platform=$BUILDPLATFORM`），使用它在这个阶段来跨平台编译。

## 理解 ARG 和 FROM 的交互
FROM 指令支持由 FROM 指令之前的ARG 指令所声明的变量：
```Dockerfile
ARG  CODE_VERSION=latest
FROM base:${CODE_VERSION}
CMD  /code/run-app

FROM extras:${CODE_VERSION}
CMD  /code/run-extras
```

FROM 之前的 ARG 声明在一次构建阶段之外，因此它不能在 `FROM` 指令之后的任何地方使用。为了使用一个 ARG 声明的默认值，需要使用一个 ARG 指令来声明它，接着便能在一次构建阶段中使用了：
```Dockerfile
ARG VERSION=latest
FROM busybox:$VERSION
ARG VERSION
RUN echo $VERSION > image_version
```

# RUN
`RUN` 有两种形式：
- `RUN <command>` (shell 格式，命令在一个 shell 中执行，linux 上 默认是 /bin/sh -c ，在 windows 上是 cmd /S /C )
- `RUN ["executable", "param1", "param2"]` (exec 格式)

`RUN` 指令会在当前镜像的最顶层执行任何命令，然后再提交结果。提交的结果镜像会被下一步骤使用。

将 `RUN` 指令分层并且生成提交，符合 Docker 的核心概念：提交是廉价的，也能从镜像历史的任意一个点创建新的容器，有点像代码控制一样。

`exec` 模式可以避免 shell 字符串混乱，执行 RUN 命令使用一个不包含具体 shell 可执行命令的基础镜像。

对于 shell 模式，默认的 shell 可以通过 `SHELL` 命令修改。

在 shell 模式中，你可以使用反斜线（\\）来继续输入多行参数，比如：
```Dockerfile
RUN /bin/bash -c 'source $HOME/.bashrc; \
echo $HOME'
```
与下面例子是等价的：
```Dockerfile
RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME'
```

为了使用不同的 shell 而不是 /bin/sh，使用 exec 模式，传入期望的 shell，比如：
```Dockerfile
RUN ["/bin/bash", "-c", "echo hello"]
```

> 注意<br />
exec 模式会被解析为 JSON 数组，意味着你必须使用双引号（"）来包括参数。

不像 shell 模式，exec 模式不会调起一个命令行 shell。这意味着没有普通的 shell 进程产生。比如：`RUN ["echo", "$HOME"]` 不会进行 $HOME 变量替换。如果你想 shell 进程或者使用 shell 模式或者直接执行一个 shell，可以执行：`RUN ["sh", "-c", "echo $HOME"]`。当使用 ecec 模式并且直接执行一个 shell 时，是 shell 在进行环境变量替换，而不是 Docker。

> 注意<br />
在 JSON 的形式中，需要转义反斜线。比如：`RUN ["c:\windows\system32\tasklist.exe"]` 这会导致错误。正确的是：`RUN ["c:\\windows\\system32\\tasklist.exe"]`。

在下一次构建时，RUN 指令的缓存不会自动失效。指令的缓存，比如：`RUN apt-get dist-upgrade -y` 会在下次构建时重用。`RUN` 指令的缓存在使用 `--no-cache` 时会失效，比如：`docker build --no-cache`。

对于 RUN 的缓存可以被 `ADD`，`COPY`指令失效（文件改变）。

# CMD
CMD 指令有这三种格式：
- CMD ["executable","param1","param2"] (exec 模式，这是不错的模式)
- CMD ["param1","param2"] (作为 `ENTRYPOINT`的默认参数)
- CMD command param1 param2 (shell 模式)

在一个 Dockerfile 中只能有一个 CMD 指令。如果你提供多个 CMD 指令，则只有最后一个会生效。

__CMD的主要目标是为执行一个容器提供默认内容__ 。包括一个可执行文件，也可以省略可执行文件，在这种情况下，你必须指定一个 `ENTRYPOINT` 指令。

如果 CMD 被当做给 ENTRYPOINT 提供默认参数，那么 CMD 和 ENTRYPOINT 都必须用 JSON 数组的格式。

> 注意：<br/>
exec 模式也被当做 JSON 数组解析，必须使用双引号包裹。

不像 shell 模式，exec 模式不会调起一个 shell，这意味着没有shell 会产生。比如：CMD ["echo", "$HOME"] 不会进行变量替换。如果你想生成一个 shell 进程，那么使用 shell 模式或者执行一个 shell 脚本，比如：`CMD [ "sh", "-c", "echo $HOME" ]`。当使用 exec 模式直接执行一个 shell 脚本时，shell 会进行环境变量替换，而不是 docker。

当使用 shell 或者 exec 格式时，CMD 指令指定了执行镜像时的命令。

如果你用 CMD 执行 shell 模式，那么 <command> 会以`/bin/sh -c` 形式执行：
```Dockerfile
FROM ubuntu
CMD echo "This is a test." | wc -
```

如果你想在没有 shell 的环境下执行你的 `<command>`，你必须使用 JSON 数组的形式，然后给出可执行文件的完整路径。比如：
```Dockerfile
FROM ubuntu
CMD ["/usr/bin/wc","--help"]
```

如果你想容器每次都执行相同的可执行文件，你可以考虑使用 `ENTRYPOINT` 和 `CMD` 混合使用。参考 [ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint)。

如果用户指定了 `docker run` 的参数，那么会直接覆盖 `CMD`。

> 注意：<br />
不要混淆 RUN 和 CMD。RUN 是执行一个命令，然后提交结果；CMD 不会在构建阶段执行任何东西，只是为镜像指定了一个默认的命令。

# LABEL
```Dockerfile
LABEL <key>=<value> <key>=<value> <key>=<value> ...
```
LABEL 指令为镜像添加了元数据。一个 LABEL 是一个键值对。在 LABEL 中如果包含空格，需要使用双引号，如果有换行，需要使用反斜线。比如：
```Dockerfile
LABEL "com.example.vendor"="ACME Incorporated"
LABEL com.example.label-with-value="foo"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
```

镜像可以有多个 LABEL。你可以在一行中指定多个标签。比如：
```Dockerfile
LABEL multi.label1="value1" multi.label2="value2" other="value3"

LABEL multi.label1="value1" \
      multi.label2="value2" \
      other="value3"
```

标签在基础或者父镜像中，也会被其他镜像继承。存在子镜像覆盖父镜像中同名的标签。

为了查看一个镜像的标签，可以使用 `docker image inspect` 命令。可以使用 `--format` 选项来展示这些标签：
```bash
docker image inspect --format='' myimage
```
```text
{
  "com.example.vendor": "ACME Incorporated",
  "com.example.label-with-value": "foo",
  "version": "1.0",
  "description": "This text illustrates that label-values can span multiple lines.",
  "multi.label1": "value1",
  "multi.label2": "value2",
  "other": "value3"
}
```

# EXPOSE
```Dockerfile
EXPOSE <port> [<port>/<protocol>...]
```
EXPOSE 指令表达了容器在运行时监听的具体网络端口。你可以指定监听 TCP 或者 UDP，默认是 TCP。

EXPOSE 指令不会真实的发布端口。它作为文档类型在构建镜像的人和运行镜像的人直接运行。为了实际的发布端口，需要在运行容器时，使用 `docker run -p` 来发布监听，同时可以映射一个或多个端口。或者使用 `-P` 来发布所有暴露的端口（使用 EXPOSE 暴露的所有端口），并且把他们映射到高端口上。

EXPOSE 默认是 TCP。你也可以选择 UDP：
```Dockerfile
EXPOSE 80/udp
```
也能同时使用 TCP 和 UDP：
```Dockerfile
EXPOSE 80/tcp
EXPOSE 80/udp
```
在上面这个例子中，如果你用 `docker run -P`，端口会为 TCP、UDP 各打开一次。记住，`-P` 会使用临时的高端口号，因为每次执行时都可能不同。

不管 EXPOSE 如何设置，你都可以通过 `docker run -p` 来覆盖它们：
```Dockerfile
docker run -p 80:80/tcp -p 80:80/udp ...
```
在主机系统上设置端口重定向，可以使用 [`-P`](https://docs.docker.com/engine/reference/run/#expose-incoming-ports)。`docker network` 命令支持为容器间的交流创建网络，而不必需要暴露端口，因为容器连接到这个网络后可以通过任意端口与其他网络中的容器交流。更详细的信息可以查看 [network](https://docs.docker.com/engine/userguide/networking/)。

# ENV
```Dockerfile
ENV <key>=<value> ...
```
ENV 指令可以设置关键变量，设置 `<key>` 为 `<value>`。这个将会对接下来的构建阶段的指令产生影响。如果添加了双引号，则它会被删除，如果你没转义它们的话。举例：
```Dockerfile
ENV MY_NAME="John Doe"
ENV MY_DOG=Rex\ The\ Dog
ENV MY_CAT=fluffy
```
ENV 指令允许一次使用多个键值对，比如：
```Dockerfile
ENV MY_NAME="John Doe" MY_DOG=Rex\ The\ Dog \
    MY_CAT=fluffy
```

使用 ENV 设置的环境变量将会在该镜像创建的容器运行时一直存在。你可以用过 `docker inspect` 来查看这些值，也能够用 `docker run --env <key>=<value>`来覆盖。

环境变量持续性可能导致一些不符合预期的副作用，比如，设置 `ENV DEBIAN_FRONTEND=noninteractive` 来改变 `apt-get` 的行为，也许会混淆你的镜像的用户。

如果一个环境变量只是在构建的时候才需要，而不是在最终的镜像里，那么可以通过一个命令行来设置：
```Dockerfile
RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y ...
```

或者使用 ARG，这个也不会在最终的镜像中存在：
```Dockerfile
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y ...
```

> 替换的语法：<br />
ENV 也允许使用另一中语法： `ENV <key> <value>`，但这种方式不支持在一个 ENV 语句中写多个键值对。

# ADD
ADD 有两种形式：
```Dockerfile
ADD [--chown=<user>:<group>] <src>... <dest>
ADD [--chown=<user>:<group>] ["<src>",... "<dest>"]
```
当路径包含空格时，只能使用后一种形式。

> 注意：<br/>
`--chown` 只在构建 Linux 容器时生效，在 Windows 容器上不生效。

ADD 指令从 `<src>` 拷贝文件、目录或者远程文件，添加到镜像的 `<dist>` 目录下。

可以指定多个 `<src>` 源，但是如果他们是文件或者目录的话，他们会被解析为相对于构建环境的路径。

每一个 `<src>` 可以包含通配符，会使用 Go's filepath.Match 规则来匹配。

添加所有 hom 开头的文件：
```Dockerfile
ADD hom* /mydir/
```

下面的例子中，`?` 代表了任意一个单字符：
```Dockerfile
ADD hom?.txt /mydir/
```

`<dest>` 是一个绝对路径，或者是相对于 `WORKDIR` 的相对路径。下面的例子使用相对路径，添加 "test.txt" 到 `<WORKDIR>/relativeDir/`：
```Dockerfile
ADD test.txt relativeDir/
```
如果使用绝对路径的 `<dest>`，那么就是绝对路径，比如：`ADD test.txt /absoluteDir/`

同时可以解压一些归档文件。

# COPY
是 ADD 的子集。不能解压归档文件。

# ENTRYPOINT
ENTRYPOINT 有两种形式：
exec 模式，默认的：
```Dockerfile
ENTRYPOINT ["executable", "param1", "param2"]
```
shell 模式：
```Dockerfile
ENTRYPOINT command param1 param2
```
ENTRYPOINT 让你为容器配置一个可执行文件。
## exec 模式
## shell 模式
## CMD 与 ENTRYPOINT 交互

# VOLUME
`VOLUME ["/data"]`

VOLUME 指令创建一个具名的挂载点，会被外部宿主掌控。可以是 JSON 数组，或者直接字符串。

`docker run`命令会初始化最新创建的卷，比如：
```Dockerfile
FROM ubuntu
RUN mkdir /myvol
RUN echo "hello world" > /myvol/greeting
VOLUME /myvol
```
在执行 `docker run` 时会创建一个新的挂载点在 /myvol 上，并且会拷贝 `greeting` 到挂载点里。



# USER

```Dockerfile
USER <user>[:<group>]
# or
USER <UID>[:<GID>]
```
为接下来的执行指定用户。


# WORKDIR
为 RUN、CMD、ENTRYPOINT、COPY、ADD 设置工作目录。如果该目录不存在，会自动创建该目录。

如果存在多个 WORKDIR 目录，则下一个目录会基于上一个目录而来：
```Dockerfile
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
```
最后的输出是：/a/b/c

能够使用 ENV 中定义的环境变量。

# ARG
```Dockerfile
ARG <name>[=<default value>]
```
ARG 指令定义用户可以在构建阶段传递的变量，使用 `docker build --build-tab <varname>=<value>` 传递。如果使用了未定义的 arg 变量，会报错。

## 默认值
```Dockerfile
FROM busybox
ARG user1=someuser
ARG buildno=1
# ...
```
定义 args。如果有则用，如果无，则用上面的默认值。

## 作用域

# ONBUILD
```Dockerfile
ONBUILD <INSTRUCTION>
```
当将映像用作另一个构建的基础时，ONBUILD指令会在映像上添加一个触发指令，以便稍后执行。该触发器将在下游构建的上下文中执行，就像它已被插入到下游Dockerfile中的FROM指令之后一样。
任何构建指令都可以注册为触发器。



# HEALTHCHECK
有两种形式：
- `HEALTHCHECK [OPTIONS] CMD command` (通过在容器里执行一个命令来检查))
- `HEALTHCHECK NONE` (禁用从基础镜像里继承来的检查)

这些选项能在 CMD 之前出现：
- --interval=DURATION (default: 30s)
- --timeout=DURATION (default: 30s)
- --start-period=DURATION (default: 0s)
- --retries=N (default: 3)


