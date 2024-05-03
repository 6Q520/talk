const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
});

const txtPasswordValidator = new FieldValidator('txtLoginPwd', async function (val) {
    if (!val) {
        return '请填写密码';
    }
})

const from = $('.user-form');

from.addEventListener('submit', async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validator(
        loginIdValidator,
        txtPasswordValidator,
    )

    if (!result) {
        // 验证未通过
        return;
    }
    const from = $('.user-form');
    const fromData = new FormData(from);
    const data = Object.fromEntries(fromData.entries());
    const resp = await API.login(data);
    if (resp.code === 0) {
        alert('登录成功，点击确定，跳转到首页');
        window.location.href = './index.html';
    } else {
        alert(resp.msg);
        loginIdValidator.input.value = '';
        txtPasswordValidator.input.value = '';
    }
})

