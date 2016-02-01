/***********定义变量************/
var baseurl_init = "http://efwplus.cn/Controller.aspx?controller=IotPlatform@RaspberryPiController&method=GetRaspberryPiList";
var baseurl_send = "http://efwplus.cn/Controller.aspx?controller=IotPlatform@RaspberryPiController&method=SetRaspberryPiData";
var baseurl_get = "http://efwplus.cn/Controller.aspx?controller=IotPlatform@RaspberryPiController&method=GetRaspberryPiData";
var baseurl_getall = "http://efwplus.cn/Controller.aspx?controller=IotPlatform@RaspberryPiController&method=GetRaspberryPiDataAll";
var host = $.query.get('hostid');
var dkey = $.query.get('devid');
var title=$.query.get('title');
/***********初始化入口**********/
$(function () {
    $('#output').empty();
    //initdata();
    if(host=="undefined"||title==""){
    	$("#txthost").html("选择树莓派主机和功能");
    }else{
    	$("#txthost").html(title);
    }
    
});

function openhost(){
	window.location="iotselecthost.html?hostid="+host+"&devid="+dkey;
}
/***********方法实现************/
function setpidata() {
	try{
		var data=$('#cmdtext').val();
		data= JSON.parse(data);
		data=JSON.stringify(data);
	}catch(err){
		var txt="此页面存在一个错误。\n\n";
		txt+="错误描述: 输入的内容不是正确的JSON字符串\n\n";
		showmsg(1,txt);
		return;
	}
	if (host=="") {
		showmsg(1,"请先选择树莓派主机");
		return;
	}
	if (dkey=="") {
		showmsg(1,"请先选择主机设备");
		return;
	}
	if (data == "") {
		showmsg(1,"发送数据不能为空");
		return;
	}
	var url = baseurl_send + "&authkey=" + host + "&dkey=" + dkey;
	var data = { data: data };
	showmsg(0,"sending to Pi.");
	PostAjax(url, data, function (data) {
		//getpidata();
	});
	
}

function cleardata(){
	$('#cmdtext').val("");
}

function getpidata() {
    //var host = $('#hostid').val();
    //var dkey = $('#devid').val();
    var url = baseurl_get + "&authkey=" + host + "&dkey=" + dkey;
    GetAjax(url, function (data) {
        var text = JSON.stringify(data);
        if (text != '{}') {
            $('#output').prepend('<p><span>' + JSON.stringify(data) + '</span></p>');
        }
    });
}
function getpidataall() {
    //var host = $('#hostid').val();
    //var dkey = $('#devid').val();
    var url = baseurl_getall + "&authkey=" + host + "&dkey=" + dkey;
    GetAjax(url, function (data) {
        var text = JSON.stringify(data);
        if (text != '{}') {
            $('#output').prepend('<p><span>' + JSON.stringify(data) + '</span></p>');
        }
    });
}
var time1;
function startoutput(n) {
    if ($(n).attr('value') == "0") {
        //var host = $('#hostid').val();
        //var dkey = $('#devid').val();
        if (host == "") {
            showmsg(1,"请先选择树莓派主机");
            return;
        }
        if (dkey == "") {
            showmsg(1,"请先选择主机设备");
            return;
        }
        time1 = window.setInterval(getpidata, 1000);
        $(n).attr('value', 1);
        $(n).text("停止");
    } else {
        window.clearInterval(time1);
        $(n).attr('value', 0);
        $(n).text("启动");
    }
}

function clearoutput() {
    $('#output').empty();
}

function alloutput() {
    //var host = $('#hostid').val();
    //var dkey = $('#devid').val();
    if (host=="undefined" || host == "") {
        showmsg(1,"请先选择树莓派主机");
        return;
    }
    if (dkey=="undefined" || dkey == "") {
        showmsg(1,"请先选择主机设备");
        return;
    }
    getpidataall();
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