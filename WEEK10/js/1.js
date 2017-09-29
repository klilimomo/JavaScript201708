function Foo() {
    getName = function () {
        console.log(1);
    };
    return this;
}
Foo.getName = function () {
    console.log(2);
};
Foo.prototype.getName = function () {
    console.log(3);
};
var getName = function () {
    console.log(4);
};
function getName() {
    console.log(5);
}

Foo.getName();//=>2
getName();//=>4
Foo().getName();//=>1
getName();//=>1
new Foo.getName();//=>先获取Foo.getName这个函数，new 这个函数()，把这个函数执行返回这个函数的实例  =>2
new Foo().getName();//=>new Foo()先创建Foo的实例，调用实例的getName =>3
new new Foo().getName();//=>new Foo()返回类的实例f  =>new f.getName() =>在把f.getName这个函数获取到(->3)，把这个函数执行创建这个函数的实例 =>3