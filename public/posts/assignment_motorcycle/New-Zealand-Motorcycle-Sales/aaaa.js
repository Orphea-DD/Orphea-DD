function _1(md){return(
  md`<div style="color: grey; font: 30px/25.5px var(--sans-serif); text-transform: uppercase;">
  <h1 style="display: none;">New Zealand Motorcycle Sales</h1></div>
  
  # New Zealand Motorcycle Sales
  
  This variation of the sunburst chart shows two levels of the hierarchy. Click a node to zoom in, and click the center to zoom out.
  Thanks to The [Motor Industry Association of New Zealand (Inc)](https://www.mia.org.nz/), we can get very detailed motorcycle sales data. I strive to vividly reflect the preferences of New Zealand consumers.
  `
  )}

    function _dataset(Inputs,chart)
    {
      const radio = Inputs.radio(new Map([
        ["2019", "2019"], 
        ["2020", "2020"], 
        ["2021", "2021"]
      ]), {label: "dataset", value: "2019"});
      
      radio.addEventListener("input", () => chart.change(radio.value));
      
      return radio;
    }
    
    function _chart(d3,data2019,data2020,data2021)
    {
      const width = 800;
      const height = width;
      const radius = width / 10; // 修改半径大小
    
      const svg = d3.create("svg")
          .attr("viewBox", [-width / 2, -height / 2 + 100, width, height])
          .style("font", "10px sans-serif");
    
      function render(data) {
        const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    
        const hierarchy = d3.hierarchy(data)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);
        const root = d3.partition()
          .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);
        root.each(d => d.current = d);
    
        const arc = d3.arc()
          .startAngle(d => d.x0)
          .endAngle(d => d.x1)
          .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
          .padRadius(radius * 1.5)
          .innerRadius(d => d.y0 * radius)
          .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));
    
        svg.selectAll("*").remove();
    
        const path = svg.append("g")
          .selectAll("path")
          .data(root.descendants().slice(1))
          .join("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
            .attr("d", d => arc(d.current));
    
        path.filter(d => d.children)
          .style("cursor", "pointer")
          .on("click", clicked);
    
        const format = d3.format(",d");
        path.append("title")
          .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
    
        const label = svg.append("g")
          .attr("pointer-events", "none")
          .attr("text-anchor", "middle")
          .style("user-select", "none")
          .selectAll("text")
          .data(root.descendants().slice(1))
          .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d.current))
            .attr("transform", d => labelTransform(d.current))
            .text(d => `${d.data.name}: ${format(d.value)}`);
    
        const parent = svg.append("circle")
          .datum(root)
          .attr("r", radius)
          .attr("fill", "none")
          .attr("pointer-events", "all")
          .on("click", clicked);
    
        function clicked(event, p) {
          parent.datum(p.parent || root);
    
          root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
          });
    
          const t = svg.transition().duration(750);
    
          path.transition(t)
            .tween("data", d => {
              const i = d3.interpolate(d.current, d.target);
              return t => d.current = i(t);
            })
            .filter(function(d) {
              return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")
            .attrTween("d", d => () => arc(d.current));
    
          label.filter(function(d) {
              return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
        }
    
        function arcVisible(d) {
          return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
        }
    
        function labelVisible(d) {
          return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
        }
    
        function labelTransform(d) {
          const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
          const y = (d.y0 + d.y1) / 2 * radius;
          return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }
      }
    
      render(data2019);
    
      return Object.assign(svg.node(), {
        change(year) {
          if (year === "2019") {
            render(data2019);
          } else if (year === "2020") {
            render(data2020);
          } else if (year === "2021") {
            render(data2021);
          }
        }
      });
    }
    
    function _data2019(FileAttachment){return FileAttachment("Motorcycle_Sales_2019.json").json()}
    function _data2020(FileAttachment){return FileAttachment("Motorcycle_Sales_2020.json").json()}
    function _data2021(FileAttachment){return FileAttachment("Motorcycle_Sales_2021.json").json()}
    
    export default function define(runtime, observer) {
      const main = runtime.module();
      function toString() { return this.url; }
      const fileAttachments = new Map([
        ["Motorcycle_Sales_2019.json", {url: new URL("./files/Motorcycle_Sales_2019.json", import.meta.url), mimeType: "application/json", toString}],
        ["Motorcycle_Sales_2020.json", {url: new URL("./files/Motorcycle_Sales_2020.json", import.meta.url), mimeType: "application/json", toString}],
        ["Motorcycle_Sales_2021.json", {url: new URL("./files/Motorcycle_Sales_2021.json", import.meta.url), mimeType: "application/json", toString}]
      ]);
      main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
      main.variable(observer()).define(["md"], _1);
      main.variable(observer("viewof dataset")).define("viewof dataset", ["Inputs","chart"], _dataset);
      main.variable(observer("dataset")).define("dataset", ["Generators", "viewof dataset"], (G, _) => G.input(_));
      main.variable(observer("chart")).define("chart", ["d3","data2019","data2020","data2021"], _chart);
      main.variable(observer("data2019")).define("data2019", ["FileAttachment"], _data2019);
      main.variable(observer("data2020")).define("data2020", ["FileAttachment"], _data2020);
      main.variable(observer("data2021")).define("data2021", ["FileAttachment"], _data2021);
      return main;
    }
    