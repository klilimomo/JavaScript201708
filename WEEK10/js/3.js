~function () {
    let Plan = function () {

    };

    Plan.prototype = {
        constructor: Plan,
        //=>向计划表中增加方法
        add: function (fn) {
            //this->实例
            let planList = this.planList;
            for (var i = 0; i < planList.length; i++) {
                var item = planList[i];
                if (item === fn) {
                    return;
                }
            }
            planList.push(fn);
        },
        //=>移除计划表中的方法
        remove: function (fn) {
            //this->实例
            let planList = this.planList;
            for (var i = 0; i < planList.length; i++) {
                var item = planList[i];
                if (item === fn) {
                    planList[i] = null;
                    break;
                }
            }
        },
        //=>通知计划表中的方法执行
        fire: function () {
            let planList = this.planList;
            for (var i = 0; i < planList.length; i++) {
                var item = planList[i];
                if (item === null) {
                    planList.splice(i, 1);
                    i--;
                    continue;
                }
                item.apply(this, arguments);
            }
        }
    };

    //=>Callbacks：创建一个计划
    Plan.Callbacks = function () {
        //->创建Plan的一个实例
        let p = new Plan;

        //->给当前实例增加一个空的计划表
        p.planList = [];

        return p;
    };


    window.$ = Plan;
}();

let p1 = $.Callbacks();
p1.add(function () {

});
p1.fire(100, 200, 300);


let p2 = $.Callbacks();

//----------------------------------
// let ary = [function () {
//     console.log(1);
// }, function () {
//     console.log(2);
// }];
// for (var i = 0; i < ary.length; i++) {
//     var item = ary[i];//->item=xxxfff000
//     if (i === 0) {
//         item = null;//->item=null
//         break;
//     }
// }
// console.log(ary);














