// 登录和注册的表单项验证通用代码
class FieldValidator {
    /**
     * 构造器
     * @param {String} txtId 文本框的ID
     * @param {Function} validatorFunc 验证规则函数，某个表单项需要验证时调用，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
     */
    constructor(txtId, validatorFunc) {
        this.input = $('#' + txtId);
        this.validatorFunc = validatorFunc;
        this.p = this.input.nextElementSibling;
        this.input.onblur = () => {
            this.validator();
        }
    }

    /**
     * 验证，成功返回true，失败返回false
     */
    async validator() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }
    /**
     * 静态方法，验证所有表单项的结果，成功则返回true，失败则返回false
     * @param {FieldValidator[]}  validators
     */
    static async validator(...validators) {
        const proms = validators.map(v => v.validator());
        const result = await Promise.all(proms);
        return result.every(r => r);
    }

}

