function check_browser() {
    Opera = (navigator.userAgent.indexOf("Opera", 0) != -1) ? 1 : 0;
    MSIE = (navigator.userAgent.indexOf("MSIE", 0) != -1) ? 1 : 0;
    FX = (navigator.userAgent.indexOf("Firefox", 0) != -1) ? 1 : 0;
    if (Opera) {
        brow_type = "Opera"
    } else {
        if (FX) {
            brow_type = "Firefox"
        } else {
            if (MSIE) {
                brow_type = "MSIE"
            }
        }
    }
    return brow_type
}
function getWindowHeight() {
    var A = 0;
    if (typeof (window.innerHeight) == "number") {
        A = window.innerHeight
    } else {
        if (document.documentElement && document.documentElement.clientHeight) {
            A = document.documentElement.clientHeight
        } else {
            if (document.body && document.body.clientHeight) {
                A = document.body.clientHeight
            }
        }
    }
    return A
}
function getWindowWidth() {
    var A = 0;
    if (typeof (window.innerWidth) == "number") {
        A = window.innerWidth
    } else {
        if (document.documentElement && document.documentElement.clientWidth) {
            A = document.documentElement.clientWidth
        } else {
            if (document.body && document.body.clientWidth) {
                A = document.body.clientWidth
            }
        }
    }
    return A
}
function setCenter(F, G) {
    if (document.getElementById) {
        var C = getWindowHeight();
        var B = getWindowWidth();
        var E = check_browser();
        if (C > 0) {
            var H = document.getElementById("center");
            if (H != null) {
                var A = H.offsetHeight;
                var D = H.offsetWidth;
                if (C - (88) >= 0) {
                    if (E == "MSIE") {
                        H.style.height = (C - G) + "px";
                        H.style.width = (B - F) + "px"
                    } else {
                        H.style.height = (C - G) + "px";
                        H.style.width = (B - F) + "px"
                    }
                }
            }
        }
    }
}
var stlye = "-1";
function changeRow_color(C, F) {
    var E = document.getElementById(C).getElementsByTagName("tr");
    if (stlye == "-1") {
        stlye = E[3].className
    }
    if (F == "true") {
        for (var B = 3; B < E.length + 1; B++) {
            if (B % 2 > 0) {
                E[B - 1].className = "t2"
            } else {
                E[B - 1].className = "t1"
            }
        }
        for (var B = 2; B < E.length; B++) {
            E[B].onmouseover = function() {
                this.tmpClass = this.className;
                this.className = "t3"
            }
            ;
            E[B].onmouseout = function() {
                this.className = this.tmpClass
            }
        }
    } else {
        if (stlye == "-1") {
            stlye = E[3].className
        }
        var A = new Date().getDate();
        var D = document.getElementById(C).getElementsByTagName("td");
        for (var B = 2; B < E.length; B++) {
            E[B].className = stlye
        }
        for (var B = 0; B < E.length; B++) {
            E[B].onmouseover = function() {}
            ;
            E[B].onmouseout = function() {}
        }
        for (var B = 0; B < D.length; B++) {
            if (D[B].innerHTML == A) {
                D[B].className = "calendarthisdate"
            }
        }
    }
}
function getPageMenu(A, B) {
    activePageMenu = A;
    activePageDiv = B
}
function changediv(D, F, B) {
    for (var A = 1; A <= B; A++) {
        var C = document.getElementById("div1_" + D + A);
        var E = document.getElementById("div" + D + A);
        if (A == F) {
            C.className = "tab_show";
            E.style.display = ""
        } else {
            C.className = "tab_hide";
            E.style.display = "none"
        }
    }
}
function checkAll() {
    var A = document.forms["form1"].elements["chkAll"];
    var B = document.forms["form1"].getElementsByTagName("input");
    for (i = 0; i < B.length; i++) {
        var C = B[i];
        if (C.type == "checkbox") {
            C.checked = A.checked
        }
    }
}
function closeWait() {
    if (sil != "") {
        clearInterval(sil);
        sil = ""
    }
    document.getElementById("print_time").innerHTML = 0;
    document.getElementById("printwaiting").style.display = "none";
    document.getElementById("printshow").style.display = "none"
}
function printwaitover() {
    if (sil != "") {
        clearInterval(sil);
        sil = ""
    }
    if (null == document.getElementById("print_time")) {
        parent.document.getElementById("print_time").innerHTML = 0;
        parent.document.getElementById("printwaiting").style.display = "none";
        parent.document.getElementById("printshow").style.display = "none"
    } else {
        document.getElementById("print_time").innerHTML = 0;
        document.getElementById("printwaiting").style.display = "none";
        document.getElementById("printshow").style.display = "none"
    }
}
function printTime() {
    if (null == document.getElementById("print_time")) {
        var A = parent.document.getElementById("print_time").innerHTML;
        parent.document.getElementById("print_time").innerHTML = A * 1 + 1
    } else {
        var A = document.getElementById("print_time").innerHTML;
        document.getElementById("print_time").innerHTML = A * 1 + 1
    }
}
var sil = "";
var movehttp_request = false;
function hashCode(D) {
    D = D + "";
    var A = 0
      , C = 0;
    var E = D.length;
    for (var B = 0; B < E; B++) {
        A = 31 * A + D.charCodeAt(C++);
        if (A > 2147483647 || A < 2147483648) {
            A = A & 4294967295
        }
    }
    return A
}
function moveprocessRequset() {
    if (movehttp_request.readyState == 4) {
        if (movehttp_request.status == 200) {
            if (movehttp_request.responseText != null && movehttp_request.responseText != "" && movehttp_request.responseText != "null") {
                var A;
                if (movehttp_request.responseText == "false") {} else {
                    A = movehttp_request.responseText;
                    if ("false" == A) {
                        alert("false")
                    } else {
                        if ("timeout" == A) {
                            alert("timeout")
                        } else {
                            if ("rpt_nodoc" == A) {
                                alert("WordReport is null!")
                            }
                        }
                    }
                    printwaitover()
                }
            } else {
                alert("error!")
            }
        }
    }
};

import Constants from '@/publicJs/Constants.js'
export default {
    printwaitOther:function (E, C, B, D) {
        var G = E;
        // if (null == document.getElementById("printwaiting")) {
        //     parent.document.getElementById("printwaiting").style.display = "";
        //     parent.document.getElementById("printshow").style.display = "";
        //     parent.document.getElementById("printshow").className = "printshow"
        // } else {
        //     document.getElementById("printwaiting").style.display = "";
        //     document.getElementById("printshow").style.display = "";
        //     document.getElementById("printshow").className = "printshow"
        // }
        // sil = setInterval("printTime()", 1000);
        movehttp_request = false;
        if (window.XMLHttpRequest) {
            movehttp_request = new XMLHttpRequest();
            if (movehttp_request.overrideMimeType) {
                movehttp_request.overrideMimeType("text/xml")
            }
        } else {
            if (window.ActiveXObject) {
                try {
                    movehttp_request = new ActiveXObject("Msxml2.XMLHTTP")
                } catch (F) {
                    try {
                        movehttp_request = new ActiveXObject("Microsoft.XMLHTTP")
                    } catch (F) {}
                }
            }
        }
        if (!movehttp_request) {
            window.alert("faile to create XMLHttpRequest");
            return false
        }
        var A = "";
        if ("true" == D) {
            A = "batcacId=" + B
        }
        if ("detail" == D) {
            A = "progCacId=" + B
        } else {
            A = "cac=" + B
        }
        G = A + "&printType=" + C + "&printUrlFlag=" + encodeURIComponent(G);
        movehttp_request.onreadystatechange = moveprocessRequset;
        movehttp_request.open("post",Constants.reportUrl+ "report/PrintWait?" + G, true);
        movehttp_request.send(null)
    }
}
