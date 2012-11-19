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

        minOffset : 20,
        topOffset : 40,
        offset : 20,
        lineOffset : 25,
        textOffset : 3,
        textOffsetMax    : 8,
        percentTick : 20,

        svg : '',

        init : function() {
            this.setConfig();
            // this.setGradient();
            this.renderAxisX();
            this.renderAxisY();
            this.renderData();
            this.renderChart();
        },

        setConfig : function() {
            this.w = this.config.width - this.minOffset;
            this.h = this.config.height - this.minOffset;
        },

        setGradient : function() {

            function colorLuminance(hex, lum) 
            {
                // rgb = rgb.replace('rgb(','');
                // rgb = rgb.replace(')','');

                // var hex = (0x1000000 | rgb).toString(16).substring(1);

                // validate hex string  
                hex = String(hex).replace(/[^0-9a-f]/gi, '');  
                if (hex.length < 6) {  
                    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];  
                }  
                lum = lum || 0;  
                // convert to decimal and change luminosity  
                var rgb = "#", c, i;  
                for (i = 0; i < 3; i++) {  
                    c = parseInt(hex.substr(i*2,2), 16);  
                    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);  
                    rgb += ("00"+c).substr(c.length);  
                }  
                return rgb;  
            }

            var c = this.config.data.color,
                fromColor = colorLuminance('66D902', + 1),
                toColor = colorLuminance('66D902', + 1),
                defs = 
                   '<defs>' +
                     '<linearGradient id="gradItemBox" x1="0%" y1="0%" x2="0%" y2=100%">' +
                       '<stop offset="0%" style="stop-color:' + fromColor + '; stop-opacity:1" />' +
                       '<stop offset="100%" style="stop-color:' + toColor + '; stop-opacity:1" />' +
                     '</linearGradient>' +
                   '</defs>';

            this.svg += defs;
        },

        renderChart : function() {
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" ' + 
                        'width="' + (this.w + this.minOffset) + '" height="' + (this.h + this.minOffset) + '">' +
                        this.svg +
                      '</svg>';

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

        renderAxisX : function() {

            var g = '',
                points = this.config.axisX.points,
                step = (this.w + this.lineOffset + this.minOffset) / points.length;

            for (var i = 0; i < points.length; i++) {
                var x = (i === points.length - 1) ? (this.w - this.lineOffset) : ((step * i) + this.offset);

                g += this.line({
                        x1 : x,
                        y1 : this.h + 3,
                        x2 : x,
                        y2 : this.h - 3,
                        stroke : '#C0C0C0',
                        strokeW : '1'
                });

                g += '<text x="' + (x - 6) + '" y="' + (this.h + 15) + '" class="grid-label" style="fill: #999999;">' + points[i] + '</text>';
            }

            this.renderGroup(g);
        },

        renderAxisY : function() {

            var g = '',
                points = this.config.axisY.points,
                step = Math.floor( (this.h - this.offset - this.topOffset) / (points.length - 1)),
                percentStep = Math.floor( (this.h - this.offset - this.topOffset) / (100 / this.percentTick));
                color = this.config.middleLineColor;

            // baseline
            g += this.line({
                    x1 : this.offset,
                    y1 : this.h,
                    x2 : this.w - this.lineOffset,
                    y2 : this.h,
                    stroke : '#C0C0C0',
                    strokeW : '1'
            });

            // point lines
            for (var i = 1; i < points.length; i++) {

                var y = this.h - (step * i);

                g += this.line({
                        x1 : this.offset,
                        y1 : y,
                        x2 : this.w - this.lineOffset,
                        y2 : y,
                        stroke : color,
                        strokeW : '1',
                        strokeDA : '4,4'
                });

                g += '<text x="' + 0 + '" y="' + (y + this.textOffset) + '" class="grid-label" style="stroke: ' + color + '">' + points[i] + '</text>';
            }

            // percent
            var pX = this.w - this.offset;

            for (var i = 0; i <= 100; i += this.percentTick) {

                var y = this.h - (percentStep * (i / this.percentTick) );
                    label = (i == 100) ? '100%' : i + '';

                g += '<text x="' +  pX + '" y="' + (y + this.textOffset) + '" class="grid-label" style="fill: #AAA;">' +  label + '</text>';
            }

            this.renderGroup(g);
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
                    'stroke="' + obj.color + '" stroke-width="2" transform="rotate(0 0 0)"' + 
                    'stroke-linecap="square" stroke-linejoin="round" fill="url(#gradItemBox)"></path>';

            item += '<text x="' +  (x1 + (halfW / 2)) + '" y="' + (y1 + (halfW - tipH)) + '" class="grid-label" style="stroke: #666;">' +  obj.label + '</text>';
            item += '<text x="' +  (x1 + (halfW / 2)) + '" y="' + (y1 + halfH + tipH) + '" class="grid-label" style="stroke: #AAA;">' +  obj.labelPercent + '</text>';
            return item;
        },

        renderData : function() {

            var g = '',
                w = this.w - this.lineOffset - (this.textOffset * 2),
                h = this.h - (this.minOffset / 2),
                min = this.config.axisX.min,
                max = this.config.axisX.max,
                maxY = (this.config.axisY.max - this.config.axisY.min),
                item = this.config.data;

            var line = [], l = '';

            // circles
            for (var i = 0, m = item.points.length; i < m; i++) {

                var x = item.points[i].x,
                    cx =  ((x - min) * w / (max - min)) + (this.lineOffset / 2), 
                    cy =  h - (item.points[i].y * h / maxY) + (this.minOffset),
                    label = item.points[i].percent + '(' + item.points[i].y + '), ' + x;

                line.push({x : cx, y : cy});

                g += '<circle cx="' + cx + '" cy="' + cy + '" r="5" stroke="' + item.color + '" stroke-width="2" fill="white"/>';
                // g += '<text x="' +  (cx + 10) + '" y="' + (cy + this.textOffset) + '" class="grid-label" style="fill: #AAA;">' +  label + '</text>';

                // line y
                g += this.line({
                        x1 : cx,
                        y1 : cy + this.minOffset,
                        x2 : cx,
                        y2 : this.h,
                        stroke : '#C0C0C0',
                        strokeW : '1',
                        strokeDA : '4,4'
                });

                // text y
                g += '<text x="' +  (cx - this.textOffsetMax) + '" y="' + (this.h - this.textOffsetMax) + '" class="grid-label" style="stroke: #AAA;">' +  x + '</text>';

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
        }
    };

    function Chart (id, config) {
        this.id = id;
        this.config = config;
        this.init();
    };

    Chart.prototype = ChartJS;

    var debug = true;




