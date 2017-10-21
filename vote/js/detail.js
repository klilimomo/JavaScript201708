let detailRender = (()=> {
    let $headerBox = $('.headerBox'),
        $myVote = $('#myVote').find('.list'),
        $voteMy = $('#voteMy').find('.list'),
        $voteBtn = null;

    //=>解析URL传递的参数值
    let {userId}=window.location.href.myQueryURLParameter();
    userId = userId || 0;

    let lookMe = false,
        isMatch = 0,
        $plan = $.Callbacks();

    //=>展示基础信息
    $plan.add(result=> {
        isMatch = result['isMatch'];

        let str = ``;
        str += `<div class="userInfo">
            <img src="${result['picture']}" alt="" class="picture">
            <p class="info">
                <span>${result['name']}</span>
                ${result['isMatch'] == 1 ? ` | <span>编号#${result['matchId']}</span>` : ``}
            </p>
            <p class="bio">${result['phone']}</p>
            <div class="vote">${result['voteNum']}</div>
        </div>
        ${result['isMatch'] == 1 ? `<div class="slogan">${result['slogan']}</div>` : ``}
        
        <a href="javascript:;" class="voteBtn">投他一票</a>`;

        $headerBox.html(str);
        $voteBtn = $headerBox.find('.voteBtn');
    });

    //=>检测当前查询用户是否已经被登录的用户投递过
    $plan.add(result=> {
        if (lookMe) $voteBtn.remove();

        if (isMatch == 0) $voteBtn.remove();

        $.ajax({
            url: '/checkUser',
            data: {
                userId: userInfo ? userInfo['id'] : 0,
                checkId: userId
            },
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result['code'] == 0 && result['isVote'] == 1) {
                    $voteBtn.remove();
                }
            }
        });
    });

    //=>投他一票(HEADER区域的按钮)
    $plan.add(result=> {
        $voteBtn.tap(function () {
            if (!userInfo) {
                new Dialog('投票前请先登录!');
                return;
            }
            voteEvent(userInfo['id'], userId, function () {
                new Dialog('投票成功!', function () {
                    window.location.reload(true);
                }, false);
            });
        });
    });

    //=>获取投递我的和我投递的
    $plan.add(result=> {
        if (!lookMe) return;
        sendVoteListAjax(0);
        sendVoteListAjax(1);
    });

    //=>投票(LIST区域的按钮)
    $plan.add(result=> {
        $voteMy.tap(function (e) {
            let target = e.target,
                $target = $(target);
            if (target.className === 'voteBtn') {
                let participantId = $target.attr('data-id');
                voteEvent(userInfo['id'], participantId, function () {
                    new Dialog('投票成功!', function () {
                        window.location.reload(true);
                    }, false);
                });
            }
        });
    });

    function voteEvent(userId, participantId, callback) {
        $.ajax({
            url: `/vote?userId=${userId}&participantId=${participantId}`,
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result['code'] == 1) {
                    new Dialog('投票失败,请稍后再试!');
                    return;
                }
                callback && callback();
            }
        });
    }

    function bindVoteList(result, flag) {
        let str = ``;
        $.each(result, function (index, item) {
            str += `<li>
                <a href="detail.html?userId=${item['id']}">
                    <img src="${item['picture']}" alt="" class="picture">
                    <p class="title">${item['name']}</p>
                    <p class="bio">${item['slogan'] || '--'}</p>
                </a>
                <div class="vote">
                    <span class="voteNum">${item['voteNum']}</span>
                    
                    ${item['isVote'] == 0 && item['slogan'] != '' ? `<a href="javascript:;" class="voteBtn" data-id="${item['id']}">投他一票</a>` : ``}
                </div>
            </li>`;
        });
        flag === 0 ? $voteMy.html(str) : $myVote.html(str);
    }

    function sendVoteListAjax(flag) {
        //=>FLAG=0：谁投递的我  FLAG=1：我投递的谁
        let url = flag === 0 ? '/getVoteMy' : '/getMyVote';
        $.ajax({
            url: `${url}?userId=${userInfo['id']}`,
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (result['code'] == 1) return;
                flag === 0 ? $voteMy.parent().css('display', 'block') : $myVote.parent().css('display', 'block');
                bindVoteList(result['list'], flag);
            }
        });
    }

    return {
        init(){
            //=>如果没有传递用户的ID,也没有登录态:跳转到登录页面
            if (userId == 0 && !userInfo) {
                new Dialog('请您先登录！', function () {
                    window.location.href = `login.html?url=${encodeURIComponent(window.location.href)}`;
                }, false);
                return;
            }

            //=>检测是看别人的信息还是看自己的信息
            if (userId == 0 || (userInfo && userId == userInfo['id'])) {
                lookMe = true;
            }

            //=>获取用户的基础信息
            $.ajax({
                url: '/getUser',
                data: {
                    userId: lookMe ? userInfo['id'] : userId
                },
                dataType: 'json',
                cache: false,
                success: function (result) {
                    if (result['code'] == 1) {
                        new Dialog('没有查找到此用户的信息！', function () {
                            window.location.href = 'index.html';
                        }, false);
                        return;
                    }
                    $plan.fire(result['data']);
                }
            });
        }
    }
})();
detailRender.init();