import React from 'react'
import stringReplace from 'react-string-replace'

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

let textHighlighter = function ( find ) {
  return function ( findIn ) {

    let toFind = find
    if (typeof toFind === 'function') {
      toFind = toFind()
    }
    
    // Return as is...
    if (!findIn || findIn == '' || !toFind || toFind == '') return findIn
    
    let escSearchText = toFind.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
    let text = findIn
    
    text = stringReplace(text, new RegExp(`(${escSearchText})`, 'gi'), (match, i) => (
      <strong key={i} style={{'borderBottom': '1px dotted', 'fontSize': '1.15rem'}}>{match}</strong>
    ));
    
    return text
  }
}

export {tableFormatters, textHighlighter}
