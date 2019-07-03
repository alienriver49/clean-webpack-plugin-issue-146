# clean-webpack-plugin-issue-146
Repository demonstrating clean-webpack-plugin issue #146.

# How to Reproduce
Initial setup:
```sh
$ npm install
```

Run the first build:
```sh
$ npm run build
```

Open Windows Explorer and navigate into dist/release to see the build assets. Keep this Windows Explorer open.

Repeat the build command until it hits the error `Error: EPERM: operation not permitted, mkdir 'C:\Workspace\Github\clean-webpack-plugin-issue-146\dist\release\js'`:
```sh
$ npm run build
```

The Windows Explorer instance will either show a popup with an error since the folder will no longer exist or have been redirected to the root of the repository.