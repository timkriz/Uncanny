
var _currentFill = "#f00"; // red
$svg = $("#main_title_svg");
$("#u", $svg).attr('style', "fill:"+_currentFill);

$unpacked_svg = $( $svg ).children().children();
console.log($unpacked_svg);
console.log($unpacked_svg.length);

var ran_colors = ["#44CCFF", "#44CCFF","#7494EA","#FF88FE",
"#44CCFF","#35FF69","#D138BF"];

setInterval(function(){ 
    $unpacked_svg.each(function(index){
        var curr_color = ran_colors[Math.floor(Math.random() * 6) + 1]; 
        $( this ).children().attr('style', 'fill:'+curr_color)
    });
}, 70);
