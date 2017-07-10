const canvas_transform = {
  pan_up: (matrix, amt) => {
    matrix[5] += amt;
    return (matrix);
  },
  pan_down: (matrix, amt) => {
    matrix[5] -= 50;
    return (matrix);
  },
  pan_left: (matrix, amt) => {
    matrix[4] += 50;
    return (matrix);
  },
  pan_right: (matrix, amt) => {
    matrix[4] -= 50;
    return (matrix);
  },
  zoom_in: (matrix, amt) => {
    matrix[0] *= amt;
    matrix[1] *= amt;
    matrix[2] *= amt;
    matrix[3] *= amt;
    return (matrix);
  },
  zoom_out: (matrix, amt) => {
    matrix[0] /= amt;
    matrix[1] /= amt;
    matrix[2] /= amt;
    matrix[3] /= amt;
    return (matrix);
  }
}

module.exports = canvas_transform;
