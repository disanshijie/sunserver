
//移动
function onDrag(event,treeId, thisNode) {
    cacheData.onDrag=[];
   // console.log('移动onDrag');
   // console.log(event);
   // console.log(treeId);
   // console.log(thisNode);
   // console.log(thisNode[0].getParentNode());
   cacheData.onDrag[0]={
       parentDir:thisNode[0].getParentNode().filePath,
   };
}
function onDrop(event,treeId, thisNode) {
   // console.log('移动onDrop');
   // console.log(event);
   // console.log(treeId);
   // console.log(thisNode);
   // console.log(thisNode[0].getParentNode());
   
   var params={
       originalPath:cacheData.onDrag[0].parentDir+"/"+encodeURI(thisNode[0].name),
       newDir:thisNode[0].getParentNode().filePath+"/"+encodeURI(thisNode[0].name),
   };
   cacheData.onDrag=[];
   console.log(params);
   $.post("/operate_move.do",params,function(result){
       console.log(result);
   }),"json";
}

//添加
function addButton(event,treeId, thisNode) {
   console.log('添加');
   console.log(event);
   console.log(treeId);
   console.log(thisNode);
   var params={
   //	originalPath:thisNode.filePath
   };
   // $.post("/operate_delete.do",params,function(result){
   // 	console.log(result);
   // }),"json";
}

//删除
function onRemove(event,treeId, thisNode) {
   var params={
       originalPath:thisNode.filePath
   };
   $.post("/operate_delete.do",params,function(result){
       console.log(result);
   }),"json";
}
//重命名
function onRename(event,treeId, thisNode) {
   // console.log('重命名');
   // console.log(event);
   // console.log(treeId);
   // console.log(thisNode);
   //$.post("",{},function(result){}),"json";
   var originalPath=thisNode.filePath;
   var parentPath="";
   if(originalPath.length>1){
       var index=originalPath.lastIndexOf("/");
       if(index>0){
           parentPath=originalPath.substring(0,index);
       }
   }
   var newPath=parentPath+"/"+encodeURI(thisNode.name);

   var params={
       originalPath:originalPath,
       newPath:newPath,
       //newName:thisNode.name,
   };
   $.post("/operate_rename.do",params,function(result){
       if(result && result.success==1){
           thisNode.filePath=newPath;
       }
       
       console.log(result);
   }),"json";

}


//折叠
function onCollapse(event,treeId, thisNode) {
   console.log("折叠");
   //console.log(event);
   //console.log(treeId);
   //console.log(thisNode);
   //console.log(cacheData.desc);
   //TODO 隐藏折叠树的readme，显示父类树的reame
   $(nodeDescBox).html('');
   var parentNode=thisNode.getParentNode();
   if(parentNode){
        //当前目录路径
       var prevDir=cacheData.prevDir[parentNode.pId+"_"+parentNode.id];
       $("#prevDirPath").html(prevDir);
       var desc=cacheData.desc[parentNode.pId+"_"+parentNode.id];
       if(desc){
           $(nodeDescBox).html('<pre>'+desc.content+'</pre>');
       }
   }
}

function onExpand(event,treeId, thisNode) {
   console.log("展开");
   //console.log(event);
   //console.log(treeId);
   //console.log(thisNode);
   //console.log(customDef);
   //console.log(thisNode.pId+"_"+thisNode.id);
   //当前目录路径
   var prevDir=cacheData.prevDir[thisNode.pId+"_"+thisNode.id];
    $("#prevDirPath").html(prevDir);
    //当前目录描述内容
   var desc=cacheData.desc[thisNode.pId+"_"+thisNode.id];
   //console.log(desc.content);
   if(desc){
       $(nodeDescBox).html('<pre>'+desc.content+'</pre>');
   }
}
//鼠标单击事件--点击前
function beforeClick(treeId, parentNode, responseData) {
   console.log("nodeBeforeClick");
}
//鼠标单击事件--点击后
function nodeOnClick(treeId, parentNode, responseData) {
   // console.log(treeId);
   // console.log(parentNode);
   // console.log(responseData);
   // console.log("nodeOnClick");

}

//添加相关按钮
function addHoverDom(treeId, treeNode) {
    bindAddMkFile(treeNode); //添加标签
    bindAddMkDir(treeNode); //添加标签

};
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_dir_"+treeNode.tId).unbind().remove();//移除添加标签
    $("#addBtn_file_"+treeNode.tId).unbind().remove();//移除添加标签
};
//右键操作事件
function onRightClick(event, treeId, treeNode) {
    if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
        zTree.cancelSelectedNode();
        showRMenu("root", event.clientX, event.clientY);
    } else if (treeNode && !treeNode.noR) {
        zTree.selectNode(treeNode);
        showRMenu("node", event.clientX, event.clientY);
    }
}
//-----------------nodejs事件函数 结束----------------------


//-----------------节点自定义相关操作按钮----------------------
//增加操作按钮
var newCount = 12;
function bindAddMkDir(treeNode){
    if(!treeNode.isParent){
        return;
    }
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_dir_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_dir_" + treeNode.tId + "' title='add dir' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    //onclick='addDir(this,\'" + treeNode.tId + "\')'
    var btn = $("#addBtn_dir_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var newNodeName="new node" + (++newCount);
        var newNodeId=(1000 + newCount);

        var zTree = $.fn.zTree.getZTreeObj(treeDemo);
        zTree.addNodes(treeNode, {id:newNodeId
                                    , pId:treeNode.id
                                    , name:newNodeName
                                    , filePath:treeNode.filePath+"/"+encodeURI(newNodeName)
                                    });

        var params={
            originalPath:treeNode.filePath,
            newName:encodeURI(newNodeName),
            type:"dir",
        };
        $.post("/operate_mkdirOrfile.do",params,function(result){
            console.log(result);
        }),"json";
        
        return false;
    });
}

function bindAddMkFile(treeNode){
    if(!treeNode.isParent){
        return;
    }
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_file_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_file_" + treeNode.tId + "' title='add file' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    //onclick='addDir(this,\'" + treeNode.tId + "\')'
    var btn = $("#addBtn_file_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var newNodeName="index" + (++newCount)+".txt";
        var newNodeId=(1000 + newCount);

        var zTree = $.fn.zTree.getZTreeObj(treeDemo);
        zTree.addNodes(treeNode, {id:newNodeId
                                    , pId:treeNode.id
                                    , name:newNodeName
                                    , filePath:treeNode.filePath+"/"+encodeURI(newNodeName)
                                    });

        var params={
            originalPath:treeNode.filePath,
            newName:encodeURI(newNodeName),
            type:"file",
        };
        $.post("/operate_mkdirOrfile.do",params,function(result){
            console.log(result);
        }),"json";
        
        return false;
    });
}
// ---------end--------------

// ---------右键菜单 操作--------------
function showRMenu(type, x, y) {
    $("#rMenu ul").show();
    if (type=="root") {
        $("#m_del").hide();
        $("#m_check").hide();
        $("#m_unCheck").hide();
    } else {
        $("#m_del").show();
        $("#m_check").show();
        $("#m_unCheck").show();
    }

    y += document.body.scrollTop+10;
    x += document.body.scrollLeft+10;
    rMenu.css({"top":y+"px", "left":x+"px", "visibility":"visible"});

    $("body").bind("mousedown", onBodyMouseDown);
}
function hideRMenu() {
    if (rMenu) rMenu.css({"visibility": "hidden"});
    $("body").unbind("mousedown", onBodyMouseDown);
}
function onBodyMouseDown(event){
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length>0)) {
        rMenu.css({"visibility" : "hidden"});
    }
}
var addCount = 1;
function addTreeNode() {
    hideRMenu();
    var newNode = { name:"增加" + (addCount++)};
    if (zTree.getSelectedNodes()[0]) {
        newNode.checked = zTree.getSelectedNodes()[0].checked;
        zTree.addNodes(zTree.getSelectedNodes()[0], newNode);
    } else {
        zTree.addNodes(null, newNode);
    }
}
function removeTreeNode() {
    hideRMenu();
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length>0) {
        if (nodes[0].children && nodes[0].children.length > 0) {
            var msg = "要删除的节点是父节点，如果删除将连同子节点一起删掉。\n\n请确认！";
            if (confirm(msg)==true){
                zTree.removeNode(nodes[0]);
            }
        } else {
            zTree.removeNode(nodes[0]);
        }
    }
}
//下载节点内容到本地
function downloadFile(checked) {
    var node = zTree.getSelectedNodes()[0];
    console.log(node);
    var  pathStr=decodeURI(node.filePath);
    console.log(pathStr);
    /*
    ex_ajax("/file/downloadBase64Img.node",{'originalPath':node.filePath,"newName":node.name},function(result){
        console.log();
    });
    */
   
    co_documnetDownLoad('http://localhost:8001/file/downloadFile.node',{'originalPath':node.filePath,"fileName":node.name,'way':1});

}
//本地可以打开文件所在目录
function openFileLocation(checked) {
    var node = zTree.getSelectedNodes()[0];
    var  filePath=decodeURI(node.filePath);

    //TODO 不行

}
//直接打开文件
function openFileNewTab(checked) {
    var node = zTree.getSelectedNodes()[0];
    var  filePath=decodeURI(node.filePath);
    // raw 0 默认，1下载，2文本
    window.open("/open.node?raw=0&url="+filePath,"_");
}
function checkTreeNode(checked) {
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length>0) {
        zTree.checkNode(nodes[0], checked, true);
    }
    hideRMenu();
}
function resetTree() {
    hideRMenu();
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
}

/**
 * 复制节点路径到剪切板
 */
function copyPathTreeNode(){
    hideRMenu();
    var node = zTree.getSelectedNodes()[0];
    //console.log(node);
    var  pathStr=decodeURI(node.filePath);

    copy2clipboard(pathStr);
}
    /**
     * 复制内容到剪切版
     * content 复制内容
     */
    function copy2clipboard(content) {
        var $textarea=$('<textarea name="">1211</textarea>');
        $textarea.appendTo("body",document);
        $textarea.text(content);

        $textarea.focus();
        $textarea.select();
        document.execCommand('Copy', false, null);
        $textarea.blur();
        //删除
        $textarea.remove();
    }