
[![Build Status](https://travis-ci.org/kmkr/mediamanage.svg?branch=master)](https://travis-ci.org/kmkr/mediamanage.svg?branch=master)

Let's you organize media. Made to more easily organize videos split in multiple files (e.g. videos with distinct scenes). That means getting from here in this fictional example for a film about surfing:

    /media/temp/downloads
    └── surfing-rocks[2016]-something-anotherthing-(fetched-from-that-place)
        ├── some-cover-i-dont-care-about.jpg
        ├── 102334_01.mp4
        ├── 102334_02.mp4
        └── 102334_03.mp4

... to here:

    /media/videos/surfing
    ├── surfing.rocks_some.surfer.guy_[bigwaves][australia].mp4
    ├── surfing.rocks_some.surfer.guy_another.surfer.guy_[northpole].mp4
    └── surfing.rocks_surfer.girl_[another-category].mp4

    /media/clips/my-favorite-big-wave-clips
    └── surfing.rocks_some.surfer.guy_[bigwaves][australia].mp4

    /media/audio/wave-sounds
    └── surfing.rocks_surfer.girl_[another-category].mp3

Setting title, categories and actor/actress/performers are all optional. So is extracting audio and clips. You can decide what to set and what to skip.


Mediamanage supports the following operations.

- Set video name to all files in currect directory.
- Play videos via customized media player to observe what you're organizing.
- Extract parts of media - both audio and video.
- Set categories for each file (e.g. drama, action, wing-suit, australia, mountains, rivers or whatever). Will be set in file title as shown above.
- Set actors/actresses/performer names for each file. Will be set in file title as shown above.
- Autocompletion when setting performer names.
- Touching files in a directory with the same name as the first video file in the current directory. Handy to build up a blacklist of files to indicate that you should never download this video again.
- Bulk moving media files (including extracted media) from current directory.
- Cleaning up source by deleting non-moved files (such as screenshots, covers and unwanted files) after moving media.

## Server

todo: write content

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
        "autocomplete": {
            "performerNames": [
                "winnie.the.pooh", "piglet"
            ]
        },
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
            },
            {
                "toDir": "/tmp/some-folder-for-moving-single-files",
                "type": "video"
            }
        ],
        "mediaPlayer": {
            "remote": "10.45.12.42:2000"
        },
        "nodownload": {
            "path": "/tmp/nodl",
            "reasons": [
                "boring",
                "dull"
            ]
        }
    }

### moveMediaOptions

Iterated when using "Move media". Files from the `fromDir` are moved to `toDir`. `fromDir` is optional and used only when moving all files. So if you need a move-to target used for moving single files only, just skip `fromDir`.
