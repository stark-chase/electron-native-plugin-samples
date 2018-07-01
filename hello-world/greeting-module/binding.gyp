{
  "targets": [
    {
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
      "target_name": "greeting",
      "sources": [ "greeting.cpp" ]
    }
  ]
}