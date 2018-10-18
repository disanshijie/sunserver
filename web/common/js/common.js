


/**
 * 下载文件
 * @param {*} url
 * @param {*} params
 */
function co_documnetDownLoad(url,params){
    var form = $("<form target='_self'></form>")
   form.attr('action',url);
   form.attr('method','post');
   var input="";
   if(params){
          for(var k in params){
           input +=' <input name="'+k+'" type="hidden" value="'+params[k]+'">';
          }
    }
   form.append(input);
   form.appendTo("body",document);
   form.css('display','none');
   form.submit();
    //删除表单
   form.remove();
}