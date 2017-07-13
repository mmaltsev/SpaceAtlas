function spaceDraw(elementId, width, height) {
  var canvasWidth = 0
  if(!width) {
    width = window.innerWidth
	var canvasWidth = '100%'
  } else {
    var canvasWidth = width
  }
  
  if (!height) {
    height = window.innerHeight
	var canvasHeight = '100%'
  } else {
  	var canvasHeight = height
  }
  
  var spaceSVG = d3.select('#' + elementId)
    .append('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight)
	/*.call(d3.zoom().scaleExtent([0.001, 1]).on('zoom', function () {
	  systemSVG.attr('transform', d3.event.transform)
	}))*/
	.append('g')
	
    spaceSVG.append('svg:image')
      .attr('width', width * 0.07)
      .attr('height', width * 0.07)
      .attr('x', width * 0.4)
      .attr('y', height * 0.6)
      .attr('xlink:href', 'img/star.png')
	  .attr('id', 'star1')
  
    spaceSVG.append('a')
	  .attr('xlink:href', 'system?name=Solar') 
	  .append('circle')
      .attr('cx', width * 0.4 + width * 0.035)
      .attr('cy', height * 0.6 + width * 0.035)
      .attr('r', width * 0.025)
	  .style('fill', 'transparent')
	  .style('cursor', 'pointer')
	  
	spaceSVG.append('svg:image')
      .attr('width', width * 0.1)
      .attr('height', width * 0.1)
      .attr('x', width * 0.7)
      .attr('y', height * 0.2)
      .attr('xlink:href', 'img/star.png')
	  .attr('id', 'star2')

	spaceSVG.append('a')
	  .attr('xlink:href', 'system?name=Alpha_Cen') 
	  .append('circle')
      .attr('cx', width * 0.7 + width * 0.05)
      .attr('cy', height * 0.2 + width * 0.05)
      .attr('r', width * 0.04)
	  .style('fill', 'transparent')
	  .style('cursor', 'pointer')  
	  
  return spaceSVG
}
