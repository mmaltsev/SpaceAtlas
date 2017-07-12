function systemDraw(elementId, systemName, width, height) {
  systemName = systemName || commonNameExtract() || 'Solar'

  axios({
    method:'get',
    url:'json/objects.json',
    responseType:'json'
  })
    .then(function (response) {
      console.log('Successful data upload')
      systemProcessData(response.data, elementId, systemName, width, height)
    })
    .catch(function (error) {
      console.log(error);
    });
}

function systemProcessData(data, elementId, systemName, width, height) {
  systemArr = commonObjToSortArr(data, systemName, 'desc')
  constants = systemConstantsSet(systemArr, width, height)

  var systemSVG = systemCanvasDraw(elementId)
  for (var i = 0; i < systemArr.length; i++) {
	  systemObjectDraw(systemArr[i], systemSVG, constants)
  }
}

function systemConstantsSet(systemArr, width, height) {
  var constants = {}
  constants.windowWidth = width || window.innerWidth
  constants.windowHeight = height || window.innerHeight
  constants.imageInnerMarginRatio = 0.85
  constants.objectDistanceRatio = 12000
  constants.objectSizeRatio = 0.05
  constants.starRatio = 0.5
  constants.starMarginAbs = 8000
  var startObject = systemArr[systemArr.length - 2]
  constants.canvasMargin = startObject.distance_to_star * constants.objectDistanceRatio - 
        constants.windowWidth / 2 + startObject.mean_radius / 2 * constants.objectSizeRatio + 
	      constants.starMarginAbs
  return constants
}

function systemCanvasDraw(elementId) {
  var systemSVG = d3.select('#' + elementId)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
	  .call(d3.zoom().scaleExtent([0.001, 1]).on('zoom', function () {
	    systemSVG.attr('transform', d3.event.transform)
	  }))
	  .append('g')
  return systemSVG
}

function systemObjectDraw(object, systemSVG, constants) {
  var width = object.mean_radius * constants.objectSizeRatio
  var height = object.mean_radius * constants.objectSizeRatio
  var xOffset = object.distance_to_star * constants.objectDistanceRatio - 
    constants.canvasMargin + constants.starMarginAbs
  var yOffset = (constants.windowHeight - height) / 2

  if (object.type === 'Star') {
    width = width * constants.starRatio
  	xOffset = - width / 2 - constants.canvasMargin
  } else {
    systemOrbitAndOutlineDraw(systemSVG, object, constants, xOffset, yOffset, width, height)
  }
  systemImageAndLinkDraw(systemSVG, object, constants, xOffset, yOffset, width, height)
}

function systemOrbitAndOutlineDraw(systemSVG, object, constants, xOffset, yOffset, width, height) {
  var ellipseMajor = object.distance_to_star * constants.objectDistanceRatio + 
    width / 2  + constants.starMarginAbs
  var ellipseMinor = object.distance_to_star * constants.objectDistanceRatio + 
    height / 2 - 1000  + constants.starMarginAbs

  systemSVG.append('circle')
    .attr('cx', xOffset + width / 2)
    .attr('cy', yOffset + width / 2)
    .attr('r', Math.pow(width, 1/1.2) * 3)
	  .attr('id', object.name + 'Back')
	  .attr('opacity', '0.2')
    .attr('vector-effect',  'non-scaling-stroke')
	  .style('fill', 'transparent')
	  
	systemSVG.append('ellipse')
    .attr('cx', 0 - constants.canvasMargin)
    .attr('cy', constants.windowHeight / 2)
    .attr('rx', ellipseMajor)
	  .attr('ry', ellipseMinor)
	  .attr('vector-effect',  'non-scaling-stroke')
	  .attr('onmouseover', 'systemObjectHighlight("' + object.name + '", true)')
	  .attr('onmouseout', 'systemObjectHighlight("' + object.name + '", false)')
	  .style('fill', 'transparent')
	  .style('stroke', '#666')
	  .style('stroke-width', '1px')
}

function systemImageAndLinkDraw(systemSVG, object, constants, xOffset, yOffset, width, height) {
  systemSVG.append('svg:image')
    .attr('width', width)
    .attr('height', height)
    .attr('x', xOffset)
    .attr('y', yOffset)
    .attr('xlink:href', object.image_path)
	  .attr('id', object.name)
	  .attr('onmouseover', 'systemObjectHighlight("' + object.name + '", true)')
	  .attr('onmouseout', 'systemObjectHighlight("' + object.name + '", false)')

  systemSVG.append('a')
	  .attr('xlink:href', 'info.html?name=' + object.name) 
	  .append('circle')
    .attr('cx', xOffset + width / 2)
    .attr('cy', constants.windowHeight / 2)
    .attr('r', width * constants.imageInnerMarginRatio / 2)
    .attr('onmouseover', 'systemObjectHighlight("' + object.name + '", true)')
	  .attr('onmouseout', 'systemObjectHighlight("' + object.name + '", false)')
	  .style('fill', 'transparent')
	  .style('cursor', 'pointer')
}

function systemObjectHighlight(name, isMouseOver) {
  object = document.getElementById(name + 'Back')
  if (object && isMouseOver) {
    object.setAttribute('style', 'fill: white');
  } else if (object && !isMouseOver) {
    object.setAttribute('style', 'fill: transparent');
  }
}