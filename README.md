# RTA in Japan Twitter Client

## 概要
ツイート投稿、ツイートの削除、メンションの確認に機能を絞ったWebサーバー上で動作するTwitterクライアントです。
[RTA in Japan](https://rtain.jp "RTA in Japan")というイベントで、ボランティアスタッフが運営スタッフの代わりにTwitter投稿を行う目的で開発されました。

## 使い方
1. Twitterアプリケーションを作成する(詳細な方法は各種サイト参照)
1. 以下を用意したサーバーを用意する
    * PHP^7.2
    * Imagick
1. .ENVファイルを作成し、以下の内容で作成する
    ```.env
    CONSUMER_KEY = "TwitterアプリケーションのConsumer Key"
    CONSUMER_SECRET = "TwitterアプリケーションのConsumer Secret"
    ACCESS_TOKEN = "TwitterアプリケーションのAccess Token"
    ACCESS_TOKEN_SECRET = "TwitterアプリケーションのAccess Token Secret"
    SCREEN_NAME = "利用するツイッターのID"
    ```
1. `php composer install`を実行

## TODO
1. DiscordOAuthを利用した認証機能の実装
1. Discord+Webhookでツイートした内容の通知の実装
1. babel,webpack等のエコシステムの設備
1. 型付けの導入(PHP:タイプヒンティング、JS:TypeScript)
1. PHPUnitの導入

## スペシャルサンクス
ぱすた([@pasta04](https://twitter.com/pasta04 "twitter"))さん:JavaScriptの機能追加、リファクタ