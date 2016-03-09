/**
 * Created by sky on 15/8/12.
 * 适配手机屏幕
 * 注：标签的尺寸单位请使用 rem(根据html的font-size定义宽度)
 *    页面按照640px宽度定义，如果想要得到640px的宽度，只要修改成6.4rem即可，以此类推！(rem = px/100)
 */

(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        readyRE = /complete|loaded|interactive/,
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
            //window.devicePixelRatio是设备上物理像素和设备独立像素(device-independent pixels (dips))的比例。
            //公式就是: window.devicePixelRatio = 物理像素 / dips (非视网膜屏为1， 视网膜屏为2)
            //docEl.setAttribute("dpr", window.devicePixelRatio ? window.devicePixelRatio : "");
        };
    window.orientation; //safair bug
    // Abort if browser does not support addEventListener
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);

    if (readyRE.test(document.readyState) && document.body)
        recalc();
    else
        doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


//全局参数与方法 ch
var global = {
    base: '/legend/',
    args: {
        "ver": null,
        "refer": null,
        "sys": null,
        "token": null,
        "actId": 3
    },
    //合并两个json
    extend: function(json1,json2){
        var result={};  
        for(var attr in json1){
            result[attr]=json1[attr];  
        }  
        for(var attr in json2){  
            result[attr]=json2[attr];  
        }
        return result;  
    },
    //get请求
    get: function(obj){
        var arg = {
            url: '',
            data: {},
            success: null
        }
        arg = global.extend(arg,obj);
        $.ajax({
            type: "get",
            url: global.base + arg.url,
            data: global.extend(global.args,arg.data),
            dataType: "json",
            success: function(json){
                arg.success && arg.success(json);
            }
        });
    },
    //post请求
    post: function(obj){
        var arg = {
            url: '',
            data: {},
            success: null
        }
        arg = global.extend(arg,obj);
        $.ajax({
            type: "post",
            url: global.base + arg.url,
            data: JSON.stringify(global.extend(global.args,arg.data)),
            dataType: "json",
            contentType: "application/json",
            success: function(json){
                arg.success && arg.success(json);
            }
        });
    },
    //获取url键值对
    getQueryString: function(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },
    //消息弹框
    alert: function(msg){
        return layer.open({
            content: msg,
            style: 'background-color:#fff; color:#000; border:none;',
            shadeClose: false,
            time: 3
        });
    }
}

;(function () {
    var isApp = !!window.TqmallLegend;
    if(isApp){
        global.args.ver = TqmallLegend.getVersion();
        global.args.refer = TqmallLegend.getRefer();
        global.args.sys = TqmallLegend.getSys();
        global.args.token = TqmallLegend.getToken();
    }else{
        //调试开发参数
        global.args.ver = '2.6';
        global.args.refer = '1';
        global.args.sys = '1';
        global.args.token = '000001936';
    }
    //数组去重复
    Array.prototype.unique = function(){
        var n = {},r=[];
        for(var i = 0; i < this.length; i++){
            if (!n[this[i]]){
                n[this[i]] = true;
                r.push(this[i]);
            }
        }
        return r;
    }
})();

