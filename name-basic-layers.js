#target Illustrator

//  script.name = name-color-layers.js;  
//  script.description = Loop each Artboard and set Layers name;  
//  script.requirement = one document with at least one artboard;  
//  script.parent = elrumordelaluz;  
//  script.elegant = false; 

if (app.documents.length > 0) {
  var doc = app.activeDocument
  colorIconsLayers()
} else {
  alert ("There is no open document.")
}

function colorIconsLayers () {
  var artbsString = prompt ("Enter Indexes of Artboards to process (comma separated), empty for all Artboards.", "", "Copy Artboards")
  var pathCount = doc.pathItems.length
  var compPathCount = doc.compoundPathItems.length
  var groupCount = doc.groupItems.length
  
  if (artbsString != null) {
    var onlySelected = artbsString !== ''
    var lengthLoop =  doc.artboards.length
    var selArtbs = []
    if (onlySelected) {
      selArtbs = artbsString.split(',')
      lengthLoop = selArtbs.length
    }
    for (i = 0; i < lengthLoop; i++) {
      var usedLayers = new Array()
      var index = i
      if (onlySelected) {
        index = selArtbs[i]-1
      }
      selectArtboardByIndex(index)
      
      // Simple Paths Loop
      if (pathCount > 0) {
        for (var y = 0; y < pathCount; y++) {
          usedLayers = processPath(doc.pathItems[y], usedLayers)
        }
      }
    
      // Compound Paths Loop
      if (compPathCount > 0) {
        for (var z = 0; z < compPathCount; z++) {
          usedLayers = processPath(doc.compoundPathItems[z], usedLayers)
        }
      }
      
      // Groups Loop
      if (groupCount > 0) {
        for (var g = 0; g < groupCount; g++) {
          usedLayers = processPath(doc.groupItems[g], usedLayers)
        }
      }
    }
  } else {
    alert('bye…')
  }
}

function processPath (path, usedLayers) {
  var testPath = isCompoundPath(path) && path.pathItems.length > 0 ? path.pathItems[0] : path
  
  if (path.selected) {
    if ((isStroked(testPath) || isFilled(testPath)) && path.parent.opacity === 100) {
      var pathColor = getColor(testPath)
      if (usedLayers.length > 0) {
        for (var i = 0; i < usedLayers.length; i++) {
          if (isEqualColor(usedLayers[i],pathColor)) {
            path.name = 'layer' + Number(i + 1)
            return usedLayers
          }
        }
        path.name = 'layer' + Number(usedLayers.length + 1)
        return usedLayers.concat(pathColor)
      } else {
        path.name = 'layer1'
        return usedLayers.concat(pathColor)
      }  
    }
  }
  return usedLayers
}

function isEqualColor (obj1, obj2) {
  return isCMYK() ? 
    obj1.cyan === obj2.cyan && 
    obj1.magenta === obj2.magenta && 
    obj1.yellow === obj2.yellow && 
    obj1.black === obj2.black 
    :
    obj1.red === obj2.red && 
    obj1.green === obj2.green && 
    obj1.blue === obj2.blue
}

function isStroked (path) { return path.stroked && !path.filled }
function isFilled (path) { return path.filled && !path.stroked && path.opacity === 100 }
function isOpacity (path) { return path.opacity < 100 }
function isCompoundPath (path) { return path.typename === "CompoundPathItem" }

function selectArtboardByIndex (index) {
  doc.selection = null
  doc.artboards.setActiveArtboardIndex(index)
  doc.selectObjectsOnActiveArtboard()
}

function setDefaultLayer () {
  return isCMYK() ? 
    { cyan: '', magenta: '', yellow: '', black: '' } : 
    { red: '', green: '', blue: '' }
}

function isCMYK () {
  return doc.documentColorSpace == 'DocumentColorSpace.CMYK'
}

function getColor (path) {
  return isCMYK() ? {
    cyan: isStroked(path) ? path.strokeColor.cyan : path.fillColor.cyan,
    magenta: isStroked(path) ? path.strokeColor.magenta : path.fillColor.magenta,
    yellow: isStroked(path) ? path.strokeColor.yellow : path.fillColor.yellow,
    black: isStroked(path) ? path.strokeColor.black : path.fillColor.black,
  } : {
    red: isStroked(path) ? path.strokeColor.red : path.fillColor.red,
    green: isStroked(path) ? path.strokeColor.green : path.fillColor.green,
    blue: isStroked(path) ? path.strokeColor.blue : path.fillColor.blue,
  }
}
