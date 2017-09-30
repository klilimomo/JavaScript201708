String.prototype.myQueryURLParameter = function myQueryURLParameter() {
    let obj = {},
        reg = /([^?=&]+)=([^?=&]+)/g;
    this.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
};

/*--DIALOG--*/
~function () {
    class Dialog {
        constructor(content, callback, isTap) {
            this.content = content;
            this.callback = callback;
            this.isTap = typeof isTap === 'undefined' ? true : isTap;
            this.init();
        }

        init() {
            this.createMark();

            //->移除MARK
            this.isTap === true ? this.markEvent() : null;
            this.timer = setTimeout(()=> {
                this.removeMark();
            }, 1000);
        }

        createMark() {
            //->创建新的之前先把之前的移除掉
            this.removeMark();

            //->创建新的
            let mark = document.createElement('div');
            this.mark = mark;
            mark.className = 'markDialog';
            mark.innerHTML = `<div class="box">
                <h3>系统提示</h3>
                <div class="content">${this.content}</div>
            </div>`;
            document.body.appendChild(mark);
        }

        removeMark() {
            clearTimeout(this.timer);
            let mark = this.mark;
            if (mark) {
                document.body.removeChild(mark);
                this.callback && this.callback();
            }
        }

        markEvent() {
            let mark = this.mark;
            if (!mark) return;

            $(mark).tap((e)=> {
                if (e.target.className === 'markDialog') {
                    this.removeMark();
                }
            });
        }
    }
    window.Dialog = Dialog;
}();

/*--COOKIE--*/
let cookie = (function () {
    let setValue = (name, value, expires = (new Date(new Date().getTime() + (1000 * 60 * 60 * 24))), path = '/', domain = '')=> {
        document.cookie = `${name}=${escape(value)};expires=${expires.toGMTString()};path=${path};domain=${domain}`;
    };

    let getValue = name=> {
        let cookieInfo = document.cookie,
            reg = new RegExp(`(?:^| )${name}=([^;]*)(?:;|$)`),
            ary = cookieInfo.match(reg);
        return ary ? unescape(ary[1]) : null;
    };

    let removeValue = (name, path = '/', domain = '')=> {
        let value = getValue(name);
        if (value) {
            document.cookie = `${name}= ;path=${path};domain=${domain};expires=Fri,02-Jan-1970 00:00:00 GMT`;
        }
    };

    return {
        set: setValue,
        get: getValue,
        remove: removeValue
    }
})();

/*--NAV--*/
let navRender = (function () {
    let $navBox = $('.navBox'),
        $link = $navBox.find('a');

    return {
        init(){
            //=>验证登录态
            let userInfo = cookie.get('userInfo');
            if (userInfo) {
                userInfo = JSON.parse(userInfo);

                $link.eq(3).html(userInfo['name']);
                $link.each(function (index) {
                    if (index === 1 || index === 2) {
                        $(this).css('display', 'none');
                    } else {
                        $(this).css('display', 'inline-block');
                    }
                });
            }

            //=>点击跳转页面
            $link.tap(function () {
                let index = $(this).index();

                //=>退出登录
                if (index == 4) {
                    cookie.remove('userInfo');
                    window.location.reload(true);
                    return;
                }

                //=>登录
                if (index == 1) {
                    window.location.href = `login.html?url=${encodeURIComponent(window.location.href)}`;
                    return;
                }

                //=>注册
                if (index == 2) {
                    window.location.href = `register.html?url=${encodeURIComponent(window.location.href)}`;
                }
            });

            //=>暴露到全局登录态信息
            window.userInfo = userInfo;
        }
    }
})();
navRender.init();