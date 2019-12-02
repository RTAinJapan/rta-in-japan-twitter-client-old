<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use PHPUnit\Framework\TestCase;

use mpyw\Cowitter\Client;
use Phpfastcache\CacheManager;
use Phpfastcache\Config\Config;
use yagamuu\TwitterClientForRtainjapan\Twitter;
use yagamuu\TwitterClientForRtainjapan\Tests\CacheManagerProvider;
use yagamuu\TwitterClientForRtainjapan\Tests\Examples;

class TwitterTest extends TestCase
{

    /** @var PHPUnit\Framework\MockObject\MockBuilder */
    protected $client_builder;

    /** @var Phpfastcache\CacheManager */
    protected $cache;

    protected function setUp():void
    {
        $this->client_builder = $this->getMockBuilder(Client::class)->setConstructorArgs([[
            'consumer key',
            'consumer secret',
            'access token',
            'access token secret',
        ]]);

        CacheManager::setDefaultConfig(new Config([
            "path" => sys_get_temp_dir(),
            "itemDetailedDate" => false
          ]));

        $this->cache = CacheManagerProvider::getCacheManager();
    }

    public function testGetUserTimeline():void
    {
        $api_response = Examples\GetStatusesUserTimelines::example();
        $mock_client = $this->client_builder->setMethods(['get'])->getMock();
        $mock_client->expects($this->once())
                ->method('get')
                ->with(
                    $this->equalTo('statuses/user_timeline'),
                    $this->equalTo(
                        [
                            'screen_name' => getenv('SCREEN_NAME'),
                            'count'       => 10
                        ]
                    )
                )->willReturn($api_response);

        $twitter = new Twitter($mock_client, $this->cache);

        $actual_timelines = $twitter->getUserTimeline();

        $this->assertEquals([
            'errors' => [],
            'user_timelines' => $api_response
        ], $actual_timelines);
    }

    public function testCatchRuntimeExceptionOnGetUserTimeline():void
    {
        $excepted_message = 'Error happened!!';
        $mock_client = $this->client_builder->setMethods(['get'])->getMock();
        $mock_client->expects($this->once())
                ->method('get')
                ->with(
                    $this->equalTo('statuses/user_timeline'),
                    $this->equalTo(
                        [
                            'screen_name' => getenv('SCREEN_NAME'),
                            'count'       => 10
                        ]
                    )
                )->willThrowException(new \RuntimeException($excepted_message));
                
        $twitter = new Twitter($mock_client, $this->cache);

        $actual_timelines = $twitter->getUserTimeline();

        $this->assertEquals([
            'errors' => [$excepted_message],
            'user_timelines' => []
        ], $actual_timelines);
    }

    public function testGetMentionsTimeline():void
    {
        $api_response = Examples\GetStatusesMentionTimelines::example();
        $mock_client = $this->client_builder->setMethods(['get'])->getMock();
        $mock_client->expects($this->once())
                ->method('get')
                ->with(
                    $this->equalTo('statuses/mentions_timeline'),
                    $this->equalTo(['count' => 10])
                )->willReturn($api_response);

        $twitter = new Twitter($mock_client, $this->cache);

        $actual_timelines = $twitter->getMentionsTimeline();

        $this->assertEquals([
            'errors' => [],
            'mentions_timelines' => $api_response
        ], $actual_timelines);
    }

    public function testCatchRuntimeExceptionOnGetMentionsTimeline():void
    {
        $excepted_message = 'Error happened!!';
        $mock_client = $this->client_builder->setMethods(['get'])->getMock();
        $mock_client->expects($this->once())
                ->method('get')
                ->with(
                    $this->equalTo('statuses/mentions_timeline'),
                    $this->equalTo(['count' => 10])
                )->willThrowException(new \RuntimeException($excepted_message));
                
        $twitter = new Twitter($mock_client, $this->cache);

        $actual_timelines = $twitter->getMentionsTimeline();

        $this->assertEquals([
            'errors' => [$excepted_message],
            'mentions_timelines' => []
        ], $actual_timelines);
    }

    public function testDeleteTweet():void
    {
        $tweet_id = 123456;
        $api_response = Examples\PostStatusesDestroy::example();
        $mock_client = $this->client_builder->setMethods(['post'])->getMock();
        $mock_client->expects($this->once())
                ->method('post')
                ->with(
                    $this->equalTo('statuses/destroy'),
                    $this->equalTo(['id' => $tweet_id])
                )->willReturn($api_response);

        $twitter = new Twitter($mock_client, $this->cache);

        $response = $twitter->deleteTweet($tweet_id);

        $this->assertEquals([
            'errors' => [],
            'informations' => [
                [
                    'text' => '削除しました',
                    'url' => 'https://twitter.com/'. $api_response->user->screen_name. '/status/'. $api_response->id_str
                ]
            ]
        ], $response);
    }

    public function testCatchRuntimeExceptionOnDeleteTweet():void
    {
        $tweet_id = 123456;
        $excepted_message = 'Error happened!!';
        $mock_client = $this->client_builder->setMethods(['post'])->getMock();
        $mock_client->expects($this->once())
                ->method('post')
                ->with(
                    $this->equalTo('statuses/destroy'),
                    $this->equalTo(['id' => $tweet_id])
                )->willThrowException(new \RuntimeException($excepted_message));
                
        $twitter = new Twitter($mock_client, $this->cache);

        $response = $twitter->deleteTweet($tweet_id);

        $this->assertEquals([
            'errors' => [$excepted_message],
            'informations' => []
        ], $response);
    }

    public function testPostTweetNoMedia():void
    {
        $api_response = Examples\PostStatusesUpdate::example();
        $mock_client = $this->client_builder->setMethods(['post'])->getMock();
        $mock_client->expects($this->once())
                ->method('post')
                ->with(
                    $this->equalTo('statuses/update'),
                    $this->equalTo(['status' => 'Hello, Twitter!'])
                )->willReturn($api_response);
                        
        $twitter = new Twitter($mock_client, $this->cache);
        $files_no_content = [
            'name' => [''],
            'type' => [''],
            'size' => [0],
            'tmp_name' => [''],
            'error' => [UPLOAD_ERR_NO_FILE]
        ];

        $response = $twitter->postTweet('Hello, Twitter!', [
            'media' => $files_no_content
        ]);

        $this->assertEquals([
            'errors' => [],
            'informations' => [
                [
                    'text' => '投稿しました',
                    'url' => 'https://twitter.com/'. $api_response->user->screen_name. '/status/'. $api_response->id_str
                ]
            ]
        ], $response);
    }

    public function testPostTweetWithMedias():void
    {
        $files = [
            'name' => ['picture.png'],
            'type' => ['image/png'],
            'size' => [2048000],
            'tmp_name' => [
                __DIR__ . '/media/tmp-img.png'
            ],
            'error' => [UPLOAD_ERR_OK]
        ];

        $tweet_api_response = Examples\PostStatusesUpdate::example();
        $media_api_responses = [
            Examples\PostMediaUpload::example()
        ];
        $media_api_responses[0]->media_id = 1;
        $media_api_responses[0]->media_id_string = '1';

        $mock_client = $this->client_builder->setMethods(['postAsync', 'postMultipartAsync'])->getMock();

        $mock_client->expects($this->exactly(1))
                ->method('postMultipartAsync')
                ->withConsecutive(
                    [
                        $this->equalTo('media/upload'),
                        $this->equalTo(['media' => new \CURLFile($files['tmp_name'][0])])
                    ]
                )->willReturn($media_api_responses[0]);

        $mock_client->expects($this->any())
                ->method('postAsync')
                ->withConsecutive([
                    $this->equalTo('statuses/update'),
                    $this->equalTo(['status' => 'Hello, Twitter!', 'media_ids' => '1'])])
                ->willReturn($tweet_api_response);
                
        $twitter = new Twitter($mock_client, $this->cache);

        $response = $twitter->postTweet('Hello, Twitter!', [
            'media' => $files
        ]);

        $this->assertEquals([
            'errors' => [],
            'informations' => [
                [
                    'text' => '投稿しました',
                    'url' => 'https://twitter.com/'. $tweet_api_response->user->screen_name. '/status/'. $tweet_api_response->id_str
                ]
            ]
        ], $response);
    }

    /** @dataProvider invalidFileProvider */
    public function testCatchRuntimeExceptionOnPostTweet($files):void
    {
        
        $mock_client = $this->client_builder->getMock();
        $twitter = new Twitter($mock_client, $this->cache);

        $result = $twitter->postTweet('Hello, Twitter!', [
            'media' => $files
        ]);

        $this->assertArrayHasKey('errors', $result);
    }

    public function invalidFileProvider()
    {
        return [
            [
                [
                    'name' => ['picture.png'],
                    'type' => ['image/png'],
                    'size' => [2048000],
                    'tmp_name' => [
                        __DIR__ . '/media/tmp-img.png'
                    ],
                    'error' => [UPLOAD_ERR_INI_SIZE]
                ]
            ],
            [
                [
                    'name' => ['picture.png'],
                    'type' => ['image/png'],
                    'size' => [2048000],
                    'tmp_name' => [
                        __DIR__ . '/media/tmp-img.png'
                    ],
                    'error' => [UPLOAD_ERR_FORM_SIZE]
                ]
            ],
            [
                [
                    'name' => ['picture.png'],
                    'type' => ['image/png'],
                    'size' => [2048000],
                    'tmp_name' => [
                        __DIR__ . '/media/tmp-img.png'
                    ],
                    'error' => [99]
                ]
            ]
        ];
    }
}
