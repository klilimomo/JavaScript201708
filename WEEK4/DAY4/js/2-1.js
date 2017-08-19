//=>让红色的小盒子运动到右边界的位置:修改当前元素的LEFT样式值

//->获取左边界和右边界的LEFT值
var minL = 0,
    maxL = utils.win('clientWidth') - box.offsetWidth;

//->假设我们设定步长为10PX,接下来我们让当前元素在现有的LEFT基础上累加步长,就可以实现向右运动的动画了
var timer = window.setInterval(function () {
    var curL = utils.css(box, 'left');
    if (curL >= maxL) {
        window.clearInterval(timer);
        return;
    }
    curL += 10;
    utils.css(box, 'left', curL);
}, 17);


//----------------------------------------
// window.setInterval(function () {
//     var curL = utils.css(box, 'left');//->获取当前的LEFT值
//     curL += 10;//->在现有的基础上累加步长实现当前这一步动画
//     utils.css(box, 'left', curL);//->把累加后的结果设置给元素,让元素运动到这个位置即可
// }, 17);//->我们设置动画的时候,时间因子一般都设置为17MS,也就是每隔17MS运动一步,17是在各个浏览器中动画效果相对流畅的一个值
