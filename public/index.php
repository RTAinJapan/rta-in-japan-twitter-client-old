<?php

require_once __DIR__ . '/../vendor/autoload.php';

use mpyw\Cowitter\Client;
use yagamuu\TwitterClientForRtainjapan\Twitter;
use Phpfastcache\CacheManager;
use Phpfastcache\Config\Config;

session_start();
date_default_timezone_set('Asia/Tokyo');
$basedir = __DIR__ . '/../';

$dotenv = \Dotenv\Dotenv::create($basedir);
$dotenv->overload();
$dotenv->required([
    'CONSUMER_KEY',
    'CONSUMER_SECRET',
    'ACCESS_TOKEN',
    'ACCESS_TOKEN_SECRET',
    'SCREEN_NAME',
])->notEmpty();

$client = new Client([
    getenv('CONSUMER_KEY'),
    getenv('CONSUMER_SECRET'),
    getenv('ACCESS_TOKEN'),
    getenv('ACCESS_TOKEN_SECRET'),
]);

CacheManager::setDefaultConfig(new Config([
    "path" => sys_get_temp_dir(),
    "itemDetailedDate" => false
  ]));
$cache = CacheManager::getInstance('files');

$twitter = new Twitter($client, $cache);

$view = [
    'errors' => [],
    'infomations' => [],
    'user_timelines' => [],
    'mentions_timelines' => [],
];

if (isset($_POST["delete"]) && $_POST["delete"] !== '') {
    $view = array_merge_recursive($view, $twitter->deleteTweet($_POST["delete"]));
} elseif (isset($_FILES['media']['error']) && is_array($_FILES['media']['error'])) {
    // 投稿
    $view = array_merge_recursive($view, $twitter->postTweet());
}

// タイムライン取得
$user_timelines_cache = $cache->getItem("user_timelines");
if (is_null($result = $user_timelines_cache->get())) {
    $result = $twitter->getUserTimeline();
    $user_timelines_cache->set($result)->expiresAfter(60);
    $cache->save($user_timelines_cache);
}
$view = array_merge_recursive($view, $result);

// メンション取得
$mentions_timelines_cache = $cache->getItem("mentions_timelines");
if (is_null($result = $mentions_timelines_cache->get())) {
    $result = $twitter->getMentionsTimeline();
    $mentions_timelines_cache->set($result)->expiresAfter(60);
    $cache->save($mentions_timelines_cache);
}
$view = array_merge_recursive($view, $result);

$token = md5(uniqid(rand(), true));
$_SESSION['token'] = $token;
$view['token'] = $token;

$loader  = new \Twig_Loader_Filesystem($basedir . '/src/view/template');
$twig    = new \Twig_Environment($loader, [
    'cache' => $basedir . '/cache/twig',
    'debug' => true,
]);

$content = $twig->render('index.tpl.html', $view);

header('Content-Type: text/html; charset=utf-8');
header('Content-Length: ' . strlen($content));
echo $content;
