'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

import core from 'mathjs/core';
let math = core.create();
math.import(require('mathjs/lib/type/matrix'));
math.import(require('mathjs/lib/function/matrix'));

import './styles/style.css';
import './styles/tag-tables.css';
import './styles/export-table.css';
import './styles/vex.css';
import './styles/vex-theme-flat-attack.css';

import vex from 'vex-js'; vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-flat-attack';

const _ = {
  find_id: function(id) {
    return globals.LABELS.find((ele) => {return ele.id === parseInt(id);});
  },
  remove_id: function(id) {
    return globals.LABELS.splice(globals.LABELS.findIndex(
      (ele) => {return ele.id === parseInt(id);}
      ), 1);
  }
};

const canvasBuffer = require('electron-canvas-to-buffer');
const electron = require('electron');
import Vue from 'vue';

// My own imports
const Canvas_Helper = require('./lib/Canvas');
const jsPDF = require('./lib/jspdf.min');
const html2canvas = require('./lib/html2canvas.min');
const html2pdf = require('./lib/html2pdf');
const htmlpdf = html2pdf(html2canvas, jsPDF);

class Label {
  constructor(id, x=null, y=null, title, caption='', defect=0,
  src, image) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.title = title;
    this.caption = caption;
    this.defect = defect;
    this.image_src = src;
    this.image = image;
  }

  toggle_defect() {
    this.defect = (this.defect + 1) % 3;
    globals.CVS.draw_canvas();
  }
}

let globals = {
  BUILDING : '',  
  FLOOR : '',                   
  KEYS : [],
  LABELS : [],
  ID : 1,
  CVS : null
};

let vue = new Vue({
  el: '.wrapper',
  data: {
    seen: true,
    labels: globals.LABELS,
    preview_src: './assets/placeholder.png',
  },
  methods: {
    defect_src: function (label) {
      return (label.defect == 0 ? './assets/no_defect.png' : label.defect ===
      1 ? './assets/non-structural.png' : './assets/structural.png')
    },
    show: function() {
      document.getElementById('nav_page_1').className = 'active';
      document.getElementById('nav_page_2').className = '';
      this.seen = true;
    },
    hide: function() {
      document.getElementById('nav_page_1').className = '';
      document.getElementById('nav_page_2').className = 'active';
      this.seen = false;
    },
    upload_plan: function(files) {
      //console.log(files);
      upload_plan(files);
    },
    upload_images: function(files) {
      upload_images(files);
    },
    export_image: function(file) {
      export_image(file);
    },
    export_table: function() {
      export_table();
    },

    // The following functions are for the tables
    toggle_defect: function(label) {
      label.toggle_defect();
    },
    edit_label_name: function(e_target) {
      edit_name(e_target)
    },
    handle_mousedown: function(e) {
      handle_mousedown(e);
    },
    handle_mouseover: function(label, index) {
       this.preview_src = label.image_src; 
    },
    delete_row: function(label) {
      delete_row(label.id) 
    }
  }
})

function init() {
  // Set canvas dimensions
  let canvas = document.getElementById('c');
  //console.log(window.innerWidth);
  window.addEventListener('resize', () => {
    //console.log('called');
    if (window.innerWidth === 1920) {
      canvas.width = 1400;
      canvas.height = 900;
    }
    else if (window.innerWidth > 1400) {
      canvas.width = 1000;
      canvas.height = 707;
    }
    else {
      canvas.width = 800;
      canvas.height = 566;
    }
  })
  let img = new Image();
  img.src = './assets/canvas_placeholder.png';
  let ctx = document.getElementById('c').getContext('2d');
  // Set the Canvas helper context to the global canvas context
  globals.CVS = new Canvas_Helper(canvas, [1,0,0,1,0,0], globals, img);
  // This line is necessary: set cvs.labels to point to the global object LABELS
  globals.CVS.globals_ = globals;
  canvas.addEventListener('wheel', globals.CVS.handle_scroll.bind(globals.CVS));
  globals.CVS.draw_canvas();
  window.onkeyup = (e) => {
    globals.KEYS[e.keyCode] = false;
  };
  window.onkeydown = (e) => {
    globals.KEYS[e.keyCode] = true;
    if (e.keyCode === 37) { globals.CVS.pan_left(50); }
    else if (e.keyCode === 38) { globals.CVS.pan_up(50); }
    else if (e.keyCode === 39) { globals.CVS.pan_right(50); }
    else if (e.keyCode === 40) { globals.CVS.pan_down(50); }
  };
  // Handling the reply when we send the exported floor plan
  electron.ipcRenderer.on('export_image', (e, args) => {
    vex.dialog.alert(args);
  })
}


function edit_name(e) {
  vex.dialog.open({
    message: 'Enter new name for label:',
    input: '<input type="text" name="label_name" placeholder="Label name"/>',
    callback: (val) => {
      val = val.label_name;
      if (val !== '' && val !== undefined) {
        e.target.value = val;
        const id = e.target.closest('tr').id;
        const label = _.find_id(id);
        label.title = val.toString();
        globals.CVS.draw_canvas();
        //draw_table(globals.LABELS);
      }
    }
  });
}

function delete_row(id) {
  _.remove_id(parseInt(id));
  globals.CVS.draw_canvas();
  //draw_table(globals.LABELS);
}


function handle_mousedown(evt) {
  /*
  let math = {
    reshape: (m, dim) => {
      let n = [];
      for (let y = 0; y < (dim[0]); y++) {
        let row = [];
        for (let x = 0; x < (dim[1]); x++) {
           row.push(m[y*x]); 
        }
        n.push(row)
      }
      return n
    },
    inv: (m) => {
      return m
    }
  }
  */
  // Matrix multiplication of affine transformation vector and mouse 
  // vector. Augmentation is required: see
  // https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
  /*
  [x' y' 1] = [1 0 Tx
                0 1 Ty
                0 0 1 ] [x y 1]
  */

  // These 6 lines take up 500Kb.... ridiculous
  let t = globals.CVS.transform;
  t = math.reshape([t[0], t[2], t[4], t[1], t[3], t[5]], [2,3]);
  t = math.reshape(t.concat(0,0,1), [3,3]);
  const inv = math.inv(t);

  let clicked_x = evt.offsetX * inv[0][0] + evt.offsetY * inv[0][1] + inv[0][2];
  let clicked_y = evt.offsetX * inv[1][0] + evt.offsetY * inv[1][1] + inv[1][2];

  // If right click, go to tag editing mode
  if (evt.button === 2 || evt.shiftKey) {
    vex.dialog.prompt({
      message: 'Enter ID of label: ',
      callback: (value) => {
        let label = _.find_id(parseInt(value));
        if (label !== undefined) {
          label.x = clicked_x;
          label.y = clicked_y;
          globals.CVS.draw_canvas();
        }
      }
    })
  }

  // If the left mouse button was clicked, find the first label that has yet to
  // be tagged on the floor plan
  else if (evt.button === 0) {
    let label = globals.LABELS.find( (label) => {return label.x === null});
    let new_label = true;

    const draw_ratio = globals.CVS.draw_ratio;
    // WARNING //
    const font_size = 60 / draw_ratio; 
    // We must do that so that ctx.measureText can work
    globals.CVS.context.font = `${font_size}px sans-serif`;
    // Watch out: every time I tweak font size in Canvas.js, I need to change
    // this

    for (let label of globals.LABELS) {
      const wid = globals.CVS.context.measureText(label.title).width;
      const ht = font_size;
      const l_w = (wid + 10/draw_ratio)
      const l_h = (ht + 10/draw_ratio)
      const lx = label.x - l_w/2;
      const uy = label.y - l_h/2;
      const rx = label.x + l_w + l_w/2;
      const ly = label.y + l_h/2;
      //console.log(lx, clicked_x, rx);
      //console.log(uy, clicked_y, ly);
      
      if (clicked_x > lx && clicked_x < rx && 
          clicked_y > uy && clicked_y < ly)
      {
        //console.log('Label found', label);
        vue._data.preview_src = label.image_src;
        new_label = false;
        break;
      }
    }
  
    if (label !== undefined && new_label === true) {
      label.x = clicked_x;
      label.y = clicked_y;
      globals.CVS.draw_canvas();

      // Show the next image in preview
      let next_label = _.find_id(parseInt(label.id + 1));
      if (next_label !== undefined) {
        console.log(vue._data);
        console.log(next_label.id);
        vue._data.preview_src = next_label.image_src;
      }
    }
  }

  else {
    //There should be nothing here
  }
}

function upload_plan(file_list) {
  const plan_img = file_list[0];
  let img = new Image();
  img.onload = () => {
    vex.dialog.open({
      message: 'Enter building letter and floor',
      input: [
        "<input name='letter' type='text' placeholder='Letter'/>",
        "<input name='floor' type='number' placeholder='Floor'/>",
      ].join(''),
      callback: (data) => {
        globals.CVS.image = img
        if (data === undefined) {
          globals.BUILDING = A;
          globals.FLOOR = 1;
        }
        else {
          globals.BUILDING = data.letter;
          globals.FLOOR = data.floor;
        }
        update_labels(globals.LABELS);
        globals.CVS.draw_canvas();
        //draw_table(globals.LABELS);
        }
    })
  };
  img.src = URL.createObjectURL(plan_img);
}

function upload_images(file_list) {
  // FileList has no method map nor forEach
  for (let i = 0; i < file_list.length; i++) {
    const file = file_list[i];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      globals.LABELS.push(new Label(
        globals.ID,
        null,
        null, 
        globals.BUILDING + globals.FLOOR + '-' + (globals.ID).toString(),
        '',
        0,
        reader.result,
        file_list[i]
      ));
      globals.ID++;
      globals.CVS.draw_canvas();
      //draw_table(globals.LABELS);
    });
    reader.readAsDataURL(file);
  }
}

function update_labels(labels) {
  labels.map( (label) => {
    label.title = `${globals.BUILDING}${globals.FLOOR}-${label.id}`;
  })
}
function export_image(e) {
  const export_canvas = document.createElement('canvas');
  export_canvas.height = 3000;
  export_canvas.width = Math.round(export_canvas.height * Math.sqrt(2));
  const ctx = export_canvas.getContext('2d');
  ctx.clearRect(0, 0, export_canvas.height, export_canvas.width); 

  // Rescale image such that the largest dimension of the image fits nicely
  const working_height = export_canvas.height - 200;
  const working_width = export_canvas.width - 200;
  const max_x = globals.CVS.image.width;
  const max_y = globals.CVS.image.height;
  let ratio = 1;

  let xratio = working_width / max_x;
  let yratio = working_height / max_y; 
  ratio = Math.min(xratio, yratio);

  const x_offset = (export_canvas.width - max_x * ratio) / 2;
  const y_offset = (export_canvas.height - max_y * ratio) / 2;

  // make a deep copy of LABELS so as not to mutate it
  let temp_labels = JSON.parse(JSON.stringify(globals.LABELS));
  temp_labels.map( (label) => { 
    label.x = label.x * ratio + x_offset;
    label.y = label.y * ratio + y_offset;
  });
  ctx.drawImage(globals.CVS.image, 0, 0, globals.CVS.image.width, globals.CVS.image.height,
                       x_offset, y_offset, globals.CVS.image.width * ratio,
                       globals.CVS.image.height * ratio);

  // These ratios are how much to scale the labels and overlay to the enlarged
  // canvas
  let x_ratio = working_height / globals.CVS.image.height;
  let y_ratio = working_width / globals.CVS.image.width;
  let draw_ratio = Math.min(x_ratio, y_ratio);
  draw_ratio = 1;

  temp_labels.map( (label) => { globals.CVS.draw_label(label, ctx, draw_ratio); });
  vex.dialog.open({
    message: 'Enter building overlay text',
    input: "<input name='letter' type='text' placeholder='Building A Level 1'/>",
    callback: (text) => {
      if (text === undefined) {
        globals.CVS.draw_overlay(export_canvas, ctx);
      }
      else {
        globals.CVS.draw_overlay(export_canvas, ctx, text.letter);
      }
      let buffer = canvasBuffer(export_canvas, 'image/png');
      electron.remote.getGlobal('data').exportedImage = buffer;
      electron.ipcRenderer.send('export_image', buffer);
      export_canvas.remove(); // Garbage collection
    }
  });
}


function export_table() {
  var element = document.getElementById('export-table');
  htmlpdf(element, {
      margin:       0,
      filename:     'export.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { dpi: 192, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' }
    });
}

init();
