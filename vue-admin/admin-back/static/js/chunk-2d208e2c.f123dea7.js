(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d208e2c"],{a766:function(t,e,r){"use strict";r.r(e);var a=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"rights"}},[r("el-breadcrumb",[r("el-breadcrumb-item",{attrs:{to:{path:"/home"}}},[t._v("首页")]),r("el-breadcrumb-item",[t._v("权限管理")]),r("el-breadcrumb-item",[t._v("权限列表")])],1),r("el-card",[r("el-table",{staticStyle:{width:"100%"},attrs:{data:t.rightsList,border:!0}},[r("el-table-column",{attrs:{type:"index",label:"#"}}),r("el-table-column",{attrs:{prop:"authName",label:"权限名称"}}),r("el-table-column",{attrs:{prop:"path",label:"路径"}}),r("el-table-column",{attrs:{prop:"level",label:"权限等级"},scopedSlots:t._u([{key:"default",fn:function(e){return["0"===e.row.level?r("el-tag",[t._v("一级权限")]):"1"===e.row.level?r("el-tag",{attrs:{type:"success"}},[t._v("二级权限")]):r("el-tag",{attrs:{type:"warning"}},[t._v("三级权限")])]}}])})],1)],1)],1)},s=[],n=r("1da1"),l=(r("96cf"),r("d722")),i={name:"rights",data:function(){return{rightsList:[]}},created:function(){this.getRightsList()},methods:{getRightsList:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var r,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,l["a"].get("rights/list");case 2:if(r=e.sent,a=r.data,200===a.meta.status){e.next=7;break}return t.$message.error("获取权限列表失败"),e.abrupt("return");case 7:t.rightsList=a.data;case 8:case"end":return e.stop()}}),e)})))()}}},c=i,u=r("2877"),o=Object(u["a"])(c,a,s,!1,null,"7c5b8702",null);e["default"]=o.exports}}]);
//# sourceMappingURL=chunk-2d208e2c.f123dea7.js.map