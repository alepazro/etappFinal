
function openCase(action, src, id) {
    //'action=new or edit
    //src= cust(omer), usr, dev(ice)

    try {
        window.open('crmCasesOpen.html?' + 'action=' + escape(action) + '&src=' + escape(src) + '&id=' + id, target = "_blank");
    }
    catch (err) {
    }
}

function loadCase() {
    try {
        var action = getParameterByName('action');
        var src = getParameterByName('src');
        var id = getParameterByName('id');

        if (action == 'new') {
        }
        else {
            if (action == 'edit') {
            }
        }
    }
    catch (err) {
    }
}