/***********定义变量************/
var baseurl_init = "http://efwplus.cn/Controller.aspx?controller=IotPlatform@RaspberryPiController&method=GetRaspberryPiList";
var baseurl_send = "Controller.aspx?controller=IotPlatform@RaspberryPiController&method=SetRaspberryPiData";
var baseurl_get = "Controller.aspx?controller=IotPlatform@RaspberryPiController&method=GetRaspberryPiData";
var baseurl_getall = "Controller.aspx?controller=IotPlatform@RaspberryPiController&method=GetRaspberryPiDataAll";

/***********初始化入口**********/
$(function () {
    initdata();
});

function initdata() {
    GetAjax(baseurl_init, function (data) {
        $('#pilist').empty();
        $('#pidev').empty();
        var host = $.query.get('hostid');
        var dkey = $.query.get('devid');
        if (data.dicPiList) {
            $.each(data.dicPiList, function (i, n) {//n[0]名称 n[1]在线/掉线 n[2]时间
				var cls=(i == host ? " checked" : "") + (n[1] == "0" ? " disabled='disabled'" : "");
				var title="[" + (n[1] == "0" ? "掉线" : "在线") + "]" + n[0] ;
                $('#pilist').append('<div class="mui-input-row mui-radio mui-left"><label>'+title+'</label><input name="radio1" type="radio" '+cls+' value='+i+' title='+n[0]+'></div>')
            });
        }
        if (data.dicPiDev) {
            $.each(data.dicPiDev, function (i, n) {
            	var cls=(i == dkey ? " checked" : "");
				var title=n;
                $('#pidev').append('<div class="mui-input-row mui-radio mui-left"><label>'+title+'</label><input name="radio2" type="radio" '+cls+' value='+i+' title='+n+'></div>')
            });
        }


    });
}

function commithost(){
	var host= $("input[name='radio1']:checked");
	var dev= $("input[name='radio2']:checked");
	if(host.length==0){
		showmsg(1,"必须选择一个树莓派主机！");
		return;
	}
	if(dev.length==0){
		showmsg(1,"必须选择一个设备功能！");
		return;
	}
	var hostid=$(host[0]).val();
	var devid=$(dev[0]).val();
	var title=$(host[0]).attr("title")+","+$(dev[0]).attr("title");
	window.location="iotdebug.html?hostid="+hostid+"&devid="+devid+"&title="+title;
}


/***********公共方法************/
function showmsg(flag,txt){
	if (txt != '') {
		if (flag == 0) { //后台操作成功
			//alert("结果: " + txt);
			//$('#showmsg').removeClass("msg-fontcolor-red msg-fontcolor-blue").addClass("msg-fontcolor-blue").html(txt);
			mui.toast(txt);
		}else{
			//alert("结果: " + txt);
			//$('#showmsg').removeClass("msg-fontcolor-red msg-fontcolor-blue").addClass("msg-fontcolor-red").html(txt);
			mui.toast(txt);
		}
	}
}

function simpleAjax(requestUrl) {
    $.ajax({
        type: "GET",
        url: requestUrl,
        success: function (msg) {
            var retobject = eval('(' + msg + ')');
			showmsg(retobject.ret,retobject.msg)
        }
    });
}

function GetAjax(requestUrl, callback) {
    $.ajax({
        type: "GET",
        url: requestUrl,
        success: function (msg) {
            var retobject = eval('(' + msg + ')');
            if (retobject.ret == 0) { //后台操作成功
                if (callback)
                    callback(retobject.data);
            }
            showmsg(retobject.ret,retobject.msg)
        }
    });
}

function PostAjax(requestUrl, requestData, callback) {
    $.ajax({
        type: "POST",
        url: requestUrl,
        data: requestData,
        success: function (msg) {
            var retobject = eval('(' + msg + ')');
            if (retobject.ret == 0) { //后台操作成功
                if (callback)
                    callback(retobject.data);
            }
            showmsg(retobject.ret,retobject.msg)
        }
    });
}