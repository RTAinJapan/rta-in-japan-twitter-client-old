<?php

namespace yagamuu\TwitterClientForRtainjapan;

use mpyw\Co\Co;

class Twitter
{
    protected $client;
    
    /** @var Cache */
    protected $cache;

    public function __construct($client, $cache)
    {
        $this->client = $client;
        $this->cache = $cache;
    }

    public function getUserTimeline()
    {
        $errors = [];
        $user_timelines = [];
        try {
            $user_timelines = $this->client->get('statuses/user_timeline', [
                'screen_name' => getenv('SCREEN_NAME'),
                'count'       => 10
            ]);
        } catch (\RuntimeException $e) {
            $errors[] = $e->getMessage();
        }

        return [
            'errors' => $errors,
            'user_timelines' => $user_timelines
        ];
    }

    public function getMentionsTimeline()
    {
        $errors = [];
        $mentions_timelines = [];
        try {
            $mentions_timelines = $this->client->get('statuses/mentions_timeline', [
                'count'       => 10
            ]);
        } catch (\RuntimeException $e) {
            $errors[] = $e->getMessage();
        }

        return [
            'errors' => $errors,
            'mentions_timelines' => $mentions_timelines
        ];
    }

    public function deleteTweet($id)
    {
        $errors = [];
        $informations = [];

        try {
            $status = $this->client->post('statuses/destroy', [
                'id' => $id
            ]);
            $informations[] = [
                'text' => '削除しました',
                'url' => self::getTweetUrl($status),
            ];

            // キャッシュの更新
            $user_timelines_cache = $this->cache->getItem("user_timelines");
            $user_timelines_cache->set($this->getUserTimeline())->expiresAfter(60);
            $this->cache->save($user_timelines_cache);
        } catch (\RuntimeException $e) {
            $errors[] = $e->getMessage();
        }

        return [
            'errors' => $errors,
            'informations' => $informations
        ];
    }

    public function postTweet($tweet_text, $files)
    {
        $result = [
            'errors' => [],
            'informations'  => [],
        ];
        $uploads = [];

        // 各ファイルをチェック
        $videoOrAnimeGifFlag = false;
        foreach ($files['media']['error'] as $key => $error) {
            try {
                // 更に配列がネストしていれば不正とする
                if (!is_int($error)) {
                    throw new \RuntimeException("[{$key}] パラメータが不正です");
                }

                // 値を確認
                switch ($error) {
                    case UPLOAD_ERR_OK: // OK
                        $file = $files['media']['tmp_name'][$key];
                        $uploads[] = $file;
                        if (self::isVideoFile($file) || self::isAnimeGif($file)) {
                            $videoOrAnimeGifFlag = true;
                        }
                        break;
                    case UPLOAD_ERR_NO_FILE:   // ファイル未選択
                        continue 2;
                    case UPLOAD_ERR_INI_SIZE:  // php.ini定義の最大サイズ超過
                    case UPLOAD_ERR_FORM_SIZE: // フォーム定義の最大サイズ超過
                        throw new \RuntimeException("[{$key}] ファイルサイズが大きすぎます");
                    default:
                        throw new \RuntimeException("[{$key}] その他のエラーが発生しました");
                }

                if ($videoOrAnimeGifFlag && count($uploads) > 1) {
                    throw new \RuntimeException("動画やアニメgifを含む場合は1つだけアップロードしてください");
                }
            } catch (\RuntimeException $e) {
                $result['errors'][] = $e->getMessage();
            }
        }
        if (count($result['errors'])) {
            return $result;
        }

        if (count($uploads)) {
            $result = $this->tweetMedia($tweet_text, $uploads, $videoOrAnimeGifFlag);
        } elseif (isset($tweet_text) && $tweet_text !== '') {
            $result = $this->tweetText($tweet_text);
        }

        // キャッシュの更新
        $user_timelines_cache = $this->cache->getItem("user_timelines");
        $user_timelines_cache->set($this->getUserTimeline())->expiresAfter(60);
        $this->cache->save($user_timelines_cache);

        return $result;
    }

    private function tweetText($text)
    {
        $errors = [];
        $informations = [];
        try {
            $status = $this->client->post('statuses/update', [
                'status' => $text,
            ]);
        
            $informations[] = [
                'text' => '投稿しました',
                'url' => self::getTweetUrl($status),
            ];
        } catch (\RuntimeException $e) {
            $errors[] = $e->getMessage();
        }

        return [
            'errors' => $errors,
            'informations'  => $informations
        ];
    }

    private function tweetMedia($text, $files, $isVideo = false)
    {
        $errors = [];
        $informations  = [];

        try {
            $informations = Co::wait(function () use ($informations, $text, $files, $isVideo) {
                $status = [];
                $media_ids = [];
                // 通常の画像
                if (!$isVideo) {
                    $upload = [];
                    foreach ($files as $file) {
                        $upload[] = $this->client->postMultipartAsync(
                            'media/upload',
                            [
                                'media' => new \CURLFile($file)
                            ]
                        );
                    }
                    $info = yield $upload;
                    $media_ids = implode(',', array_column($info, 'media_id_string'));
                } else {
                    $file = $files[0];
                    $video = new \SplFileObject($file, 'rb');
                    $method = self::isVideoFile($file) ? 'uploadVideoAsync' : 'uploadAnimeGifAsync';
                    $media_ids = (yield $this->client->$method($video))->media_id_string;
                }

                $status = yield $this->client->postAsync('statuses/update', [
                    'status' => $text ?? '',
                    'media_ids' => $media_ids,
                ]);
                $informations[] = [
                    'text' => '投稿しました',
                    'url' => self::getTweetUrl($status),
                ];

                return $informations;
            });
        } catch (\RuntimeException $e) {
            $errors[] = $e->getMessage();
        }

        return [
            'errors'      => $errors,
            'informations' => $informations
        ];
    }

    private static function getTweetUrl($status)
    {
        return 'https://twitter.com/'
        . $status->user->screen_name
        . '/status/'
        . $status->id_str;
    }

    private static function isVideoFile($file)
    {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file);
        finfo_close($finfo);
        return in_array($mime_type, ['video/mp4', 'video/quicktime', 'video/x-m4v'], true);
    }

    private static function isAnimeGif($file)
    {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $file);
        finfo_close($finfo);
        if ($mime_type !== 'image/gif') {
            return false;
        }

        $imagick = new \Imagick();
        $imagick->readImage($file);
        $image_frames = $imagick->getNumberImages();
        $imagick->clear();

        return $image_frames > 1;
    }
}
