
# Workspace Browser

KBase Web Application for browsing workspaces

## Website

http://workspaces.kbase.us

## Local Installation

```
git clone --recursive https://github.com/kbase/workspace-browser.git oxcart
bower install
```

Notes:
- The `--recursive` flag installs some submodules in `lib/`
- `bower install` installs some third-party (front-end) dependencies

Then point your favorite webserver at `oxcart`

### Build

This step creates an `index.html` with concatenated/minimized CSS/JS files (located in `build/`).

From `workspace-browser`:

```
npm install
grunt build
```

Notes:
- `npm install` installs grunt dependencies.
- `grunt build` does the build work


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Author(s)

Neal Conrad <nconrad@anl.gov>
& The [Kbase](https://kbase.us) Team

## License

Released under [the MIT license](https://github.com/nconrad/ng-browse).
