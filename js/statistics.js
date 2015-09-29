  var randomColorGenerator = function () { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
};
function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
  var data = [
    {
        value: 300,
        color:randomColorGenerator(),
        highlight: randomColorGenerator(),
        label: "Red"
    },
    {
        value: 50,
        color: randomColorGenerator(),
        highlight: randomColorGenerator(),
        label: "Green"
    },
    {
        value: 100,
        color: randomColorGenerator(),
        highlight: randomColorGenerator(),
        label: "Yellow"
    }
];
var ctx = $("#myChart").get(0).getContext("2d");
// This will get the first returned node in the jQuery collection.
var myPieChart = new Chart(ctx).Pie(data);