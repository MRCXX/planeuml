var Util = G6.Util;
var G = G6.Canvas.G;

function findById(items, id) {
  var rst;
  Util.each(items, function (item) {
    if (item.id === id) {
      rst = item;
      return false;
    }
  });
  return rst;
}
function compareIndex(id1, id2, items) {
  var node1 = findById(items, id1);
  var node2 = findById(items, id2);
  var index1 = items.indexOf(node1);
  var index2 = items.indexOf(node2);
  return index1 > index2;
}

export const debug_graph = function (data) {
  G6.registNode("sequence-node", {
    draw: function (cfg, group) {
      console.error(cfg);
      var model = cfg.model;
      var x = cfg.x;
      var y = cfg.y;
      var color = cfg.color;
      var label = cfg.label;
      var labelStyle = cfg.labelStyle
        ? cfg.labelStyle
        : {
            fontSize: 12,
            textAlign: "center",
            textBaseline: "middle",
            fill: "#333",
          };
      var size = cfg.size;
      var width = size[0];
      var height = size[1];
      var barWidth = model.barWidth ? model.barWidth : 10;
      var labelHeight = model.labelHeight ? model.labelHeight : 26; // 标签高度
      var slideMargin = model.slideMargin ? model.slideMargin : 20;
      var keyShape; // 用作锚点连接的关键shape
      // 上标签背景
      group.addShape("rect", {
        attrs: {
          x: x - width / 2,
          y: y - height / 2,
          width: width,
          height: labelHeight,
          stroke: "black",
          radius: 5,
          lineWidth: 1,
          fill: color,
        },
      });
      // 上标签文字
      group.addShape("text", {
        attrs: Util.mix(
          {
            x: x,
            y: y - height / 2 + labelHeight / 2,
            text: label,
          },
          labelStyle
        ),
      });
      // 下标签背景
      group.addShape("rect", {
        attrs: {
          x: x - width / 2,
          y: y + height / 2 - labelHeight,
          width: width,
          height: labelHeight,
          stroke: "black",
          radius: 5,
          lineWidth: 1,
          fill: color,
        },
      });
      // 下标签文字
      group.addShape("text", {
        attrs: Util.mix(
          {
            x: x,
            y: y + height / 2 - labelHeight / 2,
            text: label,
          },
          labelStyle
        ),
      });
      // 中间虚线
      group.addShape("line", {
        attrs: {
          x1: x,
          y1: y - height / 2 + labelHeight,
          x2: x,
          y2: y + height / 2 - labelHeight,
          lineDash: [5, 5],
          lineWidth: 0.5,
          stroke: "#333",
        },
      });
      // // 关键图形
      keyShape = group.addShape("rect", {
        attrs: {
          x: x - barWidth / 2,
          y: y - height / 2 + labelHeight + slideMargin,
          width: barWidth,
          height: height - 2 * labelHeight - slideMargin * 2,
        },
      });
      return keyShape;
    },
    getAnchorPoints: function (cfg) {
      var model = cfg.model;
      var anchorNumber = model.anchorNumber;
      var cellRatio = 1 / anchorNumber;
      var rst = [];
      var i;
      for (i = 0; i < anchorNumber; i++) {
        rst.push([1, cellRatio * i + (1 / 2) * cellRatio]);
      }
      for (i = 0; i < anchorNumber; i++) {
        rst.push([0, cellRatio * i + (1 / 2) * cellRatio]);
      }
      return rst;
    },
  });
  G6.registEdge(
    "sequence-edge",
    {
      draw: function (cfg, group) {
        var model = cfg.model;
        var color = cfg.color;
        var points = cfg.points;
        var slideWidth = model.slideWidth;
        var slideHeight = model.slideHeight;
        var sourcePoint = points[0];
        var targetPoint = points[points.length - 1];
        var pointsArr = []; // points 数组
        var keyShape; // 关键图形
        var sourceX;
        var targetX;
        Util.each(points, function (p1) {
          pointsArr.push([p1.x, p1.y]);
        });
        sourceX = sourcePoint.x - slideWidth - 1;
        targetX = targetPoint.x;
        if (targetPoint.x < sourcePoint.x) {
          sourceX = sourcePoint.x;
          targetX = targetPoint.x - slideWidth;
        }
        keyShape = group.addShape("polyline", {
          attrs: {
            points: pointsArr,
            stroke: "black",
            arrow: true,
          },
        });
        console.log(color);
        group.addShape("rect", {
          attrs: {
            x: sourceX,
            y: sourcePoint.y - slideHeight / 2,
            width: slideWidth,
            height: slideHeight,
            fill: "red",
          },
        });
        group.addShape("rect", {
          attrs: {
            x: targetX,
            y: targetPoint.y - slideHeight / 2,
            width: slideWidth,
            height: slideHeight,
            fill: "blue",
          },
        });
        return keyShape;
      },
    },
    "arrow"
  );
  var net = new G6.Net({
    id: "c1", // 容器ID
    forceFit: true, // 宽度自适应
    height: 450, // 画布高
    dragable: true, // 是否支持元素拖动
    resizeable: true, // 是否支持元素变形
    selectable: true, // 是否允许选中
    fitView: "autoZoom", // 自动缩放
    grid: {
      forceAlign: true, // 是否支持网格对齐
      cell: 10, // 网格大小
    },
  });
  // 映射规则
  net
    .node()
    .color("active", function (val) {
      var rst;
      if (val) {
        rst = "#FFC3CE";
      } else {
        rst = "#FFFFD4";
      }
      return rst;
    })
    .label("id");
  net.edge().color("source*target", function (val0, val1) {
    var rst = [];
    if (val0 === "imbilegw") {
      rst[0] = "#3388B3";
    }
    if (val0 === "msgbroker") {
      rst[0] = "#FF8467";
    }
    if (val0 === "tthove") {
      rst[0] = "#00C3F8";
    }
    if (val0 === "aliPlool") {
      rst[0] = "#7FEF9F";
    }
    if (val1 === "imbilegw") {
      rst[1] = "#3388B3";
    }
    if (val1 === "msgbroker") {
      rst[1] = "#FF8467";
    }
    if (val1 === "tthove") {
      rst[1] = "#00C3F8";
    }
    if (val1 === "aliPlool") {
      rst[1] = "#7FEF9F";
    }
    return rst;
  });
  // 布局
  var nodes = data.nodes;
  var edges = data.edges;
  var nodeMapper = net.get("nodeMapper");
  var height = net.get("height");
  var marginLeft = 20;
  var padding = 6;
  var cellHeight = 500;
  var barWidth = 10;
  var labelHeight = 20;
  var barHeight = cellHeight - labelHeight * 2;
  var maxOrder = 0;
  var currentX = 1;
  var labelShape = new G.Text(); // 用于测量label宽度
  var slideMargin = 10;
  var cellWidth;
  var cfg;
  var bbox;
  Util.each(edges, function (edge) {
    if (edge.order > maxOrder) {
      maxOrder = edge.order;
    }
  });
  Util.each(nodes, function (node) {
    cfg = nodeMapper.mapping(node);
    labelShape.attr("text", cfg.label);
    labelShape.attr("x", 0);
    labelShape.attr("y", 0);
    bbox = labelShape.getBBox();
    cellWidth = bbox.maxX - bbox.minX + 2 * padding;
    node.shape = "sequence-node";
    node.x = currentX + cellWidth / 2;
    node.y = (1 / 2) * height;
    currentX += cellWidth + marginLeft;
    node.size = [];
    node.size[0] = cellWidth;
    node.size[1] = cellHeight;
    node.labelHeight = labelHeight;
    node.barWidth = barWidth;
    node.slideMargin = slideMargin;
    node.anchorNumber = maxOrder;
  });
  Util.each(edges, function (edge) {
    edge.shape = "sequence-edge";
    edge.slideHeight = (barHeight - slideMargin * 2) / maxOrder;
    edge.slideWidth = barWidth;
    if (compareIndex(edge.source, edge.target, nodes)) {
      edge.sourceAnchor = edge.order + maxOrder - 1;
      edge.targetAnchor = edge.order - 1;
    } else {
      edge.sourceAnchor = edge.order - 1;
      edge.targetAnchor = edge.order + maxOrder - 1;
    }
  });
  labelShape.destroy();
  net.source(nodes, edges); // source 必须在定义映射规则之后
  net.render();
};
