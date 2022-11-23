function getCabinets() {
    try {

        $.ajax({
            type: "POST",
            url: "https://api.efilecabinetonline.com/EfcObject/GetCabinets",
            contentType: "application/json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader('EfcAuthToken', '64d9a983-5e21-497f-aded-91c6e4282f21');
            },
            success: function (a, b, c) {
                var x = 1;
            },
            error: function (a, b, c) {
                var x = 1;
            }
        });

    }
    catch (err) {
        alert(err.message);
    }
}

function testCreate() {
    try {
        var data = { "EfcObjectId": 0, "Extension": "txt", "Name": "MyTextDocument", "ParentEfcObjectId": 584, "TypeEnum": 8, "TypeString": "txt" };

        $.ajax({
            type: "POST",
            url: "https://api.efilecabinetonline.com/EfcObject/Create",
            contentType: "application/json",
            data: data,
            dataType: "json",
            processdata: false,
            success: function (a, b, c) {
                var x = 1;
            },
            beforeSend: setHeader,
            error: function (a, b, c) {
                var x = 1;
            }
        });

    }
    catch (err) {
        alert(err.message);
    }
}

function setHeader(xhr) {
    xhr.setRequestHeader('EfcAuthToken', '64d9a983-5e21-497f-aded-91c6e4282f21');
}