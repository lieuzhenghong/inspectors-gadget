class Canvas {
  constructor(canvas, transform, globals_, image) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.transform = transform;
    this.image = image;
    this.globals_ = globals_;
    // Hardcoded draw_ratio value
    this.draw_ratio = 1;
  }

  draw_label(label, ctx=this.context, draw_ratio=1) {
    if (label.x !== null && label.y !== null) {
      console.log(draw_ratio);
      let font_size = 60 / (draw_ratio);
      ctx.textAlign = 'center';
      ctx.font = `${font_size}px sans-serif`;
      const wid = ctx.measureText(label.title).width;
      const ht = font_size;
      console.log(font_size, wid, ht);
      if (label.defect === 0) { ctx.fillStyle = 'rgba(0, 200, 0, 0.8)'; }
      else if (label.defect === 1) { ctx.fillStyle = 'rgba(255, 200, 0, 0.9)'; }
      else { ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'; }
      // Dictates minimum label width
      let l_w = (wid + 10/draw_ratio)
      let l_h = (ht + 10/draw_ratio)
      ctx.fillRect(label.x - l_w/2, 
                  label.y - l_h/2,
                  l_w,
                  l_h
                  );
      ctx.strokeRect(label.x - l_w/2,
                    label.y - l_h/2,
                    l_w,
                    l_h
                    );
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.textBaseline = 'middle';
      ctx.fillText(label.title, label.x, label.y);
    }
  }

  draw_overlay(c=this.canvas, ctx=this.context) {
    // Clear the transform to draw the overlay

    let ht = c.height/15;
    let font_size = c.height/30;
    ctx.setTransform.apply(ctx, [1, 0, 0, 1, 0, 0]);
    ctx.fillStyle = 'rgba(200, 200, 200, 0.9)';
    ctx.fillRect(0, c.height-ht, c.width, ht);
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.font = `${font_size}px sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    let text = `Building ${this.globals_.BUILDING} ${this.globals_.FLOOR}`;
    let textwidth = this.context.measureText(text).width;
    ctx.fillText(text, c.width/2,
                  c.height-ht/2);
    
    // Restore the previous transform
    this.context.restore();

  }

  draw_canvas() {
    this.context.clearRect(0, 0, 9999, 9999); // This code can break if image > 9999x9999
    this.context.setTransform.apply(this.context, this.transform);
    this.context.save();
    this.context.drawImage(this.image, 0, 0);
    this.draw_ratio = Math.min(3800/this.image.height, 4043/this.image.width);
    this.globals_.LABELS.map( (label) => {this.draw_label(label, this.context, this.draw_ratio); });
    this.draw_overlay();
  }

  pan_up(amt) {
    this.transform[5] += amt;
    this.draw_canvas();
  }

  pan_down(amt) {
    this.transform[5] -= 50;
    this.draw_canvas();
  }

  pan_left(amt) {
    this.transform[4] += 50;
    this.draw_canvas();
  }

  pan_right(amt) {
    this.transform[4] -= 50;
    this.draw_canvas();
  }

  zoom_in(amt) {
    this.transform[0] *= amt;
    this.transform[1] *= amt;
    this.transform[2] *= amt;
    this.transform[3] *= amt;
    this.draw_canvas();
  }

  zoom_out(amt) {
    this.transform[0] /= amt;
    this.transform[1] /= amt;
    this.transform[2] /= amt;
    this.transform[3] /= amt;
    this.draw_canvas();
  }

  handle_scroll(e) {
    e.deltaY < 0 ? this.zoom_in(1.03) : this.zoom_out(1.03);
    this.draw_canvas(); 
  }
}

module.exports = Canvas;
