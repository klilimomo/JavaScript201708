//=>发布一个计划
let $plan = $.Callbacks();

setTimeout(()=> {
    //=>FIRE通知计划表中的方法执行
    $plan.fire(100);
}, 1000);

//=>ADD向计划表中增加方法,REMOVE从计划表中移除方法
$plan.add(result=> {
    console.log(1);
});

$plan.add(result=> {
    console.log(2);
});

let $plan2 = $.Callbacks();