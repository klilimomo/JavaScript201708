var bannerRender = (function () {
    var bannerData = null,
        banner = document.getElementById('banner'),
        imgBox = utils.byClass('imgBox', banner)[0],
        focus = utils.byClass('focus', banner)[0],
        imgList = null,
        itemList = null,
        focusList = null;

    function queryData() {
        var xhr = new XMLHttpRequest;
        xhr.open('GET', 'json/banner.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                bannerData = utils.toJSON(xhr.responseText);
            }
        };
        xhr.send(null);
        maxNum = bannerData.length;//->获取到数据后记录一下一共有多少张
    }

    function bindHTML() {
        var str = '',
            strFocus = '';
        for (var i = 0; i < bannerData.length; i++) {
            var item = bannerData[i];
            str += '<li>';
            str += '<a href="' + item.link + '">';
            str += '<img src="" data-src="' + item.img + '">';
            str += '</a>';
            str += '</li>';

            var cName = i === step ? 'select' : '';
            strFocus += '<li class="' + cName + '"></li>';
        }

        imgBox.innerHTML = str;
        focus.innerHTML = strFocus;
    }

    function lazyImg(curImg) {
        if (curImg.isLoad) return;
        var tempImg = new Image;
        tempImg.onload = function () {
            curImg.src = tempImg.src;
            tempImg = null;
        };
        tempImg.src = curImg.getAttribute('data-src');
        curImg.isLoad = true;
    }

    //-----------------------

    var step = 0,
        maxNum = 0,
        interval = 3000,
        autoTimer = null;

    function change() {
        //->控制当前层级为一其余的为零
        for (var i = 0; i < itemList.length; i++) {
            var item = itemList[i];
            i === step ? utils.css(item, 'zIndex', 1) : utils.css(item, 'zIndex', 0);
        }

        //->控制透明度:当前透明度为变为一,动画完成其余的透明度为零
        zhufengAnimate({
            curEle: itemList[step],
            target: {opacity: 1},
            duration: 500,
            callBack: function () {
                for (var i = 0; i < itemList.length; i++) {
                    i !== step ? utils.css(itemList[i], 'opacity', 0) : null;
                }
            }
        });

        //->加载真实的图片
        lazyImg(imgList[step]);

        //->焦点对齐
        autoFocus();
    }

    function autoFocus() {
        for (var i = 0; i < focusList.length; i++) {
            var item = focusList[i];
            i === step ? utils.addClass(item, 'select') : utils.removeClass(item, 'select');
        }
    }

    return {
        init: function () {
            queryData();
            bindHTML();
            itemList = utils.children(imgBox, 'li');
            imgList = imgBox.getElementsByTagName('img');
            focusList = utils.children(focus, 'li');

            window.onload = function () {
                var first = itemList[step];
                utils.css(first, {zIndex: 1, opacity: 1});
                lazyImg(imgList[step]);
            };

            //--------------------

            autoTimer = setInterval(function () {
                step++;
                if (step >= maxNum) {
                    step = 0;
                }
                change();
            }, interval);
        }
    }
})();
bannerRender.init();