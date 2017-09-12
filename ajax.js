// JavaScript Document
function json2url(json){
    json.t = Math.random();
    var arr = [];
    for(var name in json){
        arr.push(name+'='+json[name]);
    }
    return arr.join('&');
}

function ajax(json){
    //考虑默认值:
    json = json || {};
    if(!json.url){
        alert('请输入正确的请求路径!');
        return;
    }
    json.time = json.time || 3000;
    json.type = json.type || 'get';
    json.data = json.data || {};
    json.fnLoading && json.fnLoading();//加载loading图片功能;这个函数中写显示,complete中写隐藏;

    var timer = null;
    if(window.XMLHttpRequest){
        var oAjax = new XMLHttpRequest();
    }else{
        var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
    }

    switch(json.type.toLowerCase()){
        case 'get':
            oAjax.open('get',json.url + '?' + json2url(json.data),true);
            oAjax.send();
            break;
        case 'post':
            oAjax.open('post',json.url,true);
            oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            oAjax.send(json2url(json.data));
            break;
    }

    oAjax.onreadystatechange = function(){
        if(oAjax.readyState == 4){
            json.complete && json.complete();//网络请求完成后执行的函数;
            if(oAjax.status >= 200 && oAjax.status < 300 || oAjax.status == 304){
                json.success && json.success(oAjax.responseText);
            }else{
                json.error && json.error(oAjax.status);
            }
            clearTimeout(timer);
        }
    };
    timer = setTimeout(function(){//设置网络超时;
        alert('网络响应超时');
        oAjax.onreadystatechange = null;//网络超时后清除事件;
    },json.time);
};
