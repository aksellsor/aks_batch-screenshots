<img src="./aksell-logo-dynamic.svg" width="100px"/>

# Aksell screenshot grabber

## How to

1. Add urls to [urls.txt](/urls.txt) <span style="color: grey; font-size: smaller;">(one per line)</span>
2. Add custom css to [custom.css](/custom.css) <span style="color: grey; font-size: smaller;">(e.g. to hide cookie consent box)</span>
3. Run script:

```js
yarn dev
// or
npm run dev
```

4. Get images from [/screens](/screens/) folders

## Additional configuration in [config.js](/config.js)

| Constant                      | Value  | Type      | Description                                                                            |
| ----------------------------- | ------ | --------- | -------------------------------------------------------------------------------------- |
| `WAIT_FOR`                    | 1000   | `number`  | General wait time                                                                      |
| `WAIT_FOR_LAZYLOADED_CONTENT` | `true` | `boolean` | Waiti for lazy-loaded content (will take longer)                                       |
| `DELAY_BETWEEN_SCROLL`        | 100    | `number`  | Delay (ms) before each scroll                                                          |
| `VIEWPORT_WIDTH`              | 1920   | `number`  | Width of the viewport                                                                  |
| `VIEWPORT_HEIGHT`             | 1080   | `number`  | Height of the viewport                                                                 |
| `REMOVE_POSITION_FIXED`       | `true` | `boolean` | Change all position fixed elements to absolute (to remove stuck elements on scrolling) |
