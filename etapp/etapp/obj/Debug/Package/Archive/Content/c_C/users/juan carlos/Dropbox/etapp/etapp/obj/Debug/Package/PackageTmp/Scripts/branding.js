function getBrand() {
    try {
        var data = 'd=' + escape(document.domain);
        dbReadWriteAsync('getDealerBrand', data, getBrandSuccess, getBrandFailure);
    }
    catch (err) {
       
    }
}

function getBrandSuccess(data, textStatus, jqXHR) {
    try {

        var jsonObj = false;

        if (textStatus == 'success') {
            if (($("string", data).text()) == 'failure') {
                ret = false;
            }
            else {
                jsonObj = eval('(' + $("string", data).text() + ')');
                if (jsonObj.result == 'failure') {
                    if (alertFailure == true) {
                        //alert(jsonObj.error);
                    }
                    ret = false;
                }
                else {
                    var jsonResult = jsonObj;
                    if (jsonResult) {
                        var htmlResult = jsonResult.result;
                        if (htmlResult.length > 0) {
                            $('#dealerBrand').html(htmlResult);
                        }
                        else {
                            $('#dealerBrand').html(document.domain);
                        }
                    }
                }
            }

        }
        else {
            ret = false;
        }
    }
    catch (err) {
    }
}

function getBrandFailure(jqXHR, textStatus, errorThrown) {
    try {
        $('#dealerBrand').html(document.domain);
    }
    catch (err) {
    }
}
