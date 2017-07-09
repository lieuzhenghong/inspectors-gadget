'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

import _find from 'lodash/find';
import _remove from 'lodash/remove';

import core from 'mathjs/core';
const math = core.create();
math.import(require('mathjs/lib/type/matrix'));

import './style.css';

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
  canvas.width = 800;
  canvas.height = Math.round(800/Math.sqrt(2));
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  document.getElementById('c').addEventListener('click', onClick, false); 
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
    if (e.keyCode === 87) { pan_up(); }
    else if (e.keyCode === 83) { pan_down(); }
    else if (e.keyCode === 65) { pan_left(); }
    else if (e.keyCode === 68) { pan_right(); }
    else if (e.keyCode === 69) { zoom_in(); }
    else if (e.keyCode === 82) { zoom_out(); }
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
  document.getElementById('image-tag').addEventListener('change', (e) => {
    return handletagImg(e.target.files);
  });
  document.getElementById('left').addEventListener('click', pan_left);
  document.getElementById('right').addEventListener('click', pan_right);
  document.getElementById('down').addEventListener('click', pan_down);
  document.getElementById('up').addEventListener('click', pan_up);
  document.getElementById('zoom-in').addEventListener('click', zoom_in);
  document.getElementById('zoom-out').addEventListener('click', zoom_out);
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

function handletagImg(files) {
  let label = new Label(
    ID, CLICKED_X, CLICKED_Y,
    window.prompt('Enter label title:'),
    0,
    files[0]
  );
  ID++;
  LABELS.push(label);
  draw_canvas(LABELS);
  insert_row(label, document.querySelector('tbody'));
}

function draw_label(label) {
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
  LABELS.map( (label) => { draw_label(label); });
}

function insert_row(label, tbody){
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
  c1.innerHTML = "<span class='editable'>" + label.title + "</span>";
  c2.innerHTML = label.image.name;
  c3.innerHTML = '<img src="./assets/green_heart.png" height="32px">';
  const img = c3.querySelector('img');
  img.addEventListener('click', () => {
    label.toggle_defect();
    if (label.defect == 0) { img.src = './assets/green_heart.png'; }
    else if (label.defect == 1) { img.src = './assets/yellow_diam.png'; }
    else { img.src = './assets/red_exclam.png'; }
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
  let val = window.prompt('Edit name:');
  if (val !== '') {
    const id = e.target.closest('tr').id;
    console.log('id: ', id);
    let label = _find(LABELS, ['id', parseInt(id)]);
    console.log(label);
    label.title = val;
    draw_canvas(LABELS);
    draw_table(LABELS);
  }
}

function delete_row(id) {
   _remove(LABELS, ['id', parseInt(id)]);
  draw_canvas(LABELS);
  draw_table(LABELS);
}

function onClick(evt) {
  // Matrix multiplication of affine transformation vector and mouse 
  // vector. Augmentation is required: see
  // https://en.wikipedia.org/wiki/Transformation_matrix#Affine_transformations
  /*
  [x' y' 1] = [1 0 Tx
                0 1 Ty
                0 0 1 ] [x y 1]
  */
  let t = TRANSFORM;
  t = math.reshape([t[0], t[2], t[4], t[1], t[3], t[5]], [2,3]);
  t = math.reshape(t.concat(0,0,1), [3,3]);
  const inv = math.inv(t);
          
  CLICKED_X = evt.x * inv[0][0] + evt.y * inv[0][1] + inv[0][2];
  CLICKED_Y = evt.x * inv[1][0] + evt.y * inv[1][1] + inv[1][2];

  console.log(evt.x, evt.y, CLICKED_X, CLICKED_Y);
  // If Shift key is held down, go to tag-editing mode
  if (KEYS[16]) {
    let id = window.prompt('Enter id of label: ');
    let label = _find(LABELS, ['id', parseInt(id)]);
    if (label === undefined) {
      window.alert('Bad ID.');
    }
    else {
      label.x = CLICKED_X;
      label.y = CLICKED_Y;
      // Redraw
      draw_canvas(LABELS);
    }
  }
  else {
    // Upload an image
    document.getElementById('image-tag').click();
  }
}

function get_plan(file_list) {
  const plan_img = file_list[0];
  let img = new Image();
  img.onload = () => {
    IMAGE = img;
    console.log(IMAGE.height, IMAGE.width);
    draw_canvas(LABELS);
    BUILDING = window.prompt('Enter building letter (e.g. A)');
    FLOOR = window.prompt('Enter building floor (e.g. 1)');
  };
  img.src = URL.createObjectURL(plan_img);
}

function export_image(e) {
  let image = canvas.toDataURL("image/png");
  e.href = image;
}

function preview_image(id) {
  // I purposely declared load_placeholder as a separate rather than a
  // anonymous function so that it would be clearer what the code did
  function load_placeholder(e){
    e.target.src = './assets/placeholder.png';
  }
  const file = _find(LABELS, ['id', parseInt(id)]).image;
  const img = document.getElementById('img-preview');
  const reader = new FileReader();
  img.addEventListener('error', load_placeholder);
  reader.addEventListener("load", () => {  img.src = reader.result; });
  reader.readAsDataURL(file);
}

function pan_up() {
  TRANSFORM[5] += 50;
  draw_canvas(LABELS);
}

function pan_down() {
  TRANSFORM[5] -= 50;
  draw_canvas(LABELS);
}

function pan_left() {
  TRANSFORM[4] += 50;
  draw_canvas(LABELS);
}

function pan_right() {
  TRANSFORM[4] -= 50;
  draw_canvas(LABELS);
}

function zoom_in() {
  TRANSFORM[0] *= 1.1;
  TRANSFORM[1] *= 1.1;
  TRANSFORM[2] *= 1.1;
  TRANSFORM[3] *= 1.1;
  draw_canvas(LABELS);
}

function zoom_out() {
  TRANSFORM[0] /= 1.1;
  TRANSFORM[1] /= 1.1;
  TRANSFORM[2] /= 1.1;
  TRANSFORM[3] /= 1.1;
  draw_canvas(LABELS);
}

init();
