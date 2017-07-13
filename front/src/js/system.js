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
  constants.fitUnit = constants.windowHeight / 
    (systemArr[0].distance_to_mass_center + systemArr[0].mean_radius)
  constants.starUnit = 25
  constants.planetUnit = 125
  return constants
}

function systemCanvasDraw(elementId) {
  var systemSVG = d3.select('#' + elementId)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
	  .call(d3.zoom().scaleExtent([1, 400]).on('zoom', function () {
	    systemSVG.attr('transform', d3.event.transform)
	  }))
	  .append('g')
  return systemSVG
}

function systemObjectDraw(object, systemSVG, constants) {
  systemOrbitDraw(object, systemSVG, constants)
  systemImageDraw(object, systemSVG, constants)
  systemImageLinkAppend(object, systemSVG, constants)
}

function systemOrbitDraw(object, systemSVG, constants) {
  var orbitXCenterOffset = constants.windowWidth / 2
  var orbitYCenterOffset = constants.windowHeight / 2
  var orbitRadius = object.distance_to_mass_center * constants.fitUnit / 2

	systemSVG.append('ellipse')
    .attr('cx', orbitXCenterOffset)
    .attr('cy', orbitYCenterOffset)
    .attr('rx', orbitRadius)
	  .attr('ry', orbitRadius)
	  .attr('vector-effect',  'non-scaling-stroke')
	  .style('fill', 'transparent')
	  .style('stroke', '#666')
	  .style('stroke-width', '1px')
}

function systemImageDraw(object, systemSVG, constants) {
  var imageDiameter = object.mean_radius * 2 * constants.fitUnit
  imageDiameter = 
    object.type === 'Star' 
      ? imageDiameter * constants.starUnit 
      : imageDiameter * constants.planetUnit
  var imageXOffset = (constants.windowWidth + object.distance_to_mass_center * 
    constants.fitUnit - imageDiameter) / 2
  var imageYOffset = (constants.windowHeight - imageDiameter) / 2
  var imagePath = object.image_path
  var imageId = object.name

  systemSVG.append('svg:image')
    .attr('width', imageDiameter)
    .attr('height', imageDiameter)
    .attr('x', imageXOffset)
    .attr('y', imageYOffset)
    .attr('xlink:href', imagePath)
	  .attr('id', imageId)
}

function systemImageLinkAppend(object, systemSVG, constants) {
  var imageDiameter = object.mean_radius * 2 * constants.fitUnit
  imageDiameter = 
    object.type === 'Star' 
      ? imageDiameter * constants.starUnit 
      : imageDiameter * constants.planetUnit
  var linkXOffset = (constants.windowWidth + object.distance_to_mass_center * 
    constants.fitUnit) / 2
  var linkYOffset = constants.windowHeight / 2
  var linkCirlceRadius = imageDiameter * constants.imageInnerMarginRatio / 2
  var linkPath = object.name

  systemSVG.append('a')
	  .attr('xlink:href', 'info?name=' + linkPath) 
	  .append('circle')
    .attr('cx', linkXOffset)
    .attr('cy', linkYOffset)
    .attr('r', linkCirlceRadius)
	  .style('fill', 'transparent')
	  .style('cursor', 'pointer')
}
