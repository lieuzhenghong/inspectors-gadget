'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

import core from 'mathjs/core';
let math = core.create();
math.import(require('mathjs/lib/type/matrix'));
math.import(require('mathjs/lib/function/matrix'));
import './style.css';
import './vex.css';
import './vex-theme-flat-attack.css';

import vex from 'vex-js';
vex.registerPlugin(require('vex-dialog'));
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

// My own imports
const Canvas_Helper = require('./Canvas');

class Label {
  constructor(id, x=null, y=null, title, caption='', defect=0,
  image) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.title = title;
    this.caption = caption;
    this.defect = defect;
    this.image = image;
  }

  toggle_defect() {
    console.log('hello');
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

function init() {
  // Set canvas dimensions
  let canvas = document.getElementById('c');
  canvas.width = 1000;
  canvas.height = Math.round(1000/Math.sqrt(2));
  document.getElementById('c').addEventListener('mousedown', handle_mousedown,
  false); 
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
  document.getElementById('plan-upload').addEventListener('change', (e) => {
    return upload_plan(e.target.files);
  });
  document.getElementById('batch-upload').addEventListener('change', (e) => {
    return upload_images(e.target.files);
  });
  document.getElementById('image-export').addEventListener('click', (e) => {
    return export_image(e.target);
  });
  document.getElementById('left').addEventListener('click', () => {
      globals.CVS.pan_left(50);
    });
  document.getElementById('right').addEventListener('click', () => {
    globals.CVS.pan_right(50);
    });
  document.getElementById('up').addEventListener('click', () => {
    globals.CVS.pan_up(50);
    });
  document.getElementById('down').addEventListener('click', () => {
    globals.CVS.pan_down(50);
    });
  document.getElementById('zoom-in').addEventListener('click', () => {
    globals.CVS.zoom_in(1.1);
    });
  document.getElementById('zoom-out').addEventListener('click', () => {
    globals.CVS.zoom_out(1.1);
    });
  // Handling the reply when we send the exported floor plan
  electron.ipcRenderer.on('export_image', (e, args) => {
    vex.dialog.alert(args);
  })
}


function upload_images(file_list) {
  // FileList has no method map nor forEach
  for (let i = 0; i < file_list.length; i++) {
    globals.LABELS.push(new Label(
      globals.ID,
      null,
      null, 
      globals.BUILDING + globals.FLOOR + '-' + (globals.ID).toString(),
      '',
      0,
      file_list[i]
    ));
    globals.ID++;
  }
  globals.CVS.draw_canvas();
  draw_table(globals.LABELS);
}

function update_labels(labels) {
  labels.map( (label) => {
    label.title = `${globals.BUILDING}${globals.FLOOR}-${label.id}`;
  })
}

function insert_row(label, tbody){
  function display_defect_emoji(img, defect) {
    if (defect === 0) { img.src = './assets/green_heart.png'; }
    else if (defect === 1) { img.src = './assets/yellow_diam.png'; }
    else { img.src = './assets/red_exclam.png'; }
  }
  const row = tbody.insertRow();
  row.id = label.id;
  row.addEventListener('mouseover', () => { return(preview_image(row.id)); });
  const c0 = row.insertCell(0);
  const c1 = row.insertCell(1);
  const c2 = row.insertCell(2);
  const c3 = row.insertCell(3);
  const c4 = row.insertCell(4);
  c1.addEventListener('click', edit_name);
  c0.innerHTML = label.id;
  c1.innerHTML = `<span class='editable'>${label.title}</span>`;
  c2.innerHTML = label.image.name;
  c3.innerHTML = `<img src="./assets/green_heart.png" height="32px">`;
  const img = c3.querySelector('img');
  display_defect_emoji(img, label.defect);
  img.addEventListener('click', () => {
    label.toggle_defect();
    display_defect_emoji(img, label.defect);
  });
  c4.innerHTML = '<a>X</a>';
  c4.addEventListener('click', () => {return delete_row(label.id); });
}

function draw_table(labels){
  const old_tbody = document.querySelector('tbody');
  const tbody = document.createElement('tbody');
  labels.map((label) => {
    return insert_row(label, tbody);
  });
  old_tbody.parentNode.replaceChild(tbody, old_tbody);
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
        draw_table(globals.LABELS);
      }
    }
  });
}

function delete_row(id) {
  _.remove_id(parseInt(id));
  globals.CVS.draw_canvas();
  draw_table(globals.LABELS);
}


function handle_mousedown(evt) {
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
    if (label !== undefined) {
      label.x = clicked_x;
      label.y = clicked_y;
      globals.CVS.draw_canvas();
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
        console.log(data);
        globals.CVS.image = img
        globals.BUILDING = data.letter;
        globals.FLOOR = data.floor;
        update_labels(globals.LABELS);
        globals.CVS.draw_canvas();
        draw_table(globals.LABELS);
        }
    })
  };
  img.src = URL.createObjectURL(plan_img);
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
  globals.CVS.draw_overlay(export_canvas, ctx);
  let buffer = canvasBuffer(export_canvas, 'image/png');
  electron.remote.getGlobal('data').exportedImage = buffer;
  electron.ipcRenderer.send('export_image', buffer);

  export_canvas.remove();
}

function preview_image(id) {
  // I purposely declared load_placeholder as a separate rather than a
  // anonymous function so that it would be clearer what the code did
  function load_placeholder(e){
    e.target.src = './assets/placeholder.png';
  }
  const file = _.find_id(parseInt(id)).image;
  const img = document.getElementById('img-preview');
  const reader = new FileReader();
  img.addEventListener('error', load_placeholder);
  reader.addEventListener("load", () => {  img.src = reader.result; });
  reader.readAsDataURL(file);
}

init();
