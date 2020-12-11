
var _currentFill = "#f00"; // red
$svg = $("#main_title_svg");
$("#u", $svg).attr('style', "fill:"+_currentFill);

$unpacked_svg = $( $svg ).children().children();
console.log($unpacked_svg);
console.log($unpacked_svg.length);

var ran_colors = ["#6D2EF1", "#0777FD","#02FEFF","#FF88FE",
"#5FB49C","#16001E","#84828F"];

setInterval(function(){ 
    $unpacked_svg.each(function(index){
        var curr_color = ran_colors[Math.floor(Math.random() * 6) + 1]; 
        $( this ).children().attr('style', 'fill:'+curr_color)
    });
}, 60);
