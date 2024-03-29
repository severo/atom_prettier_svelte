// https://bl.ocks.org/mbostock/4c5fad723c87d2fd8273

var formatSum = d3.format('.1s')

var padding = 10

var radius = d3.scaleSqrt().range([0, 220])

var color = d3
  .scaleOrdinal()
  .range([
    '#98abc5',
    '#8a89a6',
    '#7b6888',
    '#6b486b',
    '#a05d56',
    '#d0743c',
    '#ff8c00',
  ])

var arc = d3.arc().padRadius(50)

var pie = d3
  .pie()
  .sort(null)
  .padAngle(0.02)
  .value(function(d) {
    return d.population
  })

d3.csv(
  'data.csv',
  function(d, i, columns) {
    return {
      state: d.State,
      sum: d3.sum(columns.slice(1), function(key) {
        return +d[key]
      }),
      ages: columns.slice(1).map(function(key) {
        return {
          age: key,
          population: +d[key],
        }
      }),
    }
  },
  function(error, data) {
    if (error) throw error

    radius.domain([
      0,
      d3.max(data, function(d) {
        return d.sum
      }),
    ])

    color.domain(data.columns.slice(1))

    var legend = d3
      .select('body')
      .append('svg')
      .attr('class', 'legend')
      .attr('width', 120)
      .attr('height', (data.columns.length - 1) * 20)
      .selectAll('g')
      .data(data.columns.slice(1).reverse())
      .enter()
      .append('g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + i * 20 + ')'
      })

    legend
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color)

    legend
      .append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(function(d) {
        return d
      })

    var svg = d3
      .select('body')
      .selectAll('.pie')
      .data(
        data.sort(function(a, b) {
          return b.sum - a.sum
        })
      )
      .enter()
      .append('svg')
      .attr('class', 'pie')
      .each(multiple)
      .select('g')

    var label = svg.append('text').attr('class', 'label')

    label
      .append('tspan')
      .attr('class', 'label-name')
      .attr('x', 0)
      .attr('dy', '-.2em')
      .text(function(d) {
        return d.state
      })

    label
      .append('tspan')
      .attr('class', 'label-value')
      .attr('x', 0)
      .attr('dy', '1.1em')
      .text(function(d) {
        return formatSum(d.sum)
      })

    function multiple(d) {
      var r = radius(d.sum)

      var svg = d3
        .select(this)
        .attr('width', r * 2)
        .attr('height', r * 2)
        .append('g')
        .attr('transform', 'translate(' + r + ',' + r + ')')

      svg
        .selectAll('.arc')
        .data(function(d) {
          return pie(d.ages)
        })
        .enter()
        .append('path')
        .attr('class', 'arc')
        .attr('d', arc.outerRadius(r).innerRadius(r * 0.6))
        .style('fill', function(d) {
          return color(d.data.age)
        })
    }
  }
)
