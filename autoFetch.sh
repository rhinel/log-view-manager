#!/bin/bash

echo "--> 开始本地处理"

cd ~/gitcode/log-view-manager/

echo "--> fetch当前分支"
echo "--> $1"

git status

echo "--> git checkout $1"
git checkout $1

echo "--> git pull --all"

git pull --all
git fetch -p

echo "--> 更新生产版本依赖"

yarn

echo "--> 删除旧版本"

rm -rf ./build

echo "--> 解压新版本"

tar -jxf build.tar.bz2 -C ./

echo "--> cache clear"

rm -rf build.tar.bz2

echo "--> docker restart"

sh ./logviewmanager.sh

echo "--> 全部完成"
