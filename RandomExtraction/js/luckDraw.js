~function () {
    function ajax(url) {
        var data = null;
        var xhr = new XMLHttpRequest;
        xhr.open('GET', url + '?_=' + Math.random(), false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = utils.toJSON(xhr.responseText);
            }
        };
        xhr.send(null);
        return data;
    }

    window.ajax = ajax;
}();

//->分别获取正常的分组数据和特殊的分组数据
var normal = ajax('json/normal.json'),
    special = ajax('json/special.json');

//->把特殊的数据合并到正常的数据中


//->ALREADY
var ary = [];

//->COMPUTED
var box = document.getElementById('box');
function fn() {
    var res = null;
    while (!res) {
        var ran = Math.round(Math.random() * 11 + 1);
        var personAry = dataList[ran],
            personLen = personAry.length;
        ran = Math.round(Math.random() * (personAry.length - 1));
        res = personAry[ran];
        if (ary.indexOf(res) > -1) {
            res = null;
        }
    }

    //->ASSIGN
    box.innerHTML = res;
}

//->EVEN
var isRun = false,
    autoTimer = null;
document.onkeyup = function (e) {
    if (e.keyCode !== 32) return;

    isRun = !isRun;
    if (isRun) {
        autoTimer = setInterval(fn, 50);
        return;
    }
    clearInterval(autoTimer);
    ary.push(box.innerHTML);
};














