function _1(md){return(
  md`<div style="color: grey; font: 30px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Zoomable icicle</h1></div>

  # NZ motor market

  This is a zoomable tree of some of the motorcycles for sale in New Zealand. We hope that by organizing this data we can show a sense of the motorcycle market.`
  )}
  
  function _chart(d3,data)
  {
    // Specify the chart’s dimensions.
    const width = 3000;
    const height = 1500;
  
      // Create the color scale.
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    // customise the colormap
    const colorScale = {
      "Honda": "#FF0000",
      "Yamaha": "#0044CC",
      "Kawasaki": "#000000",
      "Suzuki": "#005BAC",
      "Ducati": "#CC0000",
      "Harley-Davidson": "#FF6600",
      "BMW": "#003399",
      "Triumph": "#0D3B66",
      "KTM": "#FF6600",
      "Aprilia": "#000000", 
  };

    function defineGradients(svg, data) {
      const gradients = svg.append("defs")
        .selectAll("linearGradient")
        .data(data.descendants())
        .enter().append("linearGradient")
          .attr("id", d => `gradient-${d.data.name}`)
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
    
      gradients.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d => manufacturerColors[d.data.manufacturer] || "#cccccc");
    
      gradients.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d => typeColors[d.data.type] || "#cccccc");
    }
    
  
    const hierarchy = d3.hierarchy(data)
        .count()  // 使用.count()替换原来的.sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value);
    const root = d3.partition()
        .size([height, (hierarchy.height + 1) * width / 3])
      (hierarchy);
  
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const cell = svg.selectAll("g")
        .data(root.descendants())
        .enter().append("g")
          .attr("transform", d => `translate(${d.y0},${d.x0})`);
  
    const rect = cell.append("rect")
          .attr("width", d => d.y1 - d.y0 - 1)
          .attr("height", d => d.x1 - d.x0)
          .attr("fill-opacity", 0.6)
          //.attr("fill", d => `url(#gradient-${d.data.name})`)
          .attr("fill", d => {
            if (!d.depth) return "#ccc";
            while (d.depth > 1) d = d.parent; // 使用不同的颜色来表示不同层级
            //return colorScale[d.data.name];  // 假设有一个基于名称的颜色比例尺
            return color(d.data.name);
          })
      .style("cursor", "pointer")
      .on("click", clicked);
    
    const image = cell.append("image")
      .attr("xlink:href", d => d.data.image)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", d => d.y1 - d.y0 - 1)
      .attr("height", d => rectHeight(d))
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("pointer-events", "none"); // 禁止图像响应鼠标事件

      
    const text = cell.append("text")
        .style("user-select", "none")
        .style("font-size", "30px")
        .attr("pointer-events", "none")
        .attr("x", 10)
        .attr("y", 10)
        .attr("fill-opacity", d => +labelVisible(d));
  
    
        text.each(function(d) {
          const nodeText = d3.select(this);
          const x = 30;  // 文本的 x 坐标
          let yPos = 50; // 文本的起始 y 坐标
          //const maxWidth = 700;
          const maxWidth = d.y1 - d.y0 - 350; // 矩形的宽度减去边距
      
          // 定宽换行的函数
          function wrapText(text) {
              let currentLine = '';
              let words = text.split(/\s+/);
              let tspan = nodeText.append('tspan')
                  .attr('x', x)
                  .attr('y', yPos)
                  .style("font-weight", yPos === 10 ? "bold" : "normal"); // 首行使用加粗字体
      
              words.forEach((word, index) => {
                  let testLine = currentLine + word + ' ';
                  let testWidth = testLine.length * 10; // 假设每个字符平均宽度为6像素，这需要根据实际字体大小调整
      
                  if (testWidth > maxWidth && index > 0) {
                      tspan.text(currentLine);
                      currentLine = word + ' ';
                      yPos += 30; // 行间距
                      tspan = nodeText.append('tspan')
                          .attr('x', x)
                          .attr('y', yPos)
                          .text(currentLine);
                  } else {
                      currentLine = testLine;
                  }
              });
      
              tspan.text(currentLine); // 确保添加最后一行
          }
      
          // 添加各种文本
          wrapText(d.data.name); // 名称
          yPos += 50; // 名称与其他内容之间的间距
      
          if (d.data.description) {
              wrapText(`description: ${d.data.description}`);
              yPos += 30;
          }
      
          Object.entries(d.data.details || {}).forEach(([key, value]) => {
              wrapText(`${key}: ${value}`);
              yPos += 30;
          });
      });
      
    
  
    const format = d3.format(",d");
    const tspan = text.append("tspan")
          .attr("fill-opacity", d => labelVisible(d) * 0.7)
          .text(d => ` ${format(d.value)}`)
          .style("font-size", "20px");
   
    // 鼠标悬停提示
    cell.append("title")
          .text(d => `${d.data.name}: ${Object.entries(d.data.details || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}`);



    // On click, change the focus and transitions it into view.
    let focus = root;

    // 更新点击事件
    function clicked(event, p) {
      focus = focus === p ? p = p.parent : p;

      root.each(d => {  // 保证 `d` 在此函数内被正确定义
        d.target = {
            x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
            x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
            y0: d.y0 - p.y0,
            y1: d.y1 - p.y0
        };
    });

    const t = cell.transition().duration(750)
        .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);

    rect.transition(t).attr("height", d => rectHeight(d.target));
    text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
    image.transition(t).attr("height", d => rectHeight(d.target));
}



    function rectHeight(d) {
      return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
    }
    
    function labelVisible(d) {
      return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 20; // 保证 `d` 在此处定义
    }

    return svg.node();
  }
  
  
  function _data(FileAttachment){return(
  FileAttachment("flare-2.json").json()
  )}
  
  export default function define(runtime, observer) {
    const main = runtime.module();
    function toString() { return this.url; }
    const fileAttachments = new Map([
      ["flare-2.json", {url: new URL("./files/2222.json", import.meta.url), mimeType: "application/json", toString}]
    ]);
    main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
    main.variable(observer()).define(["md"], _1);
    main.variable(observer("chart")).define("chart", ["d3","data"], _chart);
    main.variable(observer("data")).define("data", ["FileAttachment"], _data);
    return main;
  }
  
