{
    "targets": [
        {
            "target_name": "jonesum",
            "sources": ["src/addon.cc", "../src/jonesum.c"],
            "include_dirs": ["../src"],
            "conditions": [
                [
                    "OS!='win'",
                    {
                        "cflags": ["-Wall", "-Wextra", "-std=c99"],
                        "cflags_cc": ["-Wall", "-Wextra"],
                    },
                ]
            ],
        }
    ]
}
