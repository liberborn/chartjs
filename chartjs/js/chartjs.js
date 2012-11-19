/* *************************************************
 *
 *    ChartJS
 *    
 *
 * *************************************************
 */

    var ChartJS = {

        w : 0,
        h : 0,

        margin : {
            top : 20,
            right : 15,
            bottom : 10,
            left : 10
        },

        padding : {
            top : 38,
            right : 20,
            bottom : 10,
            left : 10
        },

        offset : {
            min : 10,
            text : 3,
            textMax : 9
        },

        color : {
            base : '#C0C0C0'
        },

        svg : '',

        init : function() {
            this.setConfig();
            this.setGradient();
            this.renderAxisX();
            this.renderAxisY();
            this.renderData();
            this.renderChart();
            this.events();
        },

        setConfig : function() {
            this.w = this.config.width;
            this.h = this.config.height;
        },

        setGradient : function() {

            var fromColor = '#FFF',
                toColor = this.config.data.color,
                defs = 
                   '<defs>' +
                     '<linearGradient id="gradItemBox" x1="0" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">' +
                       '<stop offset="0" stop-color="' + fromColor + '" stop-opacity="0.12" />' +
                       '<stop offset="1" stop-color="' + toColor + '" stop-opacity="0.14" />' +
                     '</linearGradient>' +
                   '</defs>';

            this.svg += defs;
        },

        renderChart : function() {
            var w = this.w,
                h = this.h,
                svg = '<svg ' + 'width="' + w + '" height="' + h + '">' + this.svg + '</svg>';

            $(this.id).html(svg);
        },

        renderGroup : function(g) {
            this.svg += '<g>' + g + '</g>';
        },

        line : function(o) {
            var l = '<line x1="' + o.x1 + 
                        '" y1="' + o.y1 + 
                        '" x2="' + o.x2 + 
                        '" y2="' + o.y2;
            
            l += (o.stroke != undefined) ? '" stroke="' + o.stroke : ''; 
            l += (o.strokeW != undefined) ? '" stroke-width="' + o.strokeW : ''; 
            l += (o.strokeDA != undefined) ? '" stroke-dasharray="' + o.strokeDA : '';

            l += '" />';

            return l;
        },

        axisXLabel : function(x, y, label) {
            return '<text x="' + (x - 6) + '" y="' + y + 
                   '" class="grid-label" style="fill: #999999;">' + 
                   label + '</text>';
        },

        axisXTickers : function() {
            var g = '',
                points = this.config.axisX.points,
                lineX = this.w - this.margin.left - this.padding.left -
                        this.margin.right - this.padding.right,
                lineY = this.h - this.margin.bottom - this.padding.bottom,
                tickW = 3,
                textH = lineY + 15,
                step = lineX / (points.length - 1);

            for (var i = 0; i < points.length; i++) {

                var x = ((step * i) + this.margin.left + this.padding.left);

                g += this.line({
                        x1 : x,
                        y1 : lineY - tickW,
                        x2 : x,
                        y2 : lineY + tickW,
                        stroke : '#C0C0C0',
                        strokeW : '1'
                });

                g += this.axisXLabel(x, textH, points[i]);
            }

            return g;
        },

        renderAxisX : function() {
            var g = '';

            g += this.axisXTickers();

            this.renderGroup(g);
        },

        axisYLabel : function(obj) {
            return '<text x="' + obj.x + '" y="' + 
                    (obj.y + this.offset.text) + 
                    '" class="grid-label" style="fill: ' + obj.color + '; stroke-width: 1;">' + 
                    obj.label + '</text>';
        },

        axisYGrid : function(obj) {

            var g = '',
                lineY = this.h - this.margin.top - this.padding.top -
                        this.margin.bottom - this.padding.bottom,
                step = lineY / (obj.points.length - 1);

            for (var i = 1; i < obj.points.length; i++) {

                var y = (this.h - this.margin.bottom - this.padding.bottom) - (step * i);

                g += this.line({
                        x1 : (this.margin.left + this.padding.left),
                        y1 : y,
                        x2 : (this.w - this.margin.right - this.padding.right),
                        y2 : y,
                        stroke : obj.color,
                        strokeW : '1',
                        strokeDA : '4,4'
                });

            }

            return g;
        },

        axisYPoints : function(obj) {

            var g = '',
                lineY = this.h - this.margin.top - this.padding.top -
                        this.margin.bottom - this.padding.bottom,
                step = lineY / (obj.points.length - 1);

            for (var i = 1; i < obj.points.length; i++) {

                var y = (this.h - this.margin.bottom - this.padding.bottom) - (step * i),
                    label = (typeof obj.points[i] === 'number') ? obj.points[i] : obj.points[i].lbl;

                g += this.axisYLabel({
                        x : obj.x,
                        y : y,
                        color : obj.color,
                        label : label
                });
            }

            return g;
        },

        renderAxisY : function() {

            var color = this.config.middleLineColor,
                lineX1 = this.margin.left + this.padding.left,
                lineX2 = this.w - this.margin.right - this.padding.right,
                baselineY = this.h - this.margin.bottom - this.padding.bottom;

            // baseline
            this.renderGroup(
                 this.line({
                    x1 : lineX1,
                    y1 : baselineY,
                    x2 : lineX2,
                    y2 : baselineY,
                    stroke : '#C0C0C0',
                    strokeW : 1
            }) );

            // grid lines
            this.renderGroup(
                this.axisYGrid({
                    color : color,
                    points : this.config.axisY.points
            }) );

            // left points
            this.renderGroup(
                this.axisYPoints({
                    x : this.margin.left,
                    color : color,
                    points : this.config.axisY.points
            }) );

            // right points (percents)
            this.renderGroup(
                this.axisYPoints({
                    x : this.w - this.margin.right - this.padding.right,
                    color : this.color.base,
                    points : this.config.axisY.points2
            }) );
        },

        renderItemBox : function(obj){

            var item = '',
                boxW = 50,
                boxH = 45,
                tipH = 10,
                halfW = boxW / 2,
                halfH = boxH / 2,
                offset = 12,

                x1 = obj.x - halfW,
                y1 = obj.y - boxH - offset;

            item += '<path d="M' + 
                        x1 + ' ' + y1 + ' ' + 
                        (x1 + boxW) + ' ' + (y1) + ' ' + 
                        (x1 + boxW) + ' ' + (y1 + boxH - tipH) + ' ' + 
                        (x1 + halfW) + ' ' + (y1 + boxH) + ' ' + 
                        (x1) + ' ' + (y1 + boxH - tipH) +' z"' +
                    'stroke="' + obj.color + '" stroke-width="1" ' + 
                    'stroke-linecap="square" stroke-linejoin="round" fill="url(#gradItemBox)"></path>';

            item += '<text x="' +  (x1 + (halfW / 2)) + '" y="' + (y1 + (halfW - tipH)) + 
                    '" class="grid-label" style="stroke: #666;">' +  obj.label + '</text>';
            item += '<text x="' +  (x1 + (halfW / 2)) + '" y="' + (y1 + halfH + tipH) + 
                    '" class="grid-label" style="stroke: #AAA;">' +  obj.labelPercent + '</text>';

            return item;
        },

        renderData : function() {

            var g = '',

                w = this.w - this.margin.left - this.padding.left -
                    this.margin.right - this.padding.right,
                wOffset = this.margin.left + this.padding.left,

                h = this.h - this.margin.top - this.padding.top - 
                    this.margin.bottom - this.padding.bottom,
                hOffset = this.margin.top + this.padding.top,

                min = this.config.axisX.min,
                max = this.config.axisX.max,
                maxY = (this.config.axisY.max - this.config.axisY.min),
                item = this.config.data;

            var line = [], l = '';

            // circles
            for (var i = 0, m = item.points.length; i < m; i++) {

                var x = item.points[i].x,

                    cx =  ((x - min) * w / (max - min))     + wOffset, 
                    cy =  h - (item.points[i].y * h / maxY) + hOffset,

                    label = item.points[i].percent + '(' + item.points[i].y + '), ' + x;

                line.push({x : cx, y : cy});

                g += '<circle cx="' + cx + '" cy="' + cy + '" r="5" stroke="' + item.color + 
                     '" stroke-width="2" fill="white"' +
                     ' data-item="' + item.label + '" ' + '/>';

                // line y
                g += this.line({
                        x1 : cx,
                        y1 : cy + this.offset.min,
                        x2 : cx,
                        y2 : this.h - this.margin.bottom - this.padding.bottom,
                        stroke : '#C0C0C0',
                        strokeW : '1',
                        strokeDA : '4,4'
                });

                // text y
                g += '<text x="' +  (cx - this.offset.textMax) + 
                     '" y="' + (this.h - this.margin.bottom - this.padding.bottom - this.offset.textMax) + 
                     '" class="grid-label" style="stroke: #AAA;">' +  x + '</text>';

                g += this.renderItemBox({
                        x : cx,
                        y : cy,
                        color : item.color,
                        label : item.points[i].y,
                        labelPercent : item.points[i].percent + '%'
                });
            }

            function mainLine(me){

                for (var i = 0, m = line.length; i < m; i++) {
                    
                    if (i === m - 1) { return; }

                    l += me.line({
                            x1 : line[i].x,
                            y1 : line[i].y,
                            x2 : line[i + 1].x,
                            y2 : line[i + 1].y,
                            stroke : item.color,
                            strokeW : '3'
                    });
                }
            }

            mainLine(this);

            this.renderGroup(l + g);
        },

        showItemTip : function(e) {
            
            var offsetX = 15, offsetY = 5,

                label = this.attributes[0].nodeValue,

                x = parseInt(this.attributes[6].nodeValue) + offsetX,
                y = parseInt(this.attributes[5].nodeValue) + offsetY,
                data = document.createTextNode(label),
                txt = document.createElementNS('http://www.w3.org/2000/svg','text');

            // circle hover effect
            this.attributes[2].nodeValue = "4"; // stroke-width
            this.attributes[4].nodeValue = "6"; // r

            // item tip
            txt.setAttribute('id','itemTip');
            txt.setAttribute('x', x);
            txt.setAttribute('y', y);
            txt.setAttribute('class','grid-label item-tip');
            txt.setAttribute('style','fill: #666666;');
            txt.appendChild(data);

            this.parentNode.appendChild(txt);

        },

        clearItemTips : function() {

            var tip = this.parentNode.lastElementChild,
                parent = this.parentNode;

            // remove item tip
            parent.removeChild(tip);

            // remove circle hover effect
            this.attributes[2].nodeValue = "2"; // stroke-width
            this.attributes[4].nodeValue = "5"; // r

        },

        events : function() {

            $('circle').on('mouseover', this.showItemTip)
                       .on('mouseleave', this.clearItemTips);
        }
    };

    function Chart (id, config) {
        this.id = id;
        this.config = config;
        this.init();
    };

    Chart.prototype = ChartJS;


