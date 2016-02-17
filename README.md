
# Workspace Browser

Just a KBase Dev Tool for browsing workspaces.  

## Website

N/A

## Local Installation

```
git clone --recursive https://github.com/kbase/workspace_browser.git
bower install
```

Notes:
- The `--recursive` installs some submodules in `lib/`
- `bower install` installs some third-party (client-side) dependencies

Then point your favorite web server at `workspace_browser`

### Production Build

For production, this step creates an `index.html` with concatenated/minimized CSS/JS files.

From `workspace_browser`:

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

Released under [the MIT license](https://github.com/kbase/workspace_browser).
