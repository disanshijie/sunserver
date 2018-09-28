
module.exports=function(res,params){
    var result={};
    result.data={};
    result.code="";
    result.msg="";
    result.success=0;

    result = Object.assign({}, result, params);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    res.end(JSON.stringify(result));
    //return result;
}