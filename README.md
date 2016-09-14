https://travis-ci.org/kmkr/mediamanage.svg?branch=master

Let's you organize media. Made to more easily organize movies split in multiple files.

Mediamanage supports the following operations.

Let's you:

- Set movie name to all files in currect directory.
- Play movies via customized media player.
- Extract parts of media - both audio and video.
- Set categories for each file (e.g. drama, action). Will be set in file title.
- Set actors/actresses (called performer names) for each file. Will be set in file title.
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
            "action",
            "drama",
            "thriller"
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

