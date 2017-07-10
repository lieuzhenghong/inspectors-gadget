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
    return LABELS.find((ele) => {return ele.id === parseInt(id);});
  },
  remove_id: function(id) {
    return LABELS.splice(LABELS.findIndex(
      (ele) => {return ele.id === parseInt(id);}
      ), 1);
  }
};

const ct = require('./canvas_transforms');
//import ct from ('./canvas_transforms'); This line doesn't work, dunno why
const canvasBuffer = require('electron-canvas-to-buffer');
const electron = require('electron');

let BUILDING = '';  
let FLOOR = '';                   
let KEYS = [];
let LABELS = [];
let CLICKED_X = 0;
let CLICKED_Y = 0;
let IMAGE = null;
let ID = 1;
let canvas = null;
let CTX = null;
let WIDTH = 0;
let HEIGHT = 0;
let TRANSFORM = [1, 0, 0, 1, 0, 0];

class Label {
  constructor(id, x, y, title, defect, image) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.title = title;
    this.defect = defect;
    this.image = image;
  }

  toggle_defect() {
    this.defect = (this.defect + 1) % 3;
    draw_canvas(LABELS);
  }
}

function init() {
  // Set canvas dimensions
  canvas = document.getElementById('c');
  canvas.width = 1000;
  canvas.height = Math.round(1000/Math.sqrt(2));
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  document.getElementById('c').addEventListener('mousedown', handle_mousedown,
  false); 
  canvas.addEventListener('wheel', handle_scroll);
  let img = new Image();
  img.src = './assets/canvas_placeholder.png';
  IMAGE = img;
  CTX = document.getElementById('c').getContext('2d');
  draw_canvas(LABELS);
  window.onkeyup = (e) => {
    KEYS[e.keyCode] = false;
  };
  window.onkeydown = (e) => {
    KEYS[e.keyCode] = true;
    if (e.keyCode === 37) {
      ct.pan_left(TRANSFORM, 50);
      draw_canvas(LABELS); 
    }
    else if (e.keyCode === 38) {
      ct.pan_up(TRANSFORM, 50);
      draw_canvas(LABELS); 
    }
    else if (e.keyCode === 39) {
      ct.pan_right(TRANSFORM, 50);
      draw_canvas(LABELS); 
    }
    else if (e.keyCode === 40) {
      ct.pan_down(TRANSFORM, 50);
      draw_canvas(LABELS); 
    }
  };
  document.getElementById('plan-upload').addEventListener('change', (e) => {
    return get_plan(e.target.files);
  });
  document.getElementById('batch-upload').addEventListener('change', (e) => {
    return batch_upload(e.target.files);
  });
  document.getElementById('image-export').addEventListener('click', (e) => {
    return export_image(e.target);
  });
  document.getElementById('left').addEventListener('click', () => {
    ct.pan_left(TRANSFORM, 50);
    draw_canvas(LABELS);
    });
  document.getElementById('right').addEventListener('click', () => {
    ct.pan_right(TRANSFORM, 50);
    draw_canvas(LABELS);
    });
  document.getElementById('up').addEventListener('click', () => {
    ct.pan_up(TRANSFORM, 50);
    draw_canvas(LABELS);
    });
  document.getElementById('down').addEventListener('click', () => {
    ct.pan_down(TRANSFORM, 50);
    draw_canvas(LABELS);
    });
  document.getElementById('zoom-in').addEventListener('click', () => {
    ct.zoom_in(TRANSFORM, 1.1);
    draw_canvas(LABELS);
    });
  document.getElementById('zoom-out').addEventListener('click', () => {
    ct.zoom_out(TRANSFORM, 1.1);
    draw_canvas(LABELS);
    });
}

function handle_scroll(e) {
  console.log(e.deltaY, e.deltaX);
  e.deltaY > 0 ? ct.zoom_in(TRANSFORM, 1.01) : ct.zoom_out(TRANSFORM, 1.01);
  draw_canvas(LABELS); 
}

function batch_upload(file_list) {
  // FileList has no method map nor forEach
  for (let i = 0; i < file_list.length; i++) {
    LABELS.push(new Label(
      ID,
      null,
      null, 
      BUILDING + FLOOR + '-' + (ID).toString(),
      0,
      file_list[i]
    ));
    ID++;
  }
  draw_canvas(LABELS);
  draw_table(LABELS);
}

/*
 * I no longer need this function as I have removed the individual tag feature
function add_label(files) {
  if (files[0] !== undefined) {
    vex.dialog.prompt({
      message: 'Enter label title:',
      placeholder: 'A1-1',
      callback: (label_title) => {
        const label = new Label(
          ID, CLICKED_X, CLICKED_Y,
          label_title,
          0,
          files[0]
        );
        ID++;
        LABELS.push(label);
        draw_canvas(LABELS);
        insert_row(label, document.querySelector('tbody'));
        }
    })
  }
}
*/

function update_labels(labels) {
  labels.map( (label) => {
    label.title = `${BUILDING}${FLOOR}-${label.id}`;
  })
}

function draw_label(context, label) {
  const CTX = context;
  if (label.x !== null && label.y !== null) {
    CTX.textAlign = 'center';
    const wid = CTX.measureText(label.title).width;
    if (label.defect === 0) { CTX.fillStyle = 'rgba(0, 200, 0, 0.8)'; }
    else if (label.defect === 1) { CTX.fillStyle = 'rgba(255, 200, 0, 0.9)'; }
    else { CTX.fillStyle = 'rgba(255, 0, 0, 0.8)'; }
    // Dictates minimum label width
    CTX.fillRect(label.x-(wid+10)/2, 
                 label.y-(20/2),
                 (wid+10 > 40? wid+10 : 40),
                 20
                );
    CTX.strokeRect(label.x-(wid+10)/2,
                   label.y-(20/2),
                   (wid+10 > 40? wid+10 : 40),
                   20
                  );
    CTX.fillStyle = 'rgba(0, 0, 0, 1)';
    CTX.font = '12px sans-serif';
    CTX.textBaseline = 'middle';
    CTX.fillText(label.title, label.x, label.y);
  }
}

function draw_canvas(LABELS) {
  CTX.clearRect(0, 0, 9999, 9999); // This code can break if image > 9999x9999
  CTX.setTransform.apply(CTX, TRANSFORM);
  CTX.save();
  CTX.drawImage(IMAGE, 0, 0);
  LABELS.map( (label) => { draw_label(CTX, label); });

  // Clear the transform to draw the overlay
  CTX.setTransform.apply(CTX, [1, 0, 0, 1, 0, 0]);
  CTX.fillStyle = 'rgba(200, 200, 200, 0.6)';
  CTX.fillRect(0, canvas.height-30, canvas.width, 30)
  CTX.fillStyle = 'rgba(0, 0, 0, 1)';
  CTX.font = '20px sans-serif';
  CTX.textBaseline = 'middle';
  let text = `Building ${BUILDING} ${FLOOR}`;
  let textwidth = CTX.measureText(text).width;
  CTX.fillText(text, (canvas.width-textwidth)/2, canvas.height-30/2);
  
  // Restore the previous transform
  CTX.restore();
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

function draw_table(LABELS){
  const old_tbody = document.querySelector('tbody');
  const tbody = document.createElement('tbody');
  LABELS.map((label) => {
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
        draw_canvas(LABELS);
        draw_table(LABELS);
      }
    }
  });
}

function delete_row(id) {
  _.remove_id(parseInt(id));
  draw_canvas(LABELS);
  draw_table(LABELS);
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
  let t = TRANSFORM;
  t = math.reshape([t[0], t[2], t[4], t[1], t[3], t[5]], [2,3]);
  t = math.reshape(t.concat(0,0,1), [3,3]);
  const inv = math.inv(t);

  CLICKED_X = evt.offsetX * inv[0][0] + evt.offsetY * inv[0][1] + inv[0][2];
  CLICKED_Y = evt.offsetX * inv[1][0] + evt.offsetY * inv[1][1] + inv[1][2];

  // If right click, go to tag editing mode
  if (evt.button === 2 || evt.shiftKey) {
    vex.dialog.prompt({
      message: 'Enter ID of label: ',
      callback: (value) => {
        let label = _.find_id(parseInt(value));
        if (label !== undefined) {
          label.x = CLICKED_X;
          label.y = CLICKED_Y;
          draw_canvas(LABELS);
        }
      }
    })
  }

  // If the left mouse button was clicked, find the first label that has yet to
  // be tagged on the floor plan
  else if (evt.button === 0) {
    let label = LABELS.find( (label) => {return label.x === null});
    if (label !== undefined) {
      label.x = CLICKED_X;
      label.y = CLICKED_Y;
      draw_canvas(LABELS);
    }
  }
  
  else {
    //There should be nothing here
  }
}

function get_plan(file_list) {
  const plan_img = file_list[0];
  let img = new Image();
  img.onload = () => {
    IMAGE = img;
    vex.dialog.open({
      message: 'Enter building letter and floor',
      input: [
        "<input name='letter' type='text' placeholder='Letter'/>",
        "<input name='floor' type='number' placeholder='Floor'/>",
      ].join(''),
      callback: (data) => {
        console.log(data);
        BUILDING = data.letter;
        FLOOR = data.floor;
        update_labels(LABELS);
        draw_canvas(LABELS);
        draw_table(LABELS);
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
  const max_x = IMAGE.width;
  const max_y = IMAGE.height;
  let ratio = 1;

  if (max_x > working_width || max_y > working_height) {
    let xratio = working_width / max_x;
    let yratio = working_height / max_y; 
    ratio = Math.min(xratio, yratio);
  }

  const x_offset = (export_canvas.width - max_x * ratio) / 2;
  const y_offset = (export_canvas.height - max_y * ratio) / 2;

  let temp_labels = LABELS;
  temp_labels.map( (label) => { 
    label.x = label.x * ratio + x_offset;
    label.y = label.y * ratio + y_offset;
  });
  ctx.drawImage(IMAGE, 0, 0, IMAGE.width, IMAGE.height,
                       x_offset, y_offset, IMAGE.width * ratio,
                       IMAGE.height * ratio);
  
  temp_labels.map( (label) => { draw_label(ctx, label); });
  // as a buffer
  let buffer = canvasBuffer(export_canvas, 'image/png');
  electron.remote.getGlobal('data').exportedImage = buffer;
  electron.ipcRenderer.send('export_image', buffer);

  /*
  e.href = export_canvas.toDataURL("image/png");
  e.download = 'exported_plan.png';
  */
  export_canvas.remove();
}


function generate_table() {
}

/*
function export_table() {
  const table_win = window.open('', 'table_window');
  let table = table_win.document.createElement("table"); 
  LABELS.map( (label) => {
    let tr = table_win.document.createElement('tr');
    table.appendChild(tr);
    let td = table_win.document.createElement('td');
    tr.appendChild(td);
    td.innerHTML1 = label.title;
    td = table_win.document.createElement('td');
    tr.appendChild(td);
    td.innerHTML1 = label.defect;
    td = table_win.document.createElement('td');
    tr.appendChild(td);
    td.innerHTML1 = label.image.name;
  });
  table_win.document.body.insertBefore(table, null);
}
*/

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

