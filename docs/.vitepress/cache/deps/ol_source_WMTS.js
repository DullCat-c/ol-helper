import {
  TileGrid_default,
  createFromCapabilitiesMatrixSet,
  fromKey,
  getKey,
  getKeyZXY,
  hash,
  withinExtentAndZ
} from "./chunk-WDTGZPT2.js";
import {
  ImageTile_default,
  Tile_default
} from "./chunk-BINFMVK3.js";
import "./chunk-AO2OB2DX.js";
import {
  TileState_default
} from "./chunk-MWRVHJ74.js";
import {
  Source_default
} from "./chunk-6ANS2NUY.js";
import "./chunk-A6YDOYBA.js";
import "./chunk-6PAILOU5.js";
import "./chunk-NVFGTVMU.js";
import {
  scale,
  toSize
} from "./chunk-CQP24QGV.js";
import "./chunk-Q26FE66X.js";
import {
  DEFAULT_MAX_ZOOM,
  DEFAULT_TILE_SIZE
} from "./chunk-3DLDMU67.js";
import "./chunk-KNNJB5RX.js";
import "./chunk-YALGIKYB.js";
import {
  Event_default,
  abstract,
  getUid
} from "./chunk-O2O47H2N.js";
import {
  EventType_default
} from "./chunk-HMZTZZXN.js";
import "./chunk-NKF6WDCB.js";
import {
  METERS_PER_UNIT,
  equivalent,
  get,
  transformExtent
} from "./chunk-HYOVTV2F.js";
import {
  modulo
} from "./chunk-4C4TSVB7.js";
import {
  containsCoordinate,
  containsExtent,
  createOrUpdate,
  getCorner,
  getHeight,
  getWidth
} from "./chunk-OYNMEVDB.js";
import {
  assert
} from "./chunk-GGLGE6AO.js";

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/structs/LRUCache.js
var LRUCache = class {
  /**
   * @param {number} [highWaterMark] High water mark.
   */
  constructor(highWaterMark) {
    this.highWaterMark = highWaterMark !== void 0 ? highWaterMark : 2048;
    this.count_ = 0;
    this.entries_ = {};
    this.oldest_ = null;
    this.newest_ = null;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
  }
  /**
   * Expire the cache.
   * @param {!Object<string, boolean>} [keep] Keys to keep. To be implemented by subclasses.
   */
  expireCache(keep) {
    while (this.canExpireCache()) {
      this.pop();
    }
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.count_ = 0;
    this.entries_ = {};
    this.oldest_ = null;
    this.newest_ = null;
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Contains key.
   */
  containsKey(key) {
    return this.entries_.hasOwnProperty(key);
  }
  /**
   * @param {function(T, string, LRUCache<T>): ?} f The function
   *     to call for every entry from the oldest to the newer. This function takes
   *     3 arguments (the entry value, the entry key and the LRUCache object).
   *     The return value is ignored.
   */
  forEach(f) {
    let entry = this.oldest_;
    while (entry) {
      f(entry.value_, entry.key_, this);
      entry = entry.newer;
    }
  }
  /**
   * @param {string} key Key.
   * @param {*} [options] Options (reserved for subclasses).
   * @return {T} Value.
   */
  get(key, options) {
    const entry = this.entries_[key];
    assert(entry !== void 0, 15);
    if (entry === this.newest_) {
      return entry.value_;
    }
    if (entry === this.oldest_) {
      this.oldest_ = /** @type {Entry} */
      this.oldest_.newer;
      this.oldest_.older = null;
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
    entry.newer = null;
    entry.older = this.newest_;
    this.newest_.newer = entry;
    this.newest_ = entry;
    return entry.value_;
  }
  /**
   * Remove an entry from the cache.
   * @param {string} key The entry key.
   * @return {T} The removed entry.
   */
  remove(key) {
    const entry = this.entries_[key];
    assert(entry !== void 0, 15);
    if (entry === this.newest_) {
      this.newest_ = /** @type {Entry} */
      entry.older;
      if (this.newest_) {
        this.newest_.newer = null;
      }
    } else if (entry === this.oldest_) {
      this.oldest_ = /** @type {Entry} */
      entry.newer;
      if (this.oldest_) {
        this.oldest_.older = null;
      }
    } else {
      entry.newer.older = entry.older;
      entry.older.newer = entry.newer;
    }
    delete this.entries_[key];
    --this.count_;
    return entry.value_;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.count_;
  }
  /**
   * @return {Array<string>} Keys.
   */
  getKeys() {
    const keys = new Array(this.count_);
    let i = 0;
    let entry;
    for (entry = this.newest_; entry; entry = entry.older) {
      keys[i++] = entry.key_;
    }
    return keys;
  }
  /**
   * @return {Array<T>} Values.
   */
  getValues() {
    const values = new Array(this.count_);
    let i = 0;
    let entry;
    for (entry = this.newest_; entry; entry = entry.older) {
      values[i++] = entry.value_;
    }
    return values;
  }
  /**
   * @return {T} Last value.
   */
  peekLast() {
    return this.oldest_.value_;
  }
  /**
   * @return {string} Last key.
   */
  peekLastKey() {
    return this.oldest_.key_;
  }
  /**
   * Get the key of the newest item in the cache.  Throws if the cache is empty.
   * @return {string} The newest key.
   */
  peekFirstKey() {
    return this.newest_.key_;
  }
  /**
   * Return an entry without updating least recently used time.
   * @param {string} key Key.
   * @return {T} Value.
   */
  peek(key) {
    if (!this.containsKey(key)) {
      return void 0;
    }
    return this.entries_[key].value_;
  }
  /**
   * @return {T} value Value.
   */
  pop() {
    const entry = this.oldest_;
    delete this.entries_[entry.key_];
    if (entry.newer) {
      entry.newer.older = null;
    }
    this.oldest_ = /** @type {Entry} */
    entry.newer;
    if (!this.oldest_) {
      this.newest_ = null;
    }
    --this.count_;
    return entry.value_;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  replace(key, value) {
    this.get(key);
    this.entries_[key].value_ = value;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  set(key, value) {
    assert(!(key in this.entries_), 16);
    const entry = {
      key_: key,
      newer: null,
      older: this.newest_,
      value_: value
    };
    if (!this.newest_) {
      this.oldest_ = entry;
    } else {
      this.newest_.newer = entry;
    }
    this.newest_ = entry;
    this.entries_[key] = entry;
    ++this.count_;
  }
  /**
   * Set a maximum number of entries for the cache.
   * @param {number} size Cache size.
   * @api
   */
  setSize(size) {
    this.highWaterMark = size;
  }
};
var LRUCache_default = LRUCache;

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/TileCache.js
var TileCache = class extends LRUCache_default {
  clear() {
    while (this.getCount() > 0) {
      this.pop().release();
    }
    super.clear();
  }
  /**
   * @param {!Object<string, boolean>} usedTiles Used tiles.
   */
  expireCache(usedTiles) {
    while (this.canExpireCache()) {
      const tile = this.peekLast();
      if (tile.getKey() in usedTiles) {
        break;
      } else {
        this.pop().release();
      }
    }
  }
  /**
   * Prune all tiles from the cache that don't have the same z as the newest tile.
   */
  pruneExceptNewestZ() {
    if (this.getCount() === 0) {
      return;
    }
    const key = this.peekFirstKey();
    const tileCoord = fromKey(key);
    const z = tileCoord[0];
    this.forEach((tile) => {
      if (tile.tileCoord[0] !== z) {
        this.remove(getKey(tile.tileCoord));
        tile.release();
      }
    });
  }
};
var TileCache_default = TileCache;

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/source/TileEventType.js
var TileEventType_default = {
  /**
   * Triggered when a tile starts loading.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadstart
   * @api
   */
  TILELOADSTART: "tileloadstart",
  /**
   * Triggered when a tile finishes loading, either when its data is loaded,
   * or when loading was aborted because the tile is no longer needed.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadend
   * @api
   */
  TILELOADEND: "tileloadend",
  /**
   * Triggered if tile loading results in an error. Note that this is not the
   * right place to re-fetch tiles. See {@link module:ol/ImageTile~ImageTile#load}
   * for details.
   * @event module:ol/source/Tile.TileSourceEvent#tileloaderror
   * @api
   */
  TILELOADERROR: "tileloaderror"
};

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/tilegrid.js
function getForProjection(projection) {
  let tileGrid = projection.getDefaultTileGrid();
  if (!tileGrid) {
    tileGrid = createForProjection(projection);
    projection.setDefaultTileGrid(tileGrid);
  }
  return tileGrid;
}
function wrapX(tileGrid, tileCoord, projection) {
  const z = tileCoord[0];
  const center = tileGrid.getTileCoordCenter(tileCoord);
  const projectionExtent = extentFromProjection(projection);
  if (!containsCoordinate(projectionExtent, center)) {
    const worldWidth = getWidth(projectionExtent);
    const worldsAway = Math.ceil(
      (projectionExtent[0] - center[0]) / worldWidth
    );
    center[0] += worldWidth * worldsAway;
    return tileGrid.getTileCoordForCoordAndZ(center, z);
  }
  return tileCoord;
}
function createForExtent(extent, maxZoom, tileSize, corner) {
  corner = corner !== void 0 ? corner : "top-left";
  const resolutions = resolutionsFromExtent(extent, maxZoom, tileSize);
  return new TileGrid_default({
    extent,
    origin: getCorner(extent, corner),
    resolutions,
    tileSize
  });
}
function resolutionsFromExtent(extent, maxZoom, tileSize, maxResolution) {
  maxZoom = maxZoom !== void 0 ? maxZoom : DEFAULT_MAX_ZOOM;
  tileSize = toSize(tileSize !== void 0 ? tileSize : DEFAULT_TILE_SIZE);
  const height = getHeight(extent);
  const width = getWidth(extent);
  maxResolution = maxResolution > 0 ? maxResolution : Math.max(width / tileSize[0], height / tileSize[1]);
  const length = maxZoom + 1;
  const resolutions = new Array(length);
  for (let z = 0; z < length; ++z) {
    resolutions[z] = maxResolution / Math.pow(2, z);
  }
  return resolutions;
}
function createForProjection(projection, maxZoom, tileSize, corner) {
  const extent = extentFromProjection(projection);
  return createForExtent(extent, maxZoom, tileSize, corner);
}
function extentFromProjection(projection) {
  projection = get(projection);
  let extent = projection.getExtent();
  if (!extent) {
    const half = 180 * METERS_PER_UNIT.degrees / projection.getMetersPerUnit();
    extent = createOrUpdate(-half, -half, half, half);
  }
  return extent;
}

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/source/Tile.js
var TileSource = class extends Source_default {
  /**
   * @param {Options} options SourceTile source options.
   */
  constructor(options) {
    super({
      attributions: options.attributions,
      attributionsCollapsible: options.attributionsCollapsible,
      projection: options.projection,
      state: options.state,
      wrapX: options.wrapX,
      interpolate: options.interpolate
    });
    this.on;
    this.once;
    this.un;
    this.opaque_ = options.opaque !== void 0 ? options.opaque : false;
    this.tilePixelRatio_ = options.tilePixelRatio !== void 0 ? options.tilePixelRatio : 1;
    this.tileGrid = options.tileGrid !== void 0 ? options.tileGrid : null;
    const tileSize = [256, 256];
    if (this.tileGrid) {
      toSize(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), tileSize);
    }
    this.tileCache = new TileCache_default(options.cacheSize || 0);
    this.tmpSize = [0, 0];
    this.key_ = options.key || "";
    this.tileOptions = {
      transition: options.transition,
      interpolate: options.interpolate
    };
    this.zDirection = options.zDirection ? options.zDirection : 0;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.tileCache.canExpireCache();
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {!Object<string, boolean>} usedTiles Used tiles.
   */
  expireCache(projection, usedTiles) {
    const tileCache = this.getTileCacheForProjection(projection);
    if (tileCache) {
      tileCache.expireCache(usedTiles);
    }
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {number} z Zoom level.
   * @param {import("../TileRange.js").default} tileRange Tile range.
   * @param {function(import("../Tile.js").default):(boolean|void)} callback Called with each
   *     loaded tile.  If the callback returns `false`, the tile will not be
   *     considered loaded.
   * @return {boolean} The tile range is fully covered with loaded tiles.
   */
  forEachLoadedTile(projection, z, tileRange, callback) {
    const tileCache = this.getTileCacheForProjection(projection);
    if (!tileCache) {
      return false;
    }
    let covered = true;
    let tile, tileCoordKey, loaded;
    for (let x = tileRange.minX; x <= tileRange.maxX; ++x) {
      for (let y = tileRange.minY; y <= tileRange.maxY; ++y) {
        tileCoordKey = getKeyZXY(z, x, y);
        loaded = false;
        if (tileCache.containsKey(tileCoordKey)) {
          tile = /** @type {!import("../Tile.js").default} */
          tileCache.get(tileCoordKey);
          loaded = tile.getState() === TileState_default.LOADED;
          if (loaded) {
            loaded = callback(tile) !== false;
          }
        }
        if (!loaded) {
          covered = false;
        }
      }
    }
    return covered;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   */
  getGutterForProjection(projection) {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   */
  getKey() {
    return this.key_;
  }
  /**
   * Set the value to be used as the key for all tiles in the source.
   * @param {string} key The key for tiles.
   * @protected
   */
  setKey(key) {
    if (this.key_ !== key) {
      this.key_ = key;
      this.changed();
    }
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {boolean} Opaque.
   */
  getOpaque(projection) {
    return this.opaque_;
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   */
  getResolutions(projection) {
    const tileGrid = projection ? this.getTileGridForProjection(projection) : this.tileGrid;
    if (!tileGrid) {
      return null;
    }
    return tileGrid.getResolutions();
  }
  /**
   * @abstract
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../Tile.js").default} Tile.
   */
  getTile(z, x, y, pixelRatio, projection) {
    return abstract();
  }
  /**
   * Return the tile grid of the tile source.
   * @return {import("../tilegrid/TileGrid.js").default|null} Tile grid.
   * @api
   */
  getTileGrid() {
    return this.tileGrid;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   */
  getTileGridForProjection(projection) {
    if (!this.tileGrid) {
      return getForProjection(projection);
    }
    return this.tileGrid;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../TileCache.js").default} Tile cache.
   * @protected
   */
  getTileCacheForProjection(projection) {
    const sourceProjection = this.getProjection();
    assert(
      sourceProjection === null || equivalent(sourceProjection, projection),
      68
      // A VectorTile source can only be rendered if it has a projection compatible with the view projection.
    );
    return this.tileCache;
  }
  /**
   * Get the tile pixel ratio for this source. Subclasses may override this
   * method, which is meant to return a supported pixel ratio that matches the
   * provided `pixelRatio` as close as possible.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Tile pixel ratio.
   */
  getTilePixelRatio(pixelRatio) {
    return this.tilePixelRatio_;
  }
  /**
   * @param {number} z Z.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../size.js").Size} Tile size.
   */
  getTilePixelSize(z, pixelRatio, projection) {
    const tileGrid = this.getTileGridForProjection(projection);
    const tilePixelRatio = this.getTilePixelRatio(pixelRatio);
    const tileSize = toSize(tileGrid.getTileSize(z), this.tmpSize);
    if (tilePixelRatio == 1) {
      return tileSize;
    }
    return scale(tileSize, tilePixelRatio, this.tmpSize);
  }
  /**
   * Returns a tile coordinate wrapped around the x-axis. When the tile coordinate
   * is outside the resolution and extent range of the tile grid, `null` will be
   * returned.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../proj/Projection.js").default} [projection] Projection.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate to be passed to the tileUrlFunction or
   *     null if no tile URL should be created for the passed `tileCoord`.
   */
  getTileCoordForTileUrlFunction(tileCoord, projection) {
    projection = projection !== void 0 ? projection : this.getProjection();
    const tileGrid = this.getTileGridForProjection(projection);
    if (this.getWrapX() && projection.isGlobal()) {
      tileCoord = wrapX(tileGrid, tileCoord, projection);
    }
    return withinExtentAndZ(tileCoord, tileGrid) ? tileCoord : null;
  }
  /**
   * Remove all cached tiles from the source. The next render cycle will fetch new tiles.
   * @api
   */
  clear() {
    this.tileCache.clear();
  }
  refresh() {
    this.clear();
    super.refresh();
  }
  /**
   * Increases the cache size if needed
   * @param {number} tileCount Minimum number of tiles needed.
   * @param {import("../proj/Projection.js").default} projection Projection.
   */
  updateCacheSize(tileCount, projection) {
    const tileCache = this.getTileCacheForProjection(projection);
    if (tileCount > tileCache.highWaterMark) {
      tileCache.highWaterMark = tileCount;
    }
  }
  /**
   * Marks a tile coord as being used, without triggering a load.
   * @abstract
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../proj/Projection.js").default} projection Projection.
   */
  useTile(z, x, y, projection) {
  }
};
var TileSourceEvent = class extends Event_default {
  /**
   * @param {string} type Type.
   * @param {import("../Tile.js").default} tile The tile.
   */
  constructor(type, tile) {
    super(type);
    this.tile = tile;
  }
};
var Tile_default2 = TileSource;

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/tileurlfunction.js
function createFromTemplate(template, tileGrid) {
  const zRegEx = /\{z\}/g;
  const xRegEx = /\{x\}/g;
  const yRegEx = /\{y\}/g;
  const dashYRegEx = /\{-y\}/g;
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(tileCoord, pixelRatio, projection) {
      if (!tileCoord) {
        return void 0;
      }
      return template.replace(zRegEx, tileCoord[0].toString()).replace(xRegEx, tileCoord[1].toString()).replace(yRegEx, tileCoord[2].toString()).replace(dashYRegEx, function() {
        const z = tileCoord[0];
        const range = tileGrid.getFullTileRange(z);
        assert(range, 55);
        const y = range.getHeight() - tileCoord[2] - 1;
        return y.toString();
      });
    })
  );
}
function createFromTemplates(templates, tileGrid) {
  const len = templates.length;
  const tileUrlFunctions = new Array(len);
  for (let i = 0; i < len; ++i) {
    tileUrlFunctions[i] = createFromTemplate(templates[i], tileGrid);
  }
  return createFromTileUrlFunctions(tileUrlFunctions);
}
function createFromTileUrlFunctions(tileUrlFunctions) {
  if (tileUrlFunctions.length === 1) {
    return tileUrlFunctions[0];
  }
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    (function(tileCoord, pixelRatio, projection) {
      if (!tileCoord) {
        return void 0;
      }
      const h = hash(tileCoord);
      const index = modulo(h, tileUrlFunctions.length);
      return tileUrlFunctions[index](tileCoord, pixelRatio, projection);
    })
  );
}
function expandUrl(url) {
  const urls = [];
  let match = /\{([a-z])-([a-z])\}/.exec(url);
  if (match) {
    const startCharCode = match[1].charCodeAt(0);
    const stopCharCode = match[2].charCodeAt(0);
    let charCode;
    for (charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
      urls.push(url.replace(match[0], String.fromCharCode(charCode)));
    }
    return urls;
  }
  match = /\{(\d+)-(\d+)\}/.exec(url);
  if (match) {
    const stop = parseInt(match[2], 10);
    for (let i = parseInt(match[1], 10); i <= stop; i++) {
      urls.push(url.replace(match[0], i.toString()));
    }
    return urls;
  }
  urls.push(url);
  return urls;
}

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/source/UrlTile.js
var UrlTile = class _UrlTile extends Tile_default2 {
  /**
   * @param {Options} options Image tile options.
   */
  constructor(options) {
    super({
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      opaque: options.opaque,
      projection: options.projection,
      state: options.state,
      tileGrid: options.tileGrid,
      tilePixelRatio: options.tilePixelRatio,
      wrapX: options.wrapX,
      transition: options.transition,
      interpolate: options.interpolate,
      key: options.key,
      attributionsCollapsible: options.attributionsCollapsible,
      zDirection: options.zDirection
    });
    this.generateTileUrlFunction_ = this.tileUrlFunction === _UrlTile.prototype.tileUrlFunction;
    this.tileLoadFunction = options.tileLoadFunction;
    if (options.tileUrlFunction) {
      this.tileUrlFunction = options.tileUrlFunction;
    }
    this.urls = null;
    if (options.urls) {
      this.setUrls(options.urls);
    } else if (options.url) {
      this.setUrl(options.url);
    }
    this.tileLoadingKeys_ = {};
  }
  /**
   * Return the tile load function of the source.
   * @return {import("../Tile.js").LoadFunction} TileLoadFunction
   * @api
   */
  getTileLoadFunction() {
    return this.tileLoadFunction;
  }
  /**
   * Return the tile URL function of the source.
   * @return {import("../Tile.js").UrlFunction} TileUrlFunction
   * @api
   */
  getTileUrlFunction() {
    return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction ? this.tileUrlFunction.bind(this) : this.tileUrlFunction;
  }
  /**
   * Return the URLs used for this source.
   * When a tileUrlFunction is used instead of url or urls,
   * null will be returned.
   * @return {!Array<string>|null} URLs.
   * @api
   */
  getUrls() {
    return this.urls;
  }
  /**
   * Handle tile change events.
   * @param {import("../events/Event.js").default} event Event.
   * @protected
   */
  handleTileChange(event) {
    const tile = (
      /** @type {import("../Tile.js").default} */
      event.target
    );
    const uid = getUid(tile);
    const tileState = tile.getState();
    let type;
    if (tileState == TileState_default.LOADING) {
      this.tileLoadingKeys_[uid] = true;
      type = TileEventType_default.TILELOADSTART;
    } else if (uid in this.tileLoadingKeys_) {
      delete this.tileLoadingKeys_[uid];
      type = tileState == TileState_default.ERROR ? TileEventType_default.TILELOADERROR : tileState == TileState_default.LOADED ? TileEventType_default.TILELOADEND : void 0;
    }
    if (type != void 0) {
      this.dispatchEvent(new TileSourceEvent(type, tile));
    }
  }
  /**
   * Set the tile load function of the source.
   * @param {import("../Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @api
   */
  setTileLoadFunction(tileLoadFunction) {
    this.tileCache.clear();
    this.tileLoadFunction = tileLoadFunction;
    this.changed();
  }
  /**
   * Set the tile URL function of the source.
   * @param {import("../Tile.js").UrlFunction} tileUrlFunction Tile URL function.
   * @param {string} [key] Optional new tile key for the source.
   * @api
   */
  setTileUrlFunction(tileUrlFunction, key) {
    this.tileUrlFunction = tileUrlFunction;
    this.tileCache.pruneExceptNewestZ();
    if (typeof key !== "undefined") {
      this.setKey(key);
    } else {
      this.changed();
    }
  }
  /**
   * Set the URL to use for requests.
   * @param {string} url URL.
   * @api
   */
  setUrl(url) {
    const urls = expandUrl(url);
    this.urls = urls;
    this.setUrls(urls);
  }
  /**
   * Set the URLs to use for requests.
   * @param {Array<string>} urls URLs.
   * @api
   */
  setUrls(urls) {
    this.urls = urls;
    const key = urls.join("\n");
    if (this.generateTileUrlFunction_) {
      this.setTileUrlFunction(createFromTemplates(urls, this.tileGrid), key);
    } else {
      this.setKey(key);
    }
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {string|undefined} Tile URL.
   */
  tileUrlFunction(tileCoord, pixelRatio, projection) {
    return void 0;
  }
  /**
   * Marks a tile coord as being used, without triggering a load.
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   */
  useTile(z, x, y) {
    const tileCoordKey = getKeyZXY(z, x, y);
    if (this.tileCache.containsKey(tileCoordKey)) {
      this.tileCache.get(tileCoordKey);
    }
  }
};
var UrlTile_default = UrlTile;

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/source/TileImage.js
var TileImage = class extends UrlTile_default {
  /**
   * @param {!Options} options Image tile options.
   */
  constructor(options) {
    super({
      attributions: options.attributions,
      cacheSize: options.cacheSize,
      opaque: options.opaque,
      projection: options.projection,
      state: options.state,
      tileGrid: options.tileGrid,
      tileLoadFunction: options.tileLoadFunction ? options.tileLoadFunction : defaultTileLoadFunction,
      tilePixelRatio: options.tilePixelRatio,
      tileUrlFunction: options.tileUrlFunction,
      url: options.url,
      urls: options.urls,
      wrapX: options.wrapX,
      transition: options.transition,
      interpolate: options.interpolate !== void 0 ? options.interpolate : true,
      key: options.key,
      attributionsCollapsible: options.attributionsCollapsible,
      zDirection: options.zDirection
    });
    this.crossOrigin = options.crossOrigin !== void 0 ? options.crossOrigin : null;
    this.tileClass = options.tileClass !== void 0 ? options.tileClass : ImageTile_default;
    this.tileCacheForProjection = {};
    this.tileGridForProjection = {};
    this.reprojectionErrorThreshold_ = options.reprojectionErrorThreshold;
    this.renderReprojectionEdges_ = false;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    if (this.tileCache.canExpireCache()) {
      return true;
    }
    for (const key in this.tileCacheForProjection) {
      if (this.tileCacheForProjection[key].canExpireCache()) {
        return true;
      }
    }
    return false;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {!Object<string, boolean>} usedTiles Used tiles.
   */
  expireCache(projection, usedTiles) {
    const usedTileCache = this.getTileCacheForProjection(projection);
    this.tileCache.expireCache(
      this.tileCache == usedTileCache ? usedTiles : {}
    );
    for (const id in this.tileCacheForProjection) {
      const tileCache = this.tileCacheForProjection[id];
      tileCache.expireCache(tileCache == usedTileCache ? usedTiles : {});
    }
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   */
  getGutterForProjection(projection) {
    if (this.getProjection() && projection && !equivalent(this.getProjection(), projection)) {
      return 0;
    }
    return this.getGutter();
  }
  /**
   * @return {number} Gutter.
   */
  getGutter() {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   */
  getKey() {
    let key = super.getKey();
    if (!this.getInterpolate()) {
      key += ":disable-interpolation";
    }
    return key;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {boolean} Opaque.
   */
  getOpaque(projection) {
    if (this.getProjection() && projection && !equivalent(this.getProjection(), projection)) {
      return false;
    }
    return super.getOpaque(projection);
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   */
  getTileGridForProjection(projection) {
    const thisProj = this.getProjection();
    if (this.tileGrid && (!thisProj || equivalent(thisProj, projection))) {
      return this.tileGrid;
    }
    const projKey = getUid(projection);
    if (!(projKey in this.tileGridForProjection)) {
      this.tileGridForProjection[projKey] = getForProjection(projection);
    }
    return this.tileGridForProjection[projKey];
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../TileCache.js").default} Tile cache.
   */
  getTileCacheForProjection(projection) {
    const thisProj = this.getProjection();
    if (!thisProj || equivalent(thisProj, projection)) {
      return this.tileCache;
    }
    const projKey = getUid(projection);
    if (!(projKey in this.tileCacheForProjection)) {
      this.tileCacheForProjection[projKey] = new TileCache_default(
        this.tileCache.highWaterMark
      );
    }
    return this.tileCacheForProjection[projKey];
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {string} key The key set on the tile.
   * @return {!ImageTile} Tile.
   * @private
   */
  createTile_(z, x, y, pixelRatio, projection, key) {
    const tileCoord = [z, x, y];
    const urlTileCoord = this.getTileCoordForTileUrlFunction(
      tileCoord,
      projection
    );
    const tileUrl = urlTileCoord ? this.tileUrlFunction(urlTileCoord, pixelRatio, projection) : void 0;
    const tile = new this.tileClass(
      tileCoord,
      tileUrl !== void 0 ? TileState_default.IDLE : TileState_default.EMPTY,
      tileUrl !== void 0 ? tileUrl : "",
      this.crossOrigin,
      this.tileLoadFunction,
      this.tileOptions
    );
    tile.key = key;
    tile.addEventListener(EventType_default.CHANGE, this.handleTileChange.bind(this));
    return tile;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!(ImageTile|ReprojTile)} Tile.
   */
  getTile(z, x, y, pixelRatio, projection) {
    const sourceProjection = this.getProjection();
    if (!sourceProjection || !projection || equivalent(sourceProjection, projection)) {
      return this.getTileInternal(
        z,
        x,
        y,
        pixelRatio,
        sourceProjection || projection
      );
    }
    const cache = this.getTileCacheForProjection(projection);
    const tileCoord = [z, x, y];
    let tile;
    const tileCoordKey = getKey(tileCoord);
    if (cache.containsKey(tileCoordKey)) {
      tile = cache.get(tileCoordKey);
    }
    const key = this.getKey();
    if (tile && tile.key == key) {
      return tile;
    }
    const sourceTileGrid = this.getTileGridForProjection(sourceProjection);
    const targetTileGrid = this.getTileGridForProjection(projection);
    const wrappedTileCoord = this.getTileCoordForTileUrlFunction(
      tileCoord,
      projection
    );
    const newTile = new Tile_default(
      sourceProjection,
      sourceTileGrid,
      projection,
      targetTileGrid,
      tileCoord,
      wrappedTileCoord,
      this.getTilePixelRatio(pixelRatio),
      this.getGutter(),
      (z2, x2, y2, pixelRatio2) => this.getTileInternal(z2, x2, y2, pixelRatio2, sourceProjection),
      this.reprojectionErrorThreshold_,
      this.renderReprojectionEdges_,
      this.getInterpolate()
    );
    newTile.key = key;
    if (tile) {
      newTile.interimTile = tile;
      newTile.refreshInterimChain();
      cache.replace(tileCoordKey, newTile);
    } else {
      cache.set(tileCoordKey, newTile);
    }
    return newTile;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {!import("../proj/Projection.js").default} projection Projection.
   * @return {!ImageTile} Tile.
   * @protected
   */
  getTileInternal(z, x, y, pixelRatio, projection) {
    let tile = null;
    const tileCoordKey = getKeyZXY(z, x, y);
    const key = this.getKey();
    if (!this.tileCache.containsKey(tileCoordKey)) {
      tile = this.createTile_(z, x, y, pixelRatio, projection, key);
      this.tileCache.set(tileCoordKey, tile);
    } else {
      tile = this.tileCache.get(tileCoordKey);
      if (tile.key != key) {
        const interimTile = tile;
        tile = this.createTile_(z, x, y, pixelRatio, projection, key);
        if (interimTile.getState() == TileState_default.IDLE) {
          tile.interimTile = interimTile.interimTile;
        } else {
          tile.interimTile = interimTile;
        }
        tile.refreshInterimChain();
        this.tileCache.replace(tileCoordKey, tile);
      }
    }
    return tile;
  }
  /**
   * Sets whether to render reprojection edges or not (usually for debugging).
   * @param {boolean} render Render the edges.
   * @api
   */
  setRenderReprojectionEdges(render) {
    if (this.renderReprojectionEdges_ == render) {
      return;
    }
    this.renderReprojectionEdges_ = render;
    for (const id in this.tileCacheForProjection) {
      this.tileCacheForProjection[id].clear();
    }
    this.changed();
  }
  /**
   * Sets the tile grid to use when reprojecting the tiles to the given
   * projection instead of the default tile grid for the projection.
   *
   * This can be useful when the default tile grid cannot be created
   * (e.g. projection has no extent defined) or
   * for optimization reasons (custom tile size, resolutions, ...).
   *
   * @param {import("../proj.js").ProjectionLike} projection Projection.
   * @param {import("../tilegrid/TileGrid.js").default} tilegrid Tile grid to use for the projection.
   * @api
   */
  setTileGridForProjection(projection, tilegrid) {
    const proj = get(projection);
    if (proj) {
      const projKey = getUid(proj);
      if (!(projKey in this.tileGridForProjection)) {
        this.tileGridForProjection[projKey] = tilegrid;
      }
    }
  }
  clear() {
    super.clear();
    for (const id in this.tileCacheForProjection) {
      this.tileCacheForProjection[id].clear();
    }
  }
};
function defaultTileLoadFunction(imageTile, src) {
  imageTile.getImage().src = src;
}
var TileImage_default = TileImage;

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/uri.js
function appendParams(uri, params) {
  const keyParams = [];
  Object.keys(params).forEach(function(k) {
    if (params[k] !== null && params[k] !== void 0) {
      keyParams.push(k + "=" + encodeURIComponent(params[k]));
    }
  });
  const qs = keyParams.join("&");
  uri = uri.replace(/[?&]$/, "");
  uri += uri.includes("?") ? "&" : "?";
  return uri + qs;
}

// node_modules/.pnpm/ol@7.5.2/node_modules/ol/source/WMTS.js
var WMTS = class extends TileImage_default {
  /**
   * @param {Options} options WMTS options.
   */
  constructor(options) {
    const requestEncoding = options.requestEncoding !== void 0 ? options.requestEncoding : "KVP";
    const tileGrid = options.tileGrid;
    let urls = options.urls;
    if (urls === void 0 && options.url !== void 0) {
      urls = expandUrl(options.url);
    }
    super({
      attributions: options.attributions,
      attributionsCollapsible: options.attributionsCollapsible,
      cacheSize: options.cacheSize,
      crossOrigin: options.crossOrigin,
      interpolate: options.interpolate,
      projection: options.projection,
      reprojectionErrorThreshold: options.reprojectionErrorThreshold,
      tileClass: options.tileClass,
      tileGrid,
      tileLoadFunction: options.tileLoadFunction,
      tilePixelRatio: options.tilePixelRatio,
      urls,
      wrapX: options.wrapX !== void 0 ? options.wrapX : false,
      transition: options.transition,
      zDirection: options.zDirection
    });
    this.version_ = options.version !== void 0 ? options.version : "1.0.0";
    this.format_ = options.format !== void 0 ? options.format : "image/jpeg";
    this.dimensions_ = options.dimensions !== void 0 ? options.dimensions : {};
    this.layer_ = options.layer;
    this.matrixSet_ = options.matrixSet;
    this.style_ = options.style;
    this.requestEncoding_ = requestEncoding;
    this.setKey(this.getKeyForDimensions_());
    if (urls && urls.length > 0) {
      this.tileUrlFunction = createFromTileUrlFunctions(
        urls.map(this.createFromWMTSTemplate.bind(this))
      );
    }
  }
  /**
   * Set the URLs to use for requests.
   * URLs may contain OGC conform URL Template Variables: {TileMatrix}, {TileRow}, {TileCol}.
   * @param {Array<string>} urls URLs.
   */
  setUrls(urls) {
    this.urls = urls;
    const key = urls.join("\n");
    this.setTileUrlFunction(
      createFromTileUrlFunctions(
        urls.map(this.createFromWMTSTemplate.bind(this))
      ),
      key
    );
  }
  /**
   * Get the dimensions, i.e. those passed to the constructor through the
   * "dimensions" option, and possibly updated using the updateDimensions
   * method.
   * @return {!Object} Dimensions.
   * @api
   */
  getDimensions() {
    return this.dimensions_;
  }
  /**
   * Return the image format of the WMTS source.
   * @return {string} Format.
   * @api
   */
  getFormat() {
    return this.format_;
  }
  /**
   * Return the layer of the WMTS source.
   * @return {string} Layer.
   * @api
   */
  getLayer() {
    return this.layer_;
  }
  /**
   * Return the matrix set of the WMTS source.
   * @return {string} MatrixSet.
   * @api
   */
  getMatrixSet() {
    return this.matrixSet_;
  }
  /**
   * Return the request encoding, either "KVP" or "REST".
   * @return {RequestEncoding} Request encoding.
   * @api
   */
  getRequestEncoding() {
    return this.requestEncoding_;
  }
  /**
   * Return the style of the WMTS source.
   * @return {string} Style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Return the version of the WMTS source.
   * @return {string} Version.
   * @api
   */
  getVersion() {
    return this.version_;
  }
  /**
   * @private
   * @return {string} The key for the current dimensions.
   */
  getKeyForDimensions_() {
    const res = this.urls ? this.urls.slice(0) : [];
    for (const key in this.dimensions_) {
      res.push(key + "-" + this.dimensions_[key]);
    }
    return res.join("/");
  }
  /**
   * Update the dimensions.
   * @param {Object} dimensions Dimensions.
   * @api
   */
  updateDimensions(dimensions) {
    Object.assign(this.dimensions_, dimensions);
    this.setKey(this.getKeyForDimensions_());
  }
  /**
   * @param {string} template Template.
   * @return {import("../Tile.js").UrlFunction} Tile URL function.
   */
  createFromWMTSTemplate(template) {
    const requestEncoding = this.requestEncoding_;
    const context = {
      "layer": this.layer_,
      "style": this.style_,
      "tilematrixset": this.matrixSet_
    };
    if (requestEncoding == "KVP") {
      Object.assign(context, {
        "Service": "WMTS",
        "Request": "GetTile",
        "Version": this.version_,
        "Format": this.format_
      });
    }
    template = requestEncoding == "KVP" ? appendParams(template, context) : template.replace(/\{(\w+?)\}/g, function(m, p) {
      return p.toLowerCase() in context ? context[p.toLowerCase()] : m;
    });
    const tileGrid = (
      /** @type {import("../tilegrid/WMTS.js").default} */
      this.tileGrid
    );
    const dimensions = this.dimensions_;
    return (
      /**
       * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
       * @param {number} pixelRatio Pixel ratio.
       * @param {import("../proj/Projection.js").default} projection Projection.
       * @return {string|undefined} Tile URL.
       */
      (function(tileCoord, pixelRatio, projection) {
        if (!tileCoord) {
          return void 0;
        }
        const localContext = {
          "TileMatrix": tileGrid.getMatrixId(tileCoord[0]),
          "TileCol": tileCoord[1],
          "TileRow": tileCoord[2]
        };
        Object.assign(localContext, dimensions);
        let url = template;
        if (requestEncoding == "KVP") {
          url = appendParams(url, localContext);
        } else {
          url = url.replace(/\{(\w+?)\}/g, function(m, p) {
            return localContext[p];
          });
        }
        return url;
      })
    );
  }
};
var WMTS_default = WMTS;
function optionsFromCapabilities(wmtsCap, config) {
  const layers = wmtsCap["Contents"]["Layer"];
  const l = layers.find(function(elt) {
    return elt["Identifier"] == config["layer"];
  });
  if (!l) {
    return null;
  }
  const tileMatrixSets = wmtsCap["Contents"]["TileMatrixSet"];
  let idx;
  if (l["TileMatrixSetLink"].length > 1) {
    if ("projection" in config) {
      idx = l["TileMatrixSetLink"].findIndex(function(elt) {
        const tileMatrixSet = tileMatrixSets.find(function(el) {
          return el["Identifier"] == elt["TileMatrixSet"];
        });
        const supportedCRS = tileMatrixSet["SupportedCRS"];
        const proj1 = get(supportedCRS);
        const proj2 = get(config["projection"]);
        if (proj1 && proj2) {
          return equivalent(proj1, proj2);
        }
        return supportedCRS == config["projection"];
      });
    } else {
      idx = l["TileMatrixSetLink"].findIndex(function(elt) {
        return elt["TileMatrixSet"] == config["matrixSet"];
      });
    }
  } else {
    idx = 0;
  }
  if (idx < 0) {
    idx = 0;
  }
  const matrixSet = (
    /** @type {string} */
    l["TileMatrixSetLink"][idx]["TileMatrixSet"]
  );
  const matrixLimits = (
    /** @type {Array<Object>} */
    l["TileMatrixSetLink"][idx]["TileMatrixSetLimits"]
  );
  let format = (
    /** @type {string} */
    l["Format"][0]
  );
  if ("format" in config) {
    format = config["format"];
  }
  idx = l["Style"].findIndex(function(elt) {
    if ("style" in config) {
      return elt["Title"] == config["style"];
    }
    return elt["isDefault"];
  });
  if (idx < 0) {
    idx = 0;
  }
  const style = (
    /** @type {string} */
    l["Style"][idx]["Identifier"]
  );
  const dimensions = {};
  if ("Dimension" in l) {
    l["Dimension"].forEach(function(elt, index, array) {
      const key = elt["Identifier"];
      let value = elt["Default"];
      if (value === void 0) {
        value = elt["Value"][0];
      }
      dimensions[key] = value;
    });
  }
  const matrixSets = wmtsCap["Contents"]["TileMatrixSet"];
  const matrixSetObj = matrixSets.find(function(elt) {
    return elt["Identifier"] == matrixSet;
  });
  let projection;
  const code = matrixSetObj["SupportedCRS"];
  if (code) {
    projection = get(code);
  }
  if ("projection" in config) {
    const projConfig = get(config["projection"]);
    if (projConfig) {
      if (!projection || equivalent(projConfig, projection)) {
        projection = projConfig;
      }
    }
  }
  let wrapX2 = false;
  const switchXY = projection.getAxisOrientation().substr(0, 2) == "ne";
  let matrix = matrixSetObj.TileMatrix[0];
  let selectedMatrixLimit = {
    MinTileCol: 0,
    MinTileRow: 0,
    // subtract one to end up at tile top left
    MaxTileCol: matrix.MatrixWidth - 1,
    MaxTileRow: matrix.MatrixHeight - 1
  };
  if (matrixLimits) {
    selectedMatrixLimit = matrixLimits[matrixLimits.length - 1];
    const m = matrixSetObj.TileMatrix.find(
      (tileMatrixValue) => tileMatrixValue.Identifier === selectedMatrixLimit.TileMatrix || matrixSetObj.Identifier + ":" + tileMatrixValue.Identifier === selectedMatrixLimit.TileMatrix
    );
    if (m) {
      matrix = m;
    }
  }
  const resolution = matrix.ScaleDenominator * 28e-5 / projection.getMetersPerUnit();
  const origin = switchXY ? [matrix.TopLeftCorner[1], matrix.TopLeftCorner[0]] : matrix.TopLeftCorner;
  const tileSpanX = matrix.TileWidth * resolution;
  const tileSpanY = matrix.TileHeight * resolution;
  let matrixSetExtent = matrixSetObj["BoundingBox"];
  if (matrixSetExtent && switchXY) {
    matrixSetExtent = [
      matrixSetExtent[1],
      matrixSetExtent[0],
      matrixSetExtent[3],
      matrixSetExtent[2]
    ];
  }
  let extent = [
    origin[0] + tileSpanX * selectedMatrixLimit.MinTileCol,
    // add one to get proper bottom/right coordinate
    origin[1] - tileSpanY * (1 + selectedMatrixLimit.MaxTileRow),
    origin[0] + tileSpanX * (1 + selectedMatrixLimit.MaxTileCol),
    origin[1] - tileSpanY * selectedMatrixLimit.MinTileRow
  ];
  if (matrixSetExtent !== void 0 && !containsExtent(matrixSetExtent, extent)) {
    const wgs84BoundingBox = l["WGS84BoundingBox"];
    const wgs84ProjectionExtent = get("EPSG:4326").getExtent();
    extent = matrixSetExtent;
    if (wgs84BoundingBox) {
      wrapX2 = wgs84BoundingBox[0] === wgs84ProjectionExtent[0] && wgs84BoundingBox[2] === wgs84ProjectionExtent[2];
    } else {
      const wgs84MatrixSetExtent = transformExtent(
        matrixSetExtent,
        matrixSetObj["SupportedCRS"],
        "EPSG:4326"
      );
      wrapX2 = wgs84MatrixSetExtent[0] - 1e-10 <= wgs84ProjectionExtent[0] && wgs84MatrixSetExtent[2] + 1e-10 >= wgs84ProjectionExtent[2];
    }
  }
  const tileGrid = createFromCapabilitiesMatrixSet(
    matrixSetObj,
    extent,
    matrixLimits
  );
  const urls = [];
  let requestEncoding = config["requestEncoding"];
  requestEncoding = requestEncoding !== void 0 ? requestEncoding : "";
  if ("OperationsMetadata" in wmtsCap && "GetTile" in wmtsCap["OperationsMetadata"]) {
    const gets = wmtsCap["OperationsMetadata"]["GetTile"]["DCP"]["HTTP"]["Get"];
    for (let i = 0, ii = gets.length; i < ii; ++i) {
      if (gets[i]["Constraint"]) {
        const constraint = gets[i]["Constraint"].find(function(element) {
          return element["name"] == "GetEncoding";
        });
        const encodings = constraint["AllowedValues"]["Value"];
        if (requestEncoding === "") {
          requestEncoding = encodings[0];
        }
        if (requestEncoding === "KVP") {
          if (encodings.includes("KVP")) {
            urls.push(
              /** @type {string} */
              gets[i]["href"]
            );
          }
        } else {
          break;
        }
      } else if (gets[i]["href"]) {
        requestEncoding = "KVP";
        urls.push(
          /** @type {string} */
          gets[i]["href"]
        );
      }
    }
  }
  if (urls.length === 0) {
    requestEncoding = "REST";
    l["ResourceURL"].forEach(function(element) {
      if (element["resourceType"] === "tile") {
        format = element["format"];
        urls.push(
          /** @type {string} */
          element["template"]
        );
      }
    });
  }
  return {
    urls,
    layer: config["layer"],
    matrixSet,
    format,
    projection,
    requestEncoding,
    tileGrid,
    style,
    dimensions,
    wrapX: wrapX2,
    crossOrigin: config["crossOrigin"]
  };
}
export {
  WMTS_default as default,
  optionsFromCapabilities
};
//# sourceMappingURL=ol_source_WMTS.js.map
