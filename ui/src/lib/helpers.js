let tableFormatters = {
  date : cell => (cell.value ? new Date(cell.value).toLocaleDateString() : ''),
  pipe: function() {
    const theMethods = arguments
    
    return (cell) => {
      // Execute the last method in the chain with the params.
      let val = theMethods[0].apply(this, [cell])
      
      // Now pass the return value into each method in reverse.
      if (theMethods.length > 1) {
        for (let i=1; i<theMethods.length; i++) {
          val = theMethods[i].apply(this, [val, cell])
        }
      }
      
      return val
    }
  } 
}

export {tableFormatters}