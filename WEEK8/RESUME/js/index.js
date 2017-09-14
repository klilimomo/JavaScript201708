let loadingRender = (function () {
    //->需要预先加载的所有图片
    let imgList = ['img/icon.png',
        'img/music.svg',
        'img/zf_concatAddress.png',
        'img/zf_concatInfo.png',
        'img/zf_concatPhone.png',
        'img/zf_course.png',
        'img/zf_course1.png',
        'img/zf_course2.png',
        'img/zf_course3.png',
        'img/zf_course4.png',
        'img/zf_course5.png',
        'img/zf_course6.png',
        'img/zf_cube1.png',
        'img/zf_cube2.png',
        'img/zf_cube3.png',
        'img/zf_cube4.png',
        'img/zf_cube5.png',
        'img/zf_cube6.png',
        'img/zf_cubeBg.jpg',
        'img/zf_cubeTip.png',
        'img/zf_emploment.png',
        'img/zf_messageArrow1.png',
        'img/zf_messageArrow2.png',
        'img/zf_messageChat.png',
        'img/zf_messageKeyboard.png',
        'img/zf_messageLogo.png',
        'img/zf_messageStudent.png',
        'img/zf_outline.png',
        'img/zf_phoneBg.jpg',
        'img/zf_phoneDetail.png',
        'img/zf_phoneListen.png',
        'img/zf_phoneLogo.png',
        'img/zf_return.png',
        'img/zf_style1.jpg',
        'img/zf_style2.jpg',
        'img/zf_style3.jpg',
        'img/zf_styleTip1.png',
        'img/zf_styleTip2.png',
        'img/zf_teacher1.png',
        'img/zf_teacher2.png',
        'img/zf_teacher3.jpg',
        'img/zf_teacher4.png',
        'img/zf_teacher5.png',
        'img/zf_teacher6.png',
        'img/zf_teacherTip.png'];

    let $loading = $('.loading'),
        $already = $loading.find('.already');

    let n = 0,
        m = imgList.length,
        timer = null,
        isEnter = false;

    //->加载图片,计算加载量
    function loadImg() {
        $.each(imgList, function (index, item) {
            let oImg = new Image;
            oImg.src = item;
            oImg.onload = function () {
                $already.css('width', (++n) / m * 100 + '%');
                if (n >= m) {
                    setTimeout(()=> {
                        //->加载完成:LOADING消失,PHONE操作(延迟2S)
                        if (isEnter) return;
                        isEnter = true;
                        clearTimeout(timer);
                        $loading.remove();
                        phoneRender.init();
                    }, 2000);
                }
            }
        });
    }

    return {
        init: function () {
            $loading.css('display', 'block');
            loadImg();
            //->给一个限定的时间(超过10S,如果有个别图片无法加载,我们也直接进入到下一个操作了)
            timer = setTimeout(()=> {
                if (n < m) {
                    if (isEnter) return;
                    isEnter = true;
                    $already.css('width', '100%');
                    setTimeout(()=> {
                        $loading.remove();
                        phoneRender.init();
                    }, 2000);
                }
            }, 10000);
        }
    }
})();

/*--PHONE--*/
let phoneRender = (function () {
    let $phone = $('.phone'),
        $listen = $phone.find('.listen'),
        $listenTouch = $listen.find('.touch'),
        $detail = $phone.find('.detail'),
        $detailTouch = $detail.find('.touch'),
        $time = $phone.find('span');

    let bellAudio = $('#bellAudio')[0],
        sayAudio = $('#sayAudio')[0];

    function listenTouch() {
        $listenTouch.singleTap(function () {
            bellAudio.pause();
            $(bellAudio).remove();

            $listen.remove();
            $detail.css('transform', 'translateY(0)')
                .on('webkitTransitionEnd', function () {
                    //->TRANSITION动画结束
                    //JS中控制CSS3属性,只写一套加前缀的即可
                    $time.css('display', 'block');
                    sayAudio.play();
                    watchTime();
                });
        });
    }

    let watchTimer = null;

    function watchTime() {
        watchTimer = setInterval(()=> {
            var curTime = sayAudio.currentTime,
                durTime = sayAudio.duration;
            if (curTime >= durTime) {
                message();
                return;
            }
            var minute = Math.floor(curTime / 60),
                second = Math.ceil(curTime - minute * 60);
            minute < 10 ? minute = '0' + minute : null;
            second < 10 ? second = '0' + second : null;
            $time.html(minute + ':' + second);
        }, 1000);
    }

    function message() {
        clearInterval(watchTimer);
        sayAudio.pause();
        $(sayAudio).remove();
        $phone.remove();
        messageRender.init();
    }

    return {
        init: function () {
            $phone.css('display', 'block');

            //->PLAY BELL
            bellAudio.play();

            //->LISTEN TOUCH
            listenTouch();

            //->DETAIL TOUCH
            $detailTouch.singleTap(message);
        }
    }
})();

/*--MESSAGE--*/
let messageRender = (function () {
    let $message = $('.message'),
        musicAudio = $('#musicAudio')[0],
        $wrapper = $message.find('.wrapper'),
        $messageList = $wrapper.find('li'),
        $keyboard = $message.find('.keyboard'),
        $text = $keyboard.find('.text'),
        $submit = $keyboard.find('.submit');

    let autoTimer = null,
        step = -1,
        initTranslateY = 0;

    function messageMove() {
        let $cur = $messageList.eq(++step);
        //->显示每一条消息
        $cur.css({
            transform: 'translateY(0)',
            opacity: 1
        });

        //->当第三条消息完成后(TRANSITION动画完成了),展示键盘(此时停止自动出消息)
        if (step === 2) {
            clearInterval(autoTimer);
            //->我们需要操作两个样式执行过渡动画,事件被执行两次(webkitTransitionEnd:有几个样式需要执行过渡动画,事件就会被触发执行几次)
            let fn = function () {
                $cur.off('webkitTransitionEnd', fn);
                keyboard();
            };
            $cur.on('webkitTransitionEnd', fn);
        }

        //->从第五条展示开始,消息列表要整体上移了(当前这条消息高度的基础上+10是上移的距离)
        if (step >= 4) {
            initTranslateY -= $cur[0].offsetHeight + 10;
            $wrapper.css('transform', 'translateY(' + initTranslateY + 'px)');
        }

        //->结束:结束音频,干掉当前页,进入下一个页面
        if (step >= $messageList.length - 1) {
            clearInterval(autoTimer);
            musicAudio.pause();
            $(musicAudio).remove();
            setTimeout(()=> {
                $message.remove();
                cubeRender.init();
            }, 2000);
        }
    }

    function keyboard() {
        //->让键盘显示
        $keyboard.css('transform', 'translateY(0)');

        //->显示文字：文字打印机
        //JQ中的ONE也是绑定事件,只不过只绑定一次而已,触发一次后自动把绑定的方法移除
        $keyboard.one('webkitTransitionEnd', ()=> {
            let str = '都学了啊，可我还是找不到好工作！',
                textTimer = null,
                n = -1;
            textTimer = setInterval(()=> {
                if (n >= str.length - 1) {
                    clearInterval(textTimer);
                    //->显示提交按钮
                    $submit.css('display', 'block');
                    return;
                }
                let textVal = $text.html();
                textVal += str[++n];
                $text.html(textVal);
            }, 100);
        });
    }

    function submitEvent() {
        $submit.singleTap(function () {
            $text.html('');
            $keyboard.css('transform', 'translateY(3.7rem)');

            messageMove();
            autoTimer = setInterval(messageMove, 1500);
        });
    }

    return {
        init: function () {
            $message.css('display', 'block');
            musicAudio.play();
            autoTimer = setInterval(messageMove, 1500);
            submitEvent();
        }
    }
})();

/*--CUBE--*/
let cubeRender = (function () {
    return {
        init: function () {

        }
    }
})();

messageRender.init();
