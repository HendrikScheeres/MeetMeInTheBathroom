
const TEXTSIZE = 20;
const RADIUS = 70;
const MUSICIANCIRCLECOLOR = 250;
const BANDCIRCLECOLOR = 200;
const CIRCLEDRAGCOLOR = (255, 255, 255);
const CIRCLESTROKECOLOR = (0, 0, 0);
const CIRCLESTROKE = 5;
const LINEHOVERCOLOR = (255, 0, 0);

class Cell {
    constructor(label, type, x=-1, y=-1) {
      this.x = x == -1 ? random(width) : x;
      this.y = y == -1 ? random(height) : y;
      this.label = label;
      
      this.flags = {
        hover : false,
        dragging : false,
      };
      
      this.radius = RADIUS;
      this.type = type;
    }
    
    render() {
      this.render_circle();
      this.render_text();
    }

    render_text() {
      noStroke();
      fill(0);
      
      let maxTextSize = this.radius / 2; // Set a max text size relative to the radius
      textSize(maxTextSize);
      
      // Reduce text size if it's too wide for the circle
      while (textWidth(this.label) > this.radius * 1.5 && maxTextSize > 5) {
        maxTextSize -= 1;
        textSize(maxTextSize);
      }
      
      text(this.label, this.x - (textWidth(this.label) / 2), this.y + (maxTextSize / 3));
    }
    
    render_circle() {
      stroke(CIRCLESTROKECOLOR);
      strokeWeight(CIRCLESTROKE);
      let circleColor = this.type == 'musician' ? MUSICIANCIRCLECOLOR : BANDCIRCLECOLOR;
      fill(circleColor);
      if (this.flags.hover) {
        strokeWeight(3);
      }
      if (this.flags.dragging) {
        fill(CIRCLEDRAGCOLOR);
      }
      
      ellipse(this.x, this.y, this.radius*2, this.radius*2);
    }
    
    isInside(x, y) {
      const d = dist(this.x, this.y, x, y);
      return d <= this.radius;
    }
}