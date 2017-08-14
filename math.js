let math = {
  // reshape :: (Matrix, Array) -> Matrix
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
  // Takes the inverse of a matrix
  // Matrix -> Matrix
  inv: (m) => {
    return m
  },
  // Concatenates a matrix with a vector
  // If a square vector is concatenated with a vector, it will default
  // to (n+1 x n) rather than (n x n+1)
  // (Matrix, Vector) -> Matrix
  concat: (m, dim) => {
    return n           
  }
}

