/**
 * Asset pack
 * 
 * @author Jani Nykänen
 */


// Asset pack reference
let assRef = null;


// Constructor
var AssetPack = function(bmpList, bmpPath) {

    // How many files loaded
    this.loaded = 0;
    // File total
    this.total = 0;
    // Bitmaps
    this.bitmaps = {};
    // Audio
    this.audio = {};

    // Set refence to this
    assRef = this;

    // Set bitmaps to be loaded
    for(var k in bmpList) {

        this.loadBitmap(k, bmpPath + "/" + bmpList[k]);
    }
}


// Load a bitmap
AssetPack.prototype.loadBitmap = function(name, url) {

    ++ this.total;

    var image = new Image();
    image.onload = function() {

        ++ assRef.loaded;
    }
    image.src = url;
    assRef.bitmaps[name] = image;
}


// Are all the assets loaded
AssetPack.prototype.hasLoaded = function() {

    return this.total == 0 || this.loaded >= this.total;
}


// Get the amount of loaded assets in "percentage" 
// (actually in range [0,1])
AssetPack.prototype.getPercentage = function() {

    if(this.total == 0) return 0.0;
    return this.loaded / this.total;
}
