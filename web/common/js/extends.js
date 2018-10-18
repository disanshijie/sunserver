
/**
 *  ajax请求
 * @param {*} _url
 * @param {*} _params
 * @param {*} _callback
 */
function ex_ajax(_url,_params,_callback) {
    $.ajax({
        type:"post",
        async:false,   //不同步
        url:_url,
        data:_params,
        dataType:"json",
        success:function (data){
            if(data && data.success==1){
                _callback(data);
            }else{
                 alert("失败");
                 console.log(data.msg);
            }
        },
        error:function(e,emessage,eobj){
                alert(eobj+"错误啦!");
        }
   });
}