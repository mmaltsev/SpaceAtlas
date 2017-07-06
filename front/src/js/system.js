function systemObjectHighlight(name, isMouseOver) {
  object = document.getElementById(name + 'Back')
  if (object && isMouseOver) {
    object.setAttribute('style', 'fill: white');
  } else if (object && !isMouseOver) {
    object.setAttribute('style', 'fill: transparent');
  }
}

function systemObjectDraw(object, systemSVG, constants) {
  var width = object.mean_radius * constants.objectSizeRatio
  var height = object.mean_radius * constants.objectSizeRatio
  var xOffset = object.distance_to_star * constants.objectDistanceRatio - constants.canvasMargin + constants.starMarginAbs
  var yOffset = (window.innerHeight - height) / 2
  if (object.type === 'Star') {
    width = width * constants.starRatio
  	xOffset = - width / 2 - constants.canvasMargin
  } else {
    var ellipseMajor = object.distance_to_star * constants.objectDistanceRatio + width / 2  + constants.starMarginAbs
    var ellipseMinor = object.distance_to_star * constants.objectDistanceRatio + height / 2 - 1000  + constants.starMarginAbs
	
	systemSVG.append('circle')
    .attr('cx', xOffset + width / 2)
    .attr('cy', yOffset + width / 2)
    .attr('r', Math.pow(width, 1/1.2) * 3)
	  .attr('id', object.name + 'Back')
	  .attr('opacity', '0.4')
	  .style('fill', 'transparent')
	  
	systemSVG.append('ellipse')
    .attr('cx', 0 - constants.canvasMargin)
    .attr('cy', window.innerHeight / 2)
    .attr('rx', ellipseMajor)
	  .attr('ry', ellipseMinor)
	  .attr('vector-effect',  'non-scaling-stroke')
	  .attr('onmouseover', 'systemObjectHighlight("' + object.name + '", true)')
	  .attr('onmouseout', 'systemObjectHighlight("' + object.name + '", false)')
	  .style('fill', 'transparent')
	  .style('stroke', '#666')
	  .style('stroke-width', '1px')
  }
  
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
    .attr('cy', window.innerHeight / 2)
    .attr('r', width * constants.imageInnerMarginRatio / 2)
    .attr('onmouseover', 'systemObjectHighlight("' + object.name + '", true)')
	  .attr('onmouseout', 'systemObjectHighlight("' + object.name + '", false)')
	  .style('fill', 'transparent')
	  .style('cursor', 'pointer')
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

function systemConstantsSet(systemArr) {
  var constants = {}
  constants.imageInnerMarginRatio = 0.85
  constants.objectDistanceRatio = 12000
  constants.objectSizeRatio = 0.05
  constants.starRatio = 0.5
  constants.starMarginAbs = 8000
  var startObject = systemArr[systemArr.length - 2]
  constants.canvasMargin = startObject.distance_to_star * constants.objectDistanceRatio - 
        window.innerWidth / 2 + startObject.mean_radius / 2 * constants.objectSizeRatio + 
	      constants.starMarginAbs
  return constants
}

function systemProcessData(data, elementId, systemName) {
  systemArr = commonObjToSortArr(data, systemName, 'desc')
  constants = systemConstantsSet(systemArr)

  var systemSVG = systemCanvasDraw(elementId)
  for (var i = 0; i < systemArr.length; i++) {
	  systemObjectDraw(systemArr[i], systemSVG, constants)
  }
}

function systemDraw(elementId, systemName) {
  systemName = commonNameExtract() || 'Solar'

  axios({
    method:'get',
    url:'json/objects.json',
    responseType:'json'
  })
    .then(function (response) {
      console.log('Successful data upload')
      systemProcessData(response.data, elementId, systemName)
    })
    .catch(function (error) {
      console.log(error);
    });
}
	