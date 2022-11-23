function selectLanguage(language) {
    debugger;
    selectLang = language;
    localStorage.setItem('language', selectLang);
    traductor();   
}
function traductor() {
    var lang = localStorage.getItem('language') /*$('#language').val();*/
    debugger;
    $.getJSON("PruebaMultiIdioma/js/lang.json", function (json) {
        var doc = json;
        $('.lang').each(function (index, element) {
            $(this).text(doc[lang][$(this).attr('key')]);
        }); //Each
    });//Get json AJAX
}


