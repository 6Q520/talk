(async () => {
    // 验证是否有登录，没有则跳转至登录页，反之获取登录信息
    const resp = await API.profile();
    const user = resp.data;
    if (!user) {
        alert(resp.msg)
        window.location.href = '/login.html';
        return;
    }

    // 需要用的dom元素
    const doms = {
        chatContainer: $('.chat-container'),
        aside: {
            loginId: $('#loginId'),
            nickname: $('#nickname'),
        },
        close: $('.close'),
        txtMsg: $('#txtMsg'),
        msgContainer: $('.msg-container'),
    }
    // 下面的代码环境，一定是登录状态

    /**
     * 设置用户信息
     */
    function setUserInfo() {
        doms.aside.loginId.innerText = user.loginId;
        doms.aside.nickname.innerText = user.nickname;
    }
    setUserInfo();

    /**
     * 让聊天区域的滚动条滚动到底
     */
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
        console.log(doms.chatContainer.scrollTop);
        console.log(doms.chatContainer.scrollHeight);
    }
    scrollBottom()

    /**
     * 用户注销
     */
    function loginOut() {
        API.loginOut();
        window.location = './login.html';
    }
    doms.close.addEventListener('click', loginOut);

    /**
     * 根据消息对象，将其添加到页面中
     */

    function addChat(chatInfo) {
        const div = $$$('div');
        div.classList.add('chat-item');
        if (chatInfo.from) { // 判断其是否有值，有值说明是当前用户发送给机器人信息
            div.classList.add('me');
        }
        // 创建头像
        const img = $$$('img');
        img.classList.add('chat-avatar');
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';
        // 创建信息
        const chatContent = $$$('div');
        chatContent.classList.add('chat-content');
        chatContent.innerText = chatInfo.content;
        // 创建发送的时间
        const date = $$$('div');
        date.classList.add('chat-date');
        date.innerText = formatDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(chatContent);
        div.appendChild(date);
        doms.chatContainer.appendChild(div);
    }

    /**
     * 加载历史记录
     */
    async function loadHistory() {
        const resp = await API.getHistory();
        for (const item of resp.data) {
            addChat(item);
        }
        scrollBottom()
    }
    loadHistory()

    /**
     * 格式化时间
     * @param {String} timestamp 时间戳
     */
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }


    // 发送聊天
    async function sendChat() {
        // 这里不需要使用异步，因为当发送消息之后不管是否响应成功，都应该将消息展示在对话框内，如果等响应成功后再将信息添加到对话框内，会给用户一种卡死的现象
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        addChat({
            from: user.loginId,
            to: null,
            createdAt: Date.now(),// Date.now() -- 当前时间戳
            content,
        })
        doms.txtMsg.value = '';
        scrollBottom();
        // 获取聊天记录
        const resp = await API.sendChat(content);
        addChat({
            from: null,
            to: user.loginId,
            createdAt: formatDate(resp.data.createdAt),
            content: resp.data.content,
        })
        scrollBottom();
    }

    // 发送消息事件
    doms.msgContainer.addEventListener('submit', function (e) {
        // 组织默认事件
        e.preventDefault();
        sendChat();
        scrollBottom();
    })
})()