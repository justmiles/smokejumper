"use strict";var app=angular.module("smokejumper",["firebase","angular-md5","ui.router","ngTable","textAngular"]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("home",{url:"/",templateUrl:"static/home.html",resolve:{requireNoAuth:["$state","Auth",function(a,b){return b.$requireAuth().then(function(b){a.go("dashboard")},function(a){})}]}}).state("login",{url:"/login",controller:"AuthCtrl as authCtrl",templateUrl:"auth/login.html",resolve:{requireNoAuth:["$state","Auth",function(a,b){return b.$requireAuth().then(function(b){a.go("home")},function(a){})}]}}).state("register",{url:"/register",controller:"AuthCtrl as authCtrl",templateUrl:"auth/register.html",resolve:{requireNoAuth:["$state","Auth",function(a,b){return b.$requireAuth().then(function(b){a.go("home")},function(a){})}]}}).state("dashboard",{url:"/dashboard",controller:"DashboardCtrl as dashboardCtrl",templateUrl:"dashboard/dashboard.html",resolve:{auth:["$state","Users","Auth",function(a,b,c){return c.$requireAuth()["catch"](function(){a.go("home")})}],dashboard:["Users","Auth",function(a,b){return b.$requireAuth().then(function(b){return a.getProfile(b.uid).$loaded()})}]}}).state("about",{url:"/about",templateUrl:"static/about.html"}).state("profile",{url:"/profile",controller:"ProfileCtrl as profileCtrl",templateUrl:"users/profile.html",resolve:{auth:["$state","Users","Auth",function(a,b,c){return c.$requireAuth()["catch"](function(){a.go("home")})}],profile:["Users","Auth",function(a,b){return b.$requireAuth().then(function(b){return a.getProfile(b.uid).$loaded()})}]}}).state("alarms",{url:"/alarms",controller:"AlarmsCtrl as alarmsCtrl",templateUrl:"alarms/index.html",resolve:{alarms:["Alarms",function(a){return a()}],auth:["$state","Users","Auth",function(a,b,c){return c.$requireAuth()["catch"](function(){a.go("home")})}]}}).state("alarms/create",{url:"/alarms/create",templateUrl:"alarms/create.html",controller:"AlarmsCtrl as alarmsCtrl",resolve:{auth:["$state","Users","Auth",function(a,b,c){return c.$requireAuth()["catch"](function(){a.go("home")})}]}}).state("alarms/view",{url:"/alarms/view/{alarmId}",templateUrl:"alarms/view.html",controller:"AlarmsCtrl as alarmsCtrl"}).state("alarms/edit",{url:"/alarms/edit/{alarmId}",templateUrl:"alarms/edit.html",controller:"AlarmsCtrl as alarmsCtrl"}),b.otherwise("/")}]).constant("FIREBASE_URL","https://smokejumper.firebaseio.com/");console.log("--> smokejumper/app/app.js loaded"),app.factory("Auth",["$firebaseAuth","FIREBASE_URL",function(a,b){var c=new Firebase(b),d=a(c);return d}]),console.log("--> smokejumper/app/auth/auth.service.js loaded"),app.controller("AuthCtrl",["Auth","$state",function(a,b){var c=this;c.user={email:"",password:""},c.login=function(){a.$authWithPassword(c.user).then(function(a){b.go("home")},function(a){c.error=a})},c.register=function(){a.$createUser(c.user).then(function(a){c.login()},function(a){c.error=a})}}]),console.log("--> smokejumper/app/auth/auth.controller.js loaded"),app.factory("Users",["$firebaseArray","$firebaseObject","FIREBASE_URL",function(a,b,c){var d=new Firebase(c+"users"),e=new Firebase(c+".info/connected"),f=a(d),g={getProfile:function(a){return b(d.child(a))},getDisplayName:function(a){return f.$getRecord(a).displayName},getGravatar:function(a){return"//www.gravatar.com/avatar/"+f.$getRecord(a).emailHash},setOnline:function(c){var f=b(e),g=a(d.child(c+"/online"));f.$watch(function(){f.$value===!0&&g.$add(!0).then(function(a){a.onDisconnect().remove()})})},all:f};return g}]),console.log("--> smokejumper/app/users/users.service.js loaded"),app.controller("ProfileCtrl",["$state","Auth","md5","auth","profile",function(a,b,c,d,e){var f=this;f.profile=e,f.updateProfile=function(){f.profile.email=d.password.email,f.profile.emailHash=c.createHash(d.password.email),f.profile.$save().then(function(){a.go("profile")})},f.logout=function(){f.profile.online=null,f.profile.$save().then(function(){b.$unauth(),a.go("home")})}}]),console.log("--> smokejumper/app/users.profile.js loaded"),app.controller("DashboardCtrl",["$state","md5","auth",function(a,b,c){}]),console.log("--> smokejumper/app/dashboard/dashboard.controller.js loaded"),app.factory("Alarms",["FIREBASE_URL","$firebaseArray",function(a,b){return function(){var c=new Firebase(a+"alarms");return b(c)}}]),console.log("--> smokejumper/app/alarms/alarms.service.js loaded"),app.controller("AlarmsCtrl",["$state","$scope","FIREBASE_URL","$firebaseObject","$firebaseArray","$stateParams","ngTableParams","$filter","Alarms",function(a,b,c,d,e,f,g,h,i){b.alarms=i(),b.create=function(c){b.alarms.$add(c).then(function(){console.log("alarm Created"),a.go("alarms")})["catch"](function(a){console.log(a)})},b["delete"]=function(a){b.alarms.$remove(a).then(function(){console.log("alarm Deleted")})["catch"](function(a){console.log(a)})},b.getAlarm=function(){var a=new Firebase(c+"alarms");b.alarm=d(a.child(f.alarmId))},b.update=function(){b.alarm.$save().then(function(){console.log("alarm Updated"),a.go("alarms")})["catch"](function(a){console.log(a)})},b.alarms.$loaded().then(function(a){console.log(a.length);var c=a;b.tableAlarms=new g({page:1,count:10,sorting:{title:"asc"}},{total:c.length,getData:function(a,b){var d=b.sorting()?h("filter")(c,b.filter()):c;a.resolve(d.slice((b.page()-1)*b.count(),b.page()*b.count()))}})});var j=new Firebase(c+"alarms"),k=e(j);k.$watch(function(a){console.log(a),b.alarms.$loaded().then(function(){b.tableAlarms.reload()})})}]),console.log("--> smokejumper/app/alarms/alarms.controller.js loaded");