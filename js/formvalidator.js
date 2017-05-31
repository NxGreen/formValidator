

/* 
示例如下：
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
	sub:'.sub',
	verify:{ //验证规则
		required:[/[\S]+/,"必填项不可为空"],
		number:[/^\d+$/,"只能填写数字"]
	}
});

2017.05.31 
1.修复verify 深复制的问题
2.增加单选，多选按钮的验证 支持必填
*/

$.fn.extend({
	initValidator:function(option){
		var def={
			form:"#add_task", //表单id
			err_class:"error", //错误提示样式
			parent_div:".form_item", //每项的父级样式
			tips:".tips", //错误提示内容 样式
			sub:'.submit',//提交按钮
			ajax_sub:'',//函数 ajax提交
			verify:{ //验证规则
				required:[/[\S]+/,"必填项不可为空"],
				email: [/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, '请填写正确的邮箱地址'],
				password: [/^[\S]{4,20}$/i, '密码只能由4-20个字符组成'],
				username: [/^[\S]{1,100}$/i, '请输入有效的用户名'],
				code: [/^([a-zA-Z0-9]){4}$/, '请输入有效的验证码'],
				phone: [/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/, '请输入有效的手机号码'],
				range:[]
			}
		}
		var opts=$.extend(true,{},def,option);
		// console.log(opts);

		var verifyElem=$(opts.form).find("*[data-verify]");
		$(verifyElem).each(function(index, el) {
			var _type=$(el).attr("type"),evenname;
			if(_type=="radio"||_type=="checkbox"){ 
				evenname='change';
			}else{
				evenname='blur';
			}
			$(el).on(evenname, function(event) {
				event.preventDefault();
				console.log(evenname)
				$().inputValidator(opts,$(el));
			});
		});


		$(opts.form).on('click', opts.sub, function(event) {
			event.preventDefault();
			if(!$().formValidator(opts)){
				// console.log("普通验证没通过"); 
			    return false;
			}else{
				// console.log("普通验证通过");
				if(opts.ajax_sub){
					opts.ajax_sub();
				}else{
					$(opts.form).submit();
				}
				
			}
			return false;
		});
	},
	formValidator:function(opts){
		var verifyElem=$(opts.form).find("*[data-verify]"),flag=true;
		// console.log(verifyElem);

		//遍历需要验证的表单
		$(verifyElem).each(function(index, el) {
			var _this=$(el),value=_this.val(),
				ver=_this.attr("data-verify").split('|'),
				parent_div=_this.parents(opts.parent_div),
				tips_div=_this.parents(opts.parent_div).find(opts.tips);

				_this.removeClass(opts.err_class);
				parent_div.removeClass(opts.err_class);
				tips_div.empty().hide();

			//返回单个表单验证结果
			flag = $().inputValidator(opts,$(el));
			return flag;

		});
		return flag;
	},
	//对单个input 进行验证
	inputValidator:function(opts,input){
		var _this=$(input),value=_this.val(),flag=true, //默认通过验证
			ver=_this.attr("data-verify").split('|'),tips='',
			parent_div=_this.parents(opts.parent_div),
			_type=_this.attr("type"),
			_name=_this.attr("name"),
			verify = opts.verify;
		tips_div=_this.parents(opts.parent_div).find(opts.tips);
		// console.log(tips_div)
		if(_type=="radio"||_type=="checkbox"){ //单选，多选
			var _val=parent_div.find('input[name="'+_name+'"]:checked').val();
			if(_val==undefined||_val==""){
				$().showErrorMsg(opts,_this,tips||verify['required'][1]);
				flag=false;return flag;
			}else{
				$().showSuccessMsg(opts,_this);
			}
		}else{ //下拉框，密码框，文本框等
			$.each(ver,function(i, item) {
				var isFn = typeof verify[item] === 'function';
				if(verify[item] && (isFn ? tips = verify[item](value, item) : !verify[item][0].test(value)) ){ //验证没通过
					$().showErrorMsg(opts,_this,tips||verify[item][1]);
					flag=false;return flag;
				}else{
					$().showSuccessMsg(opts,_this);
				}
			});
		}
		return flag;
	},
	showErrorMsg:function(opts,inp,msg){
		var parent_div=$(inp).parents(opts.parent_div),
			tips_div=$(inp).parents(opts.parent_div).find(opts.tips);
		tips_div.html(msg).show();
		$(inp).addClass(opts.err_class);
		parent_div.addClass(opts.err_class);
	},
	showSuccessMsg:function(opts,inp){
		var parent_div=$(inp).parents(opts.parent_div),
			tips_div=$(inp).parents(opts.parent_div).find(opts.tips);
		tips_div.empty().hide();
		$(inp).removeClass(opts.err_class);
		parent_div.removeClass(opts.err_class);
	},
})

$().initValidator({
	form:"#card_form", //表单id
	parent_div:".item" //每项的父级样式
});

$("#card_form").on('focus', 'input[type=text],input[type=password]', function(event) {
	event.preventDefault();
	var _this=$(this);
	_this.next(".inpfocus").show();
});

$("#card_form").on('blur', 'input[type=text],input[type=password]', function(event) {
	event.preventDefault();
	var _this=$(this);
	if(_this.val()==""){
	_this.next(".inpfocus").hide();
	}
});

$("#card_form").on('click', '.inpfocus', function(event) {
	event.preventDefault();
	$(this).prev("input").val("");
	$(this).hide();
});
