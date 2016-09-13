Let's you organize media by:

- Prefixing all files in current folder
- Playing file, one by one
- Extracting parts of media, both audio and video, to separate sub folders
- Adding categories to file name
- Adding actors/actresses to file name (called performer names)
- Bulk moving media files when complete
- Cleaning up source by deleting non-moved files when complete

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
                "destination": "audio",
                "type": "audio"
            },
            {
                "destination": "scenes",
                "type": "video"
            }
        ]
    }
