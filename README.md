
[![Build Status](https://travis-ci.org/kmkr/mediamanage.svg?branch=master)](https://travis-ci.org/kmkr/mediamanage.svg?branch=master)

Let's you organize media. Made to more easily organize videos split in multiple files (e.g. videos with distinct scenes). That means getting from here:

    downloads
    └── surfing-rocks[2016]-something-anotherthing-(fetched-from-that-place)
        ├── 102334_01.mp4
        ├── 102334_02.mp4
        └── 102334_03.mp4
        
To here:

    my-videos
    ├── surfing.rocks_some.surfer.guy_[bigwaves][australia].mp4
    ├── foo.bar.video_some.surfer.guy_another.surfer.guy_[northpole].mp4
    └── foo-bar-video_surfer.girl_[another-category].mp4
    

Mediamanage supports the following operations.

- Set movie name to all files in currect directory.
- Play movies via customized media player to see what you're organizing.
- Extract parts of media - both audio and video.
- Set categories for each file (e.g. drama, action, wing-suit, australia, mountains, rivers or whatever). Will be set in file title as shown above.
- Set actors/actresses (called performer names) for each file. Will be set in file title as shown above.
- Bulk moving media files (including extracted media) from current directory.
- Cleaning up source by deleting non-moved files (such as screenshots, covers and unwanted files) after moving media.

## Server

    {
        "port": 2000,
        "player": "/usr/bin/smplayer",
        "mappings": [
            {
                "source": ".*remote-path-regexp",
                "destination": "/home/you/my-mount/"
            }
        ]
    }

## Client

    {
        "categories": [
            "big-waves",
            "drama",
            "thriller",
            "australia",
            "diving",
            "surfing"
        ],
        "extractOptions": [
            {
                "commandKey": "a",
                "destination": "audio",
                "type": "audio"
            },
            {
                "commandKey": "s",
                "destination": "scenes",
                "type": "video"
            }
        ],
        "moveMediaOptions": [
            {
                "fromDir": ".",
                "toDir": "/tmp/videos",
                "type": "video"
            },
            {
                "fromDir": "audio",
                "toDir": "/tmp/audio",
                "type": "audio"
            },
            {
                "fromDir": "scenes",
                "toDir": "/tmp/scenes",
                "type": "video"
            }
        ]
    }

