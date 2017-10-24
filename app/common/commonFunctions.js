var appUrl = window.location.origin;
var ajaxFunctions = {
    ready: function ready (fn) {
        if (typeof fn !== 'function') {
            return;
        }
        if (document.readyState === 'complete') {
            return fn();
        }
        document.addEventListener('DOMContentLoaded', fn, false);
    },
    ajaxRequest: function ajaxRequest (method, url, data, waitFunction, completeFunction, callback) {
        $.ajax({
            type: method,
            url : appUrl + url,
            data : data,
            dataType : 'json',
            beforeSend : waitFunction,
            complete : completeFunction,
            error : function(err){
                callback(err, null);   
            },
            success : function(response){
                callback(null, response);
            }
        });
    }
};

var charConvert = function (s){
    s = s.replace(/[ı]/g, 'i');
    s = s.replace(/[ö]/g, 'o');
    s = s.replace(/[ü]/g, 'u');
    s = s.replace(/[ç]/g, 'c');
    s = s.replace(/[ş]/g, 's');
    s = s.replace(/[ğ]/g, 'g');
    s = s.replace(/[İ]/g, 'I');
    s = s.replace(/[Ö]/g, 'O');
    s = s.replace(/[Ü]/g, 'U');
    s = s.replace(/[Ç]/g, 'C');
    s = s.replace(/[Ş]/g, 'S');
    s = s.replace(/[Ğ]/g, 'G');
    return s;
};

var aModal = {
    modalTitle: null,
    modalBody: null,
    modalFooter: null,
    modalLocaton: null,
    modalAdder: function(){
        var html = "<div class='modal fade' id='aModal' role='dialog'>";
        html += "<div class='modal-dialog'>";
        html += "<div class='modal-content'><div class='modal-header'>";
        html += "<button type='button' class='close' data-dismiss='modal'>&times;</button>";
        html += "<h4 class='modal-title'>" + this.modalTitle + "</h4></div>";
        html += "<div class='modal-body'><p>" + this.modalBody + "</p></div>";
        html += "<div class='modal-footer'>";
        html += "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div>";
        html += "</div></div>";
        this.modalLocaton.html(html);
    }
};