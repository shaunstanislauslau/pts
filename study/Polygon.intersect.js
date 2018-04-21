// Source code licensed under Apache License 2.0. 
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)


Pts.namespace( window );

var space = new CanvasSpace("#pt").setup({retina: true, resize: true});
var form = space.getForm();

var ang = 60;

space.add( {

  start: init,

  animate: (time, ftime) => {
    guidelines();
    
    // Begin Test Code --
    
    form.stroke("#f00", 2);
    // ang += 0.3;

    let pts = Util.flatten( [line1, poly1, rect1 ] );
    // form.points( pts );

    let poly = new Group( space.pointer.subtract(90, 30), space.pointer.add(30, 10), space.pointer.add(20, 80), space.pointer.add( -50, 40) ); 
    let convex = Polygon.convexHull( pts );

    let circle = new Group( space.pointer.$subtract( space.size ).abs(), new Pt(50,50) );

    poly.rotate2D( Geom.toRadian(ang), space.pointer );

    

    let hit = Polygon.hasIntersectPolygon( poly, convex );
    let hitc = Polygon.hasIntersectCircle( convex, circle );

    if (hit) {
      let pnt = Polygon.intersect2D( poly, convex );
      form.points( pnt );

      form.stroke("#f03", 5);
      form.line( hit.edge );
      form.line( [hit.vertex, hit.vertex.$add( hit.normal.$multiply( hit.dist ) )] );
      form.point( hit.vertex, 5);
      
    }

    let inside = Polygon.hasIntersectPoint( convex, circle[0] );
    
    if (inside) form.fillOnly("#999").point( circle[0], 5 );

    if (hitc) {
      form.stroke("#06f", 3);
      form.line( hitc.edge );
      // form.line( [circle[0], circle[0].$add( hitc.normal.$multiply( hitc.dist ) )] );
      form.line( [ hitc.vertex, hitc.vertex.$add( hitc.normal.$multiply( hitc.dist ) )] );
      form.point( hitc.vertex, 5);
    }


    form.strokeOnly("#000", 1).polygon( convex );
    form.stroke("#0f3", 1 ).polygon( poly ).circle( circle );

    

    // End
  },

  action:( type, px, py) => {

  },
  
  resize:( bound, evt) => {
    
  }
  
});

// Template: Predefined shapes for testing ---

let gp = new Group();
let line1, line2, line3, line4;
let rect1, rect2, rect3;
let poly1;
let circle1, circle2;

function init(bound, space) {
  let ux = space.width / 20;
  let uy = space.height / 20;

  // vertical and horizontal line
  line1 = Group.fromArray([[-ux, -space.height / 3], [ux, space.height / 3]]);
  line2 = Group.fromArray([[0, -space.height / 2], [0, space.height / 2]]);
  line3 = Group.fromArray([[-space.width / 3, -uy], [space.width / 3, uy]]);
  line4 = Group.fromArray([[-space.width / 2, 0], [space.width / 2, 0]]);
  gp.push(line1, line2, line3, line4);

  // bounds
  rect1 = Group.fromArray([[-ux * 3, -uy * 3], [ux, uy]]);
  rect2 = Group.fromArray([[-ux, -ux], [ux * 4, ux * 4]]);
  gp.push(rect1, rect2);

  // shapes
  poly1 = Group.fromArray([[-ux * 2, -uy * 2], [ux, uy * 3], [ux * 4, 0], [ux * 6, uy * 5]]);
  gp.push(poly1);

  for (let i = 0, len = gp.length; i < len; i++) {
    gp[i].anchorFrom(space.center);
  }

  circle1 = Circle.fromRect(rect1);
  circle2 = Circle.fromRect(rect1, true);
  circle3 = Circle.fromRect(rect2, true);
  rect3 = Rectangle.boundingBox([rect1, rect2]);
};

function guidelines() {
  form.stroke("#c1c5ca", 1).fill(false);
  form.lines( [line1, line2, line3, line4, poly1] );
  form.rects( [rect1, rect2, rect3] );
  form.circles( [circle1, circle2, circle3] );
}


  
space.bindMouse().bindTouch();
space.play();
// space.playOnce(5000);