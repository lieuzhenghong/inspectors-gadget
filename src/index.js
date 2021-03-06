'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

import localforage from 'localforage';
import core from 'mathjs/core';
let math = core.create();
math.import(require('mathjs/lib/type/matrix'));
math.import(require('mathjs/lib/function/matrix'));

import './styles/style.css';
import './styles/tag-tables.css';
import './styles/export-table.css';
import './styles/data-and-saves-page.css';
import './styles/vex.css';
import './styles/vex-theme-flat-attack.css';
import vex from 'vex-js'; vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-flat-attack';

const canvasBuffer = require('electron-canvas-to-buffer');
const electron = require('electron');
import Vue from 'vue';

// My own imports
const Canvas_Helper = require('./lib/Canvas');
const jsPDF = require('./lib/jspdf.min');
const html2canvas = require('./lib/html2canvas.min');
const html2pdf = require('./lib/html2pdf');
const htmlpdf = html2pdf(html2canvas, jsPDF);

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

const local_db = {
  // create_instance :: String -> Instance
  // Creates a new instance, logs it in a instances database and returns the
  // created instance.
  create_instance: (instance_name) => {
    const instances_db = localforage.createInstance({
      name: 'instances'
    });
    
    instances_db.getItem('instances').then((instances) => {
      if (instances === null) {
        instances_db.setItem('instances', [instance_name]);
      }
      else {
        // Concatenate the new instance if and only if it's unique
        let unique = true;
        for (let instance of instances) {
          if (instance === instance_name) { unique = false; }
        }
        if (unique) {
          const new_instances = instances.concat([instance_name]);
          instances_db.setItem('instances', new_instances);
        }
      }
    });

    return localforage.createInstance({name: instance_name});
  },

  // get_instance :: String -> Instance
  get_instance: (instance_name) => {
    const instance = localforage.createInstance({
      name: instance_name
    });
    
    return instance;
  },

  // get_instance_names :: None -> Promise -> [String]
  get_instance_names: () => {
    const instances_db = localforage.createInstance({
      name: 'instances'
    });

    return instances_db.getItem('instances');
  }
};

class Label {
  constructor(id, x=null, y=null, title, caption='', defect=0, src, image) {
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
  PLAN: '',
  KEYS : [],
  LABELS : [],
  ID : 1,
  CVS : null
};

let vue = new Vue({
  el: '.wrapper',
  data: {
    seen: 0,
    labels: globals.LABELS,
    preview_src: './assets/placeholder.png',
    building: globals.BUILDING,
    floor: globals.FLOOR,
    save_preview_src: './assets/placeholder.png',
    saves: ''
  },
  created: function() {
    this.saves = this.update_saves();
  },
  computed: {
    defective_labels: function() {
      return (this.labels.filter((label) => {return label.defect > 0;}));
    },
  },
  methods: {
    update_labels: function(labels) {
      labels.map( (label) => {
        label.title = `${globals.BUILDING}${globals.FLOOR}-${label.id}`;
      });
    },
    update_saves: function() {
      // returns a promise, doesn't work
      local_db.get_instance_names().then(instance_names => {
        this.saves = instance_names;
      });
    },
    handle_save_mouseover: function(save) {
      local_db.get_instance(save).getItem('plan').then((value) => {
        this.save_preview_src = value;
      });
    },
    rename_save: function(save) {
      // Renaming a save is quite involved
      // 1. Prompt for new name of save
      // 2. Create a new instance
      // 3. Populate the new instance with the values of the old instance
      // 4. Add a pointer to the new instance in instances_db
      // 5. Delete the old instance and the pointer to it in instances_db
      const instance = local_db.get_instance(save);
      vex.dialog.prompt({
        message: 'Enter new name for save. If save name already exists, ' +
                 'it will override the previous save!',
        callback: (new_name) => {
          const new_instance = localforage.createInstance({
            name: new_name
          });
          instance.iterate( (value, key) => {
            new_instance.setItem(key, value);
          });
          // Add pointer to the new save in index_db
          const instances_db = localforage.createInstance({
            name: 'instances'
          });
          instances_db.getItem('instances').then((instances) => {
            instances_db.setItem('instances', instances.concat(new_name));
            // Clear the old key and the reference to it in instances_db
            this.delete_instance(save);
            this.update_saves();
          });
        }
      });
    },
    reset_ids: function() {
      for (let i = 0; i < this.labels.length; i++) {
        let label = this.labels[i];
        label.id = i+1;
      }
    },
    sort_data: function(sort_by) {
      if (typeof(this.labels[sort_by]) === 'number') {
        this.labels.sort( (a,b) => {
          return (a[sort_by] - b[sort_by]);
        })
      }
      else if (sort_by === 'filename') {
        this.labels.sort ((a, b) => {
          let A = a.image.name;
          let B = b.image.name;
          if (A < B) { return -1 }
          if (A > B) { return 1 }
          return 0
        })
      }
      else {
        this.labels.sort ((a, b) => {
          let A = a[sort_by];
          let B = b[sort_by];
          if (A < B) { return -1 }
          if (A > B) { return 1 }
          return 0
        })
      }
    },
    defect_text: function(label) {
      return (label.defect === 0 ? 'ND' : label.defect === 1 ?
        'NS' : 'S');
    },
    defect_src: function (label) {
      return (label.defect == 0 ?
        './assets/no_defect.png' : label.defect === 1 ?
          './assets/non-structural.png' : './assets/structural.png');
    },
    show: function(element) {
      const elements = ['nav_page_1', 'nav_page_2', 'nav_page_3'];
      for (let i = 0; i < elements.length; i++) {
        if (i === element) {
          document.getElementById(elements[i]).classList.add('active');
        }
        else {
          document.getElementById(elements[i]).classList.remove('active');
        }
      }
      this.seen = element;
    },
    toggle: function() {
      this.seen = (this.seen + 1) % 3;
      this.show(this.seen); 
    },
    upload_plan: function(files) {
      const plan = files[0];
      const reader = new FileReader();
      let img = new Image();
      reader.addEventListener('load', () => {
        vex.dialog.open({
          message: 'Enter building letter and floor',
          input: [
            '<input name=\'letter\' type=\'text\' placeholder=\'Letter\'/>',
            '<input name=\'floor\' type=\'number\' placeholder=\'Floor\'/>',
          ].join(''),
          callback: (data) => {
            if (data.letter === undefined) {
              this.BUILDING ='A';
            }
            if (data.floor === undefined) {
              this.FLOOR = '1';
            }
            else {
              this.building = data.letter;
              this.floor = data.floor;
              this.update_labels(globals.LABELS);
            }
            img.src = reader.result;
            globals.CVS.image = img;
            globals.PLAN = reader.result;
            globals.CVS.draw_canvas();
          }
        });
      });
      reader.readAsDataURL(plan);
    },
    upload_images: function(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          globals.LABELS.push(new Label(
            globals.ID,
            null,
            null, 
            globals.BUILDING + globals.FLOOR + '-' + (globals.ID).toString(),
            '',
            0,
            reader.result,
            files[i]
          ));
          globals.ID++;
          globals.CVS.draw_canvas();

          // Sort labels
          if (i === files.length-1) { // All images have uploaded
            // Sort all images in name order
            globals.LABELS = globals.LABELS.sort( (a,b) => {
              if (a.image.name > b.image.name) {
                return 1;
              }
              else if (a.image.name < b.image.name) {
                return -1;
              }
              else {
                return 0;
              }
            });
            // Reassign labels to match sort order
            for (let j = 0; j < globals.LABELS.length; j++) {
              globals.LABELS[j].id = j+1;
            }
            this.update_labels(globals.LABELS);
          }

        });
        reader.readAsDataURL(file);
      }
    },
    export_image: function() {
      const export_canvas = document.createElement('canvas');
      const ctx = export_canvas.getContext('2d');
      export_canvas.height = 3000;
      export_canvas.width = Math.round(export_canvas.height * Math.sqrt(2));
      ctx.clearRect(0, 0, export_canvas.height, export_canvas.width); 

      // Rescale image such that the largest dimension of the image fits nicely
      const working_height = export_canvas.height - 200;
      const working_width = export_canvas.width - 200;
      const max_x = globals.CVS.image.width;
      const max_y = globals.CVS.image.height;
      const xratio = working_width / max_x;
      const yratio = working_height / max_y; 
      const ratio = Math.min(xratio, yratio);
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

      temp_labels.map( (label) => { globals.CVS.draw_label(label, ctx, 1); });
      vex.dialog.open({
        message: 'Enter building overlay text',
        input: '<input name=\'letter\' type=\'text\' placeholder=\'Building A Level 1\'/>',
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
    },
    export_table: function() {
      var element = document.getElementById('export-table');
      htmlpdf(element, {
        margin:       0,
        filename:     'export.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { dpi: 192, letterRendering: true },
        jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' }
      });
    },
    // The following functions are for the tables
    toggle_defect: function(label) {
      label.toggle_defect();
    },
    edit_label_name: function(e) {
      vex.dialog.open({
        message: 'Enter new name for label:',
        input: '<input type="text" name="label_name" placeholder="Label name"/>',
        callback: (val) => {
          val = val.label_name;
          if (val !== '' && val !== undefined) {
            e.innerHTML = val;
            const id = e.closest('tr').id;
            const label = _.find_id(id);
            label.title = val.toString();
            globals.CVS.draw_canvas();
            //draw_table(globals.LABELS);
          }
        }
      });
    },
    handle_mousedown: function(evt) {
      function label_clicked(clicked_x, clicked_y, font_size, draw_ratio) {
        let return_label = null;
        for (let label of globals.LABELS) {
          const wid = globals.CVS.context.measureText(label.title).width;
          const ht = font_size;
          const l_w = (wid + 10/draw_ratio);
          const l_h = (ht + 10/draw_ratio);
          const lx = label.x - l_w/2;
          const uy = label.y - l_h/2;
          const rx = label.x + l_w + l_w/2;
          const ly = label.y + l_h/2;
          
          if (clicked_x > lx && clicked_x < rx && clicked_y > uy &&
                    clicked_y < ly)
          {
            return_label = label; 
            break;
          }
        }
        return return_label;
      }
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
        });
      }

      // If the left mouse button was clicked, find the first label that has yet to
      // be tagged on the floor plan
      else if (evt.button === 0) {
        let label = globals.LABELS.find( (label) => {return label.x === null;});
        const draw_ratio = globals.CVS.draw_ratio;
        // WARNING //
        const font_size = 60 / draw_ratio; 
        // We must do that so that ctx.measureText can work
        globals.CVS.context.font = `${font_size}px sans-serif`;
        // Watch out: every time I tweak font size in Canvas.js, I need to change
        // this
        let clicked_label = label_clicked(clicked_x, clicked_y, font_size,
          draw_ratio);
        
        if (label !== undefined && clicked_label === null) { // No label clicked
          label.x = clicked_x;
          label.y = clicked_y;
          globals.CVS.draw_canvas();

          // Show the next image in preview, if one exists
          let next_label = _.find_id(parseInt(label.id + 1));
          if (next_label !== undefined) {
            this.preview_src = next_label.image_src;
          }
        }
        // No label present and no clicked label
        else if (clicked_label === null) {  
          //Do nothing
        }
        else {
          this.preview_src = clicked_label.image_src;
        }
      }

      else {
        //There should be nothing here
      }
    },
    handle_mouseover: function(label) {
      this.preview_src = label.image_src; 
    },
    delete_row: function(label) {
      _.remove_id(parseInt(label.id));
      globals.CVS.draw_canvas();
    },
    clear_dbs: function() {
      const instances_db = localforage.createInstance({
        name: 'instances'
      });
      instances_db.getItem('instances').then((instances) => {
        if (instances !== null) {
          for (let instance_name in instances) {
            local_db.get_instance(instance_name).clear(); 
          }
        }
      });
      instances_db.clear().then(() => this.update_saves()); 
    },
    delete_instance: function(db_name) {
      const instances_db = localforage.createInstance({
        name: 'instances'
      });
      instances_db.getItem('instances').then((instances) => {
        let idx = instances.indexOf(db_name);
        let new_instances = instances;
        new_instances.splice(idx, 1);
        instances_db.setItem('instances', new_instances).then(() => {
          local_db.get_instance(db_name).clear();
          this.update_saves();
        });
      });
    },
    save_data: function(db_name = new Date().toISOString()) {
      const db = local_db.create_instance(db_name);
      let p1 = db.setItem('building', globals.BUILDING);
      let p2 = db.setItem('floor', globals.FLOOR);
      let p3 = db.setItem('labels', globals.LABELS);
      let p4 = db.setItem('id', globals.ID);
      let p5 = db.setItem('plan', globals.PLAN);

      Promise.all([p1, p2, p3, p4, p5]).then(() => {
        this.update_saves();
      });
    },
    load_data: function (db_name) {
      let db = local_db.get_instance(db_name);

      db.getItem('building').then((value) => {
        this.building = value;
        // I have watchers on both building and floor so I don't have to
        // update globals.BUILDING manually
      });
      db.getItem('floor').then((value) => {
        this.floor = value;
      });
      db.getItem('plan').then((value) => {
        globals.PLAN = value;
        // globals.PLAN is a dataURL. we have to convert dataURL to
        // a HTMLImageElement so that canvas can draw it
        let img = new Image();
        img.src = globals.PLAN;
        globals.CVS.image = img;
        globals.CVS.draw_canvas();
      });
      db.getItem('labels').then( (labels) => {
        globals.LABELS = []; // clear labels
        labels.forEach((l) => { 
          globals.LABELS.push(new Label(l.id, l.x, l.y,
            l.title, l.caption, l.defect,
            l.image_src, l.image
          )
          );
        }
        );
        this.labels = globals.LABELS;
        globals.CVS.draw_canvas();
      });
      db.getItem('id').then( (value) => {
        globals['ID'] = value;
      });
      globals.CVS.draw_canvas();
    },
  },
  watch: {
    building: function(building) {
      this.building = building;
      globals.BUILDING = this.building;
      globals.CVS.draw_canvas();
    },
    floor: function(floor) {
      this.floor = floor;
      globals.FLOOR = this.floor;
      globals.CVS.draw_canvas();
    },
  }
});

function init() {
  // Set canvas dimensions
  let canvas = document.getElementById('c');
  window.addEventListener('resize', () => {
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
    //redraw the canvas
    globals.CVS.draw_canvas();
  });
  let img = new Image();
  img.src = './assets/canvas_placeholder.png';
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
    else if (e.keyCode === 9 && globals.KEYS[17]) { //Control-Tab
      vue.toggle();      
    }
    else if (e.keyCode === 83 && globals.KEYS[17]) { // Control-S Save
      vue.save_data();
    }
  };
  // Handling the reply when we send the exported floor plan
  electron.ipcRenderer.on('export_image', (e, args) => {
    vex.dialog.alert(args);
  });
}

init();
