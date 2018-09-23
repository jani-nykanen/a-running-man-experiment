/**
 * An object buffer
 * (for sorting by depth)
 * 
 * @author Jani Nykänen
 */


// Constructor
var ObjectBuffer = function(size) {

    // Buffer
    this.buffer = new Array(size);
    // Index array
    this.indexArr = new Array(size);
    // Already sorted indices
    this.sorted = new Array(size);
    for(let i = 0; i < this.buffer.length; ++ i) {

        this.buffer[i] = null;
        this.indexArr[i] = 0;
        this.sorted[i] = false;
    }
    

    // Index pointer
    this.indexPointer = 0;
}


// Add an object
ObjectBuffer.prototype.addObject = function(o) {

    this.buffer[this.indexPointer ++] = o;
}


// Sort by depth
ObjectBuffer.prototype.sortByDepth = function() {

    if(this.indexPointer == 0) return;

    // Clear sorted & index arrays
    for(let i = 0; i < this.indexPointer; ++ i) {

        this.indexArr[i] = 0;
        this.sorted[i] = false;
    }

    let max = this.buffer[0].pos.z;
    let maxIndex = 0;

    // Sort
    let count = 0;
    while(count < this.indexPointer) {

        max = -1;
        for(let i = 0; i < this.indexPointer; ++ i) {

            let z = this.buffer[i].pos.z;
            if(z > max && !this.sorted[i]) {

                maxIndex = i;
                max = z;
            } 
        }

        this.indexArr[count ++] = maxIndex;
        this.sorted[maxIndex] = true;
    }
}


// Draw
ObjectBuffer.prototype.draw = function(g, a) {

    // Draw all in the current order
    for(let i = 0; i < this.indexPointer; ++ i) {

        this.buffer[this.indexArr[i]].draw(g, a);
    }

    // Reset index pointer
    this.indexPointer = 0;
}
