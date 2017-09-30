let joinRender = (function () {
    let $slogan = $('#slogan'),
        $spanSlogan = $('#spanSlogan'),
        $submit = $('#submit');

    function checkSlogan() {
        let val = $slogan.val().trim(),
            reg = /^.{10,100}$/;
        if (!reg.test(val)) {
            $spanSlogan.html('输入的内容长度不符合规范！').addClass('error');
            return false;
        }
        $spanSlogan.html('').removeClass('error');
        return true;
    }

    function submitEvent() {
        if (!checkSlogan()) return;
        $.ajax({
            url: '/match',
            data: {
                userId: userInfo['id'],
                slogan: $slogan.val().trim()
            },
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result['code'] == 1) {
                    new Dialog('参与失败，请重试!');
                    return;
                }
                new Dialog('恭喜您成功参加了比赛!', function () {
                    window.location.href = 'index.html';
                }, false);
            }
        });
    }


    return {
        init(){
            //=>验证登录态
            if (!userInfo) {
                new Dialog('参加比赛前需要先登录哦~', function () {
                    window.location.href = `login.html?url=${encodeURIComponent(window.location.href)}`;
                }, false);
                return;
            }

            //=>表单验证
            $slogan.on('blur', checkSlogan);

            //=>提交参赛作品
            $submit.tap(submitEvent);
        }
    }
})();
joinRender.init();