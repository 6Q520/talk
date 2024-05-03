const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
    const resp = await API.exists(val);
    if (resp.data) {
        return '此账号已被占用，请重新填写'
    }
});

const txtNicknameValidator = new FieldValidator('txtNickname', async function (val) {
    if (!val) {
        return '请填写昵称';
    }
});

const txtPasswordValidator = new FieldValidator('txtLoginPwd', async function (val) {
    if (!val) {
        return '请填写密码';
    }
})

const txtLoginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', async function (val) {
    if (!val) {
        return '请确认密码';
    }
    if (val !== txtPasswordValidator.input.value) {
        return '两次输入的密码不一致';
    }
})

const from = $('.user-form');

from.addEventListener('submit', async function (e) {
    e.preventDefault();
    const result = await FieldValidator.validator(
        loginIdValidator,
        txtNicknameValidator,
        txtPasswordValidator,
        txtLoginPwdConfirmValidator,
    )

    if (!result) {
        // 验证未通过
        return;
    }
    // const from = $('.user-form');
    // const fromData = new FormData(from);
    // console.log(Object.fromEntries(fromData.entries()));
    const userInfo = {
        loginId: loginIdValidator.input.value,
        nickname: txtNicknameValidator.input.value,
        loginPwd: txtPasswordValidator.input.value,
    }
    const resp = await API.reg(userInfo);
    if (resp.code === 0) {
        alert('注册成功，点击确定，跳转到登录页');
        window.location.href = './login.html';
    }
})

