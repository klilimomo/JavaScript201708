let loginRender = (()=> {
    let $userName = $('#userName'),
        $userPass = $('#userPass'),
        $submit = $('#submit');

    let {url} = window.location.href.myQueryURLParameter();

    let submitFn = ()=> {
        let success = (result)=> {
            if (result['code'] == 1) {
                new Dialog('登录失败，请您重试！', function () {
                    window.location.reload(true);
                });
                return;
            }

            //=>设置本地登录态
            cookie.set('userInfo', JSON.stringify(result['data']));
            if (url) {
                window.location.href = decodeURIComponent(url);
                return;
            }
            window.location.href = 'index.html';
        };

        $.ajax({
            url: '/login',
            type: 'post',
            data: {
                name: $userName.val().trim(),
                password: hex_md5($userPass.val().trim())
            },
            dataType: 'json',
            success: success
        });
    };

    return {
        init(){
            $submit.tap(submitFn);
        }
    }
})();
loginRender.init();