~function () {
    class Plan {
        //=>给实例增加私有的属性
        constructor() {
            this.planList = null;
        }
        
        //=>给类的原型增加方法:ADD/REMOVE/FIRE
        add(fn) {
            let planList = this.planList;
            for (let i = 0; i < planList.length; i++) {
                let item = planList[i];
                if (item === fn) {
                    return;
                }
            }
            planList.push(fn);
        }

        remove(fn) {
            let planList = this.planList;
            for (let i = 0; i < planList.length; i++) {
                let item = planList[i];
                if (item === fn) {
                    planList[i] = null;
                    return;
                }
            }
        }

        fire(...arg) {
            let planList = this.planList;
            for (let i = 0; i < planList.length; i++) {
                let item = planList[i];
                if (item === null) {
                    planList.splice(i, 1);
                    i--;
                    continue;
                }
                item(...arg);
            }
        }

        //=>把类当做对象增加私有属性
        static Callbacks() {
            let p = new Plan;
            p.planList = [];
            return p;
        }
    }
    window.$ = Plan;
}();

let $plan1 = $.Callbacks();
setTimeout(()=> {
    $plan1.fire(100, 200, 300);
}, 1000);
let fn1 = (...arg)=> {
    console.log(1, arg);
};
$plan1.add(fn1);
$plan1.add((...arg)=> {
    console.log(2, arg);
    $plan1.remove(fn1);
});
$plan1.add((...arg)=> {
    console.log(3, arg);
});


let $plan2 = $.Callbacks();
setTimeout(()=> {
    $plan2.fire(10, 20, 30);
}, 2000);
$plan2.add((...arg)=> {
    console.log(1, arg);
});
$plan2.add((...arg)=> {
    console.log(2, arg);
});

