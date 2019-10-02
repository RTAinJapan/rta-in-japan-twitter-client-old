<?php
declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use PHPUnit\Framework\TestCase;

use mpyw\Cowitter\Client;
use Phpfastcache\CacheManager;
use Phpfastcache\Config\Config;
use yagamuu\TwitterClientForRtainjapan\Twitter;

class TwitterTest extends TestCase
{
    protected $client_builder;

    protected function setUp():void
    {
        CacheManager::setDefaultConfig(new Config([
            "path" => sys_get_temp_dir(),
            "itemDetailedDate" => false
          ]));

        $this->client_builder = $this->getMockBuilder(Client::class)->setConstructorArgs([[
            getenv('CONSUMER_KEY'),
            getenv('CONSUMER_SECRET'),
            getenv('ACCESS_TOKEN'),
            getenv('ACCESS_TOKEN_SECRET'),
        ]]);
    }

    public function testGetUserTimelineWithoutError():void
    {
        $user_timelines = ['tweet' => 'this is tweet'];
        $mock_client = $this->client_builder->setMethods(['get'])->getMock();
        $mock_client->expects($this->once())
                ->method('get')
                ->with(
                    $this->equalTo('statuses/user_timeline'),
                    $this->equalTo([
                        'screen_name' => getenv('SCREEN_NAME'),
                        'count'       => 10
                        ]
                    )
                )->willReturn($user_timelines);

        $cache = CacheManager::getInstance('files');
        $twitter = new Twitter($mock_client, $cache);

        $response_timelines = $twitter->getUserTimeline();

        $this->assertEquals([
            'errors' => [],
            'user_timelines' => $user_timelines
        ], $response_timelines);
    }

    public function testGetMentionsTimeline():void
    {
        $this->markTestIncomplete('WIP.');
    }

    public function testDeleteTweet():void
    {
        $this->markTestIncomplete('WIP.');
    }

    public function testPostTweet():void
    {
        $this->markTestIncomplete('WIP.');
    }
}
