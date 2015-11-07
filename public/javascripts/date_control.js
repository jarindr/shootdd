setDatePicker();
setTime("30");

function setDatePicker() {
    var date = new Date();
    console.log(date);
    var year = date.getFullYear().toString();
    var month = date.getMonth() + 1;
    var day = date.getDate().toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    var full_date = day + "/" + month + "/" + year;
    var date_format = year + "-" + month + "-" + day;
    var end_date = full_date;
    var start_date = full_date;
    $('#date_picker_dummy_start').val(date_format);
    $('#date_picker_dummy_end').val(date_format);
    $('#date_picker').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function(start, end, label) {
        //console.log("New date range selected:" + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label);
        start_date = start.format('YYYY-MM-DD');
        end_date = end.format('YYYY-MM-DD');
        $('#date_picker_dummy_start').val(start_date);
        $('#date_picker_dummy_end').val(end_date);
        console.log(date_format);
    });
    $('#basic-addon1').click(function() {
        $('#date_picker').click();
    });
}

function setTime(interval) { // set the time dropdown in newqueue
    var min = 0;
    var hr = 0;
    var html;
    for (var i = 0; i <= 24; i++) {
        for (var j = 0; j < 2; j++) {
            if (j == 0) {
                min = "00";
            } else {
                min = interval;
            }
            if (i < 10) {
                hr = "0" + i;
            } else {
                hr = i;
            }

            html = $("<option>" + hr + ":" + min + "</option>");
            var time_form = $("#time_form");
            html.appendTo(time_form);
            if (i == 24 && min == "00") {
                break;
            }
        }


    }
}