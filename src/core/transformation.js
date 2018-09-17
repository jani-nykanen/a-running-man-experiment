/**
 * (Pseudo)-3D transformations
 * 
 * @author Jani Nykänen
 */


// Constructor
var Transformation = function (fovFactor) {

    const DEFAULT_FOV_FACTOR = 0.75;

    // "FOV" factor
    this.fovFactor = fovFactor | DEFAULT_FOV_FACTOR;
    // Translation
    this.tr = {
        x: 0,
        y: 0,
        z: 0
    };
}


// Transform a point
Transformation.prototype.transform = function (x, y, z) {

    x += tr.x;
    y += tr.y;
    z += tr.z;

    z *= this.fovFactor;

    return { x: x, y: y, z: z };
}


// Project to the screen
Transformation.prototype.project = function(x, y, z, near, far, w, h) {

    // Transform
    let p = transform(x, y, z);

    // Check if not too far
    if(p.z >= far) return;

    // Check if not too near
    if(p.z <= 0.0) return null;
    else if(p.z <= near) p.z = near;

    // Divide by z
    p.x /= p.z;
    p.y /= p.z;

    // Fit the area
    p.x += 1.0;
    p.y += 1.0;

    p.x /= 2;
    p.y /= 2;

    p.x *= w;
    p.y *= h;

    return p;
}
