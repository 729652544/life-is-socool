export default {
  formatDuring(time, format) {
    var t = new Date(parseInt(time));
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      }
    });
  },
  // 格式化数字  每隔三位逗号隔开
  formatNum: function (num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
  },
  // 平行结构数据转为树结构
  listToTree: function listToTree(myId, pId, list) {
    function exists(list, parentId) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][myId] == parentId) return true;
      }
      return false;
    }

    var nodes = [];
    // get the top level nodes
    for (var i = 0; i < list.length; i++) {
      var row = list[i];
      if (!exists(list, row[pId])) {
        nodes.push(row);
      }
    }

    var toDo = [];
    for (var i = 0; i < nodes.length; i++) {
      toDo.push(nodes[i]);
    }
    while (toDo.length) {
      var node = toDo.shift();    // the parent node
      // get the children nodes
      for (var i = 0; i < list.length; i++) {
        var row = list[i];
        if (row[pId] == node[myId]) {
          //var child = {id:row.id,text:row.name};
          if (node.children) {
            node.children.push(row);
          } else {
            node.children = [row];
          }
          toDo.push(row);
        }
      }
    }
    return nodes;
  }

};
