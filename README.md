# formValidator
自己写的基于jq的一个表单插件

#示例如下：
```
<form id="add_form"  class="creat_class">
	<div class="item">
	    <span class="lab">描述1:</span>
	    <input class="inp" type="text" name="descs" data-verify="required|number">
	    <div class="tips"></div>
	</div>
	<div class="item">
		<input type="submit" class="sub" value="确定">
	</div>
</form>

$().initValidator({
	form:"#add_form", //表单id
	err_class:"error", //错误提示样式
	parent_div:".item", //每项的父级样式
	tips:".tips", //错误提示内容 样式
	sub:'.sub',//表单提交按钮
	verify:{ //验证规则
		required:[/[\S]+/,"必填项不可为空"],
		number:[/^\d+$/,"只能填写数字"]
	}
});
```
