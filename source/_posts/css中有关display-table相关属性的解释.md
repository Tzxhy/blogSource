---
title: 'css中有关display:table相关属性的解释'
date: 2017-06-15 11:36:21
tags: css table
---

# display:table相关属性
## 属性特性

- table    此元素会作为块级表格来显示（类似 <table>），**表格前后带有换行符**。
- table-row-group    此元素会作为一个或多个行的分组来显示（类似 <tbody>）。
- table-header-group    此元素会作为一个或多个行的分组来显示（类似 <thead>）。
- table-footer-group    此元素会作为一个或多个行的分组来显示（类似 <tfoot>）。
- table-row    此元素会作为一个表格行显示（类似 <tr>）。
- table-column-group    此元素会作为一个或多个列的分组来显示（类似 <colgroup>）。
- table-column    此元素会作为一个单元格列显示（类似 <col>）
- table-cell    此元素会作为一个表格单元格显示（类似 <td> 和 <th>）
- table-caption    此元素会作为一个表格标题显示（类似 <caption>）


# display: table-cell 

## 属性特性
display:table-cell属性指让标签元素以表格单元格的形式呈现，类似于td标签.但是IE6/7不支持。table-cell同样会被其他一些CSS属性破坏，例如float, position:absolute。设置了display:table-cell的元素对宽度高度敏感，对margin值无反应，响应padding属性，基本上就是活脱脱的一个td标签元素了。
### 应用
1， 实现行内效果
2， 等高布局
3， 垂直居中

