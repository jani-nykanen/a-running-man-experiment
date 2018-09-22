/**
 * Utility functions
 * 
 * @author Jani Nykänen
 */


// Is (x,y) inside a triangle
function isInsideTriangle(px, py, x1, y1, x2, y2, x3, y3) {

    let as_x = px-x1;
    let as_y = py-y1;
    
    let s_ab = (x2-x1)*as_y-(y2-y1)*as_x > 0;
    
    if( ((x3-x1)*as_y-(y3-y1)*as_x > 0) == s_ab) return false;
    if( ((x3-x2)*(py-y2)-(y3-y2)*(px-x2) > 0) != s_ab) return false;
    
    return true;
}
