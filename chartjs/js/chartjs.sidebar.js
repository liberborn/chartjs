// Chartjs Sidebar

var chartSidebar = {

    show : true,

    cls : 'chart-sidebar',

    menuList : '.chart-sidebar ul span',

    toggle : function() {
        var me = this,
            menu = $(me.menuList);

        $(menu).on('click', function() {
            
            var arrow = $('.arrow-right');

            $(me.menuList + '.active').removeClass('active');
            $(this).addClass('active').after(arrow);

            var item = $(this).attr('data-chart-container'),
                c = $('.chart-container');

            c.removeClass("active").hide();
            $(c[item]).addClass("active").show();
        });        
    },

    hide : function() {
        $('.' + this.cls).hide();
    },

    init : function() {

        if (this.show) {
            this.toggle();
            $('div.chart-container:not(".active")').hide();
        } else {
            this.hide();
        }
    }

};