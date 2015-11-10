/**
 * Created by jarindr on 17/6/2558.
 */
var typeArray = []; // array that keep type of the equipments
var equipArray = [];
var count = [];
var counter = 2; // just counter for the assistnace id
var room_counter = 1; // just counter for the room id
var html;
var html2; // dummy html later set as a group of html tabs
var ac = $("#accordion").hide();
var active = false; // is more detail active?
var firstTime = true; //more detail clicked first time?
var moreDetailClick = false; // check weather the more detail clicked yet
var click = false;
var equip_amount = [];
var runner = 0;
var auto_add_detail = true;
$(document).ready(function() {
    setMenuClicked();
    $(".btn").mouseup(function() {
        $(this).blur();
    })
    $.getJSON('http://localhost:3000/dump_equipment_data', function(data) {
        $.each(data, function(key, value) {
            var type = value.type;
            typeArray.push(type);
        });
        typeArray = typeArray.filter(function(item, pos) { // make unique
            return typeArray.indexOf(item) == pos;
        })
        var k = 0;
        for (var i = 0; i < typeArray.length; i++) {
            equipArray[i] = [];
            count[i] = [];
            for (var j = 0; j < data.length; j++) {
                if (typeArray[i] == data[j].type) {
                    equipArray[i][k] = data[j].description;
                    k++;
                }
            }
            k = 0;
        }
        $("#add_detail").click();
    });

    $("#add_assistant").click(function() { // set adding assistance
        var html = $("<div class='form-group'><div class='col-sm-2'></div><div class='col-sm-5'> " +
            "<input type='text' class='form-control' id='assistant_form' name='assistant_form' placeholder = 'Assistant name ...' > " +
            "</div>" + "<div class='col-sm-1'>" +
            "<button type='button' class='btn btn-default' id='delete_assistant'>-</button>" +
            "</div>" + "</div>");
        html.appendTo("#assistant-group-form");
        html.hide().show('fast');
    });

    $("#room-group-form").on('click', '#add_room', function() { //set adding room
        var html = $("<div class='form-group'><label class='col-sm-2 control-label'></label>" +
            "<div class='col-sm-5'>" +
            "<select class='form-control ads' id='room_selector" + room_counter + "'" + "name='room_selector" + room_counter + "'>" +
            "<option value='rs01'>Studio room S</option>" +
            "<option value='rs02'>Studio room M</option>" +
            "<option value='rs03'>Studio room L</option>" +
            "<option value='rs04'>Studio room XL</option>" +
            "<option value='rs05'>Studio room G</option>" +
            "</select>" +
            "</div>" +
            "<div class='col-sm-1'>" +
            "<button type='button' class='btn btn-default' id='delete_room'>-</button>" +
            "</div>" +
            "</div>");
        var selected = [];
        html.appendTo("#room-group-form");
        $("#room-group-form").find('.form-group').each(function(index, el) {
            $(el).find('option').each(function(index, els) {
                if (els.selected == true) {
                    selected.push($(els).val());
                }
            });

        });
        html.find('option').each(function(index, el) {
            if ($.inArray($(el).val(), selected) == -1) {
                el.selected = true;
                return false;
            }
        });
        reCheckRoomOption()
        html.hide().show('fast');
        room_counter++;
    });
    $(document).on('change', '.ads', function(event) {
        reCheckRoomOption();
    });
    $("#room-group-form").on("click", "#delete_room", function() { // set binding event to room-group-form delete out 
        $(this).parent().parent().hide('fast').empty();
        reCheckRoomOption();
    });
    $("#assistant-group-form").on("click", "#delete_assistant", function() { // set binding event to room-group-form delete out 
        $(this).parent().parent().hide('fast').empty();

    });
    $("#submit").click(function(event) { // equipment input for sending to route
        var form_html = "";
        $('.list-group-item').each(function(i, obj) {
            var item = $(this).text().substring(0, $(this).text().lastIndexOf("+"));
            var val = $(this).find('input').val();
            form_html += "<div class='form-group'><input type='text' class='form-control' name='equip_item' value='" + item + "&" + val + "'" + " style='display:none;'></div>";
        });
        var $form_html = $(form_html);
        $form_html.appendTo($(".form-horizontal"));
    });
    $("#add_detail").click(function() { // add detail toggle
        active = !active;
        if (active) {
            $(this).text("Hide detail");
            if (firstTime) {
                var room = $('#room_selector').find('option:selected').text();
                var codes = "";
                var nType = 0;
                html = $("<div class='col-sm-12' style='margin-bottom:20px;-webkit-box-shadow: 0px 1px 0px 0px rgba(173,173,173,1); -moz-box-shadow: 0px 1px 0px 0px rgba(173,173,173,1);box-shadow: 0px 1px 0px 0px rgba(173,173,173,1);'>" +
                    "<h1>More detail</h1></div>");
                html.appendTo(ac);
                html = "";
                var indexTypeArray = 0;
                var rent_code = "<div class='form-group' style='margin-top:3%;'> " +
                    "<label class='col-sm-2 control-label'>Supplier :</label> " +
                    "<div class='col-sm-5'> " +
                    "<input type='text' class='form-control' id='client-form' placeholder='supplier name...'> " +
                    "</div> " +
                    "<label class='col-sm-1 control-label'>Price :</label> " +
                    "<div class='col-sm-2'> " +
                    "<input type='number' class='form-control' id='client-form' placeholder='Price...'> " +
                    "</div> " +
                    "</div> " +
                    "<div class='form-group'> " +
                    "<label class='col-sm-2 control-label'>Description :</label> " +
                    "<div class='col-sm-5'> " +
                    "<input type='text' class='form-control' id='client-form' placeholder='description...'> " +
                    "</div> " +
                    "<label class='col-sm-2 control-label'>Quantity :</label> " +
                    "<div class='col-sm-1'> " +
                    "<input type='text' class='form-control' id='client-form' placeholder='from...'> " +
                    "</div> " +
                    "</div>";
                for (var j = 1; j <= 3; j++) {
                    codes = codes + "<div class='col-sm-4'style='margin-bottom: 2%;'>";
                    for (var i = 1; i <= 3; i++) {
                        codes += "<div class='panel panel-default' style='margin-bottom: 5%;'>" +
                            "<div class='panel-heading' role='tab' id='heading" + nType + "'> " +
                            "<h4 class='panel-title'> " +
                            "<a role='button' data-toggle='collapse' data-parent='#accordion'" +
                            "href='#collapse" + nType + "'" +
                            "aria-expanded='true' aria-controls='collapse" + nType + "'>" +
                            typeArray[nType] +
                            "</a> " +
                            "</h4> " +
                            "</div> " +
                            "<div id='collapse" + nType + "' class='panel-collapse collapse' role='tabpanel'" +
                            "aria-labelledby='heading" + nType + "'> " +
                            "<ul class='list-group'> ";
                        for (var x = 0; x < equipArray[nType].length; x++) {
                            codes += "<li class='list-group-item'>" + equipArray[nType][x] +
                                "<div id='button' class='button_decrease'> + </div> " +
                                "<input type='text' class='value_equip' value='0'> " +
                                "<div id='button' class='button_increase'> - </div></li> ";
                            runner++;
                        }
                        codes += "</ul></div></div>";
                        nType++;
                        if (nType == typeArray.length) {
                            break;
                        }
                    }

                    codes = codes + "</div>";

                }
                html2 = $("<div class='form-group'>" +
                    "<label class='col-sm-2 control-label'>Studio type :</label>" +
                    "<div class='checkbox col-sm-2' style='margin-right: 0'>" +
                    "<label> <input type='checkbox'checked='true'> With lighting Prophoto</label> </div> " +
                    "<div class='checkbox col-sm-2'> " +
                    "<label> " +
                    "<input type='checkbox'> With lighting Broncolor</label> " +
                    "</div> " +
                    "<div class='checkbox col-sm-2'> " +
                    "<label> " +
                    "<input type='checkbox'> No lighting </label> " +
                    "</div> " +
                    "</div>" +
                    "<div><ul class='nav nav-tabs' role='tablist'> " +
                    "<li role='presentation' class='active'><a href='#home' aria-controls='home' role='tab' data-toggle='tab'>Equipment list</a></li> " +
                    "<li role='presentation'><a href='#profile' aria-controls='profile' role='tab' data-toggle='tab'>Rent Equipment</a></li> " +
                    "</ul> " +
                    "<div class='tab-content'> " +
                    "<div role='tabpanel' class='tab-pane fade in active' id='home' style='margin-bottom: 2%;'>" +
                    codes + "</div> " +
                    "<div role='tabpanel' class='tab-pane fade' id='profile'>" + rent_code + "</div> " +
                    "</div> " +
                    "</div>");
                html2.appendTo(ac);
                firstTime = false;
            }
            ac.hide().show('slow');
        } else {
            ac.hide('fast');
            $(this).text("More detail");
        }
    });
    $(document).on("click", "#button", function() { // accordion for binding event click on + - button update value
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        if ($button.text() == " + ") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }

        $button.parent().find("input").val(newVal);


    });
    $('#assignment_selector').on('change', function() {
        var selected = $('#assignment_selector').val();
        if (selected == "Studio rental" || selected == "Studio rental + Location") {
            var dummy = $("<div class='form-group'><label class='col-sm-2 control-label'>Studio room :</label>" +
                "<div class='col-sm-5'>" +
                "<select class='form-control' id='room_selector' name='room_selector'>" +
                "<option value='rs01'>Studio room S</option>" +
                "<option value='rs02'>Studio room M</option>" +
                "<option value='rs03'>Studio room L</option>" +
                "<option value='rs04'>Studio room XL</option>" +
                "<option value='rs05'>Studio room G</option>" +
                "</select>" +
                "</div>" +
                "<div class='col-sm-1'>" +
                "<button type='button' class='btn btn-default' id='add_room'>+</button>" +
                "</div>" +
                "</div>");
            dummy.appendTo($('#room-group-form').empty()).hide().show('slow');
        }
        if (selected == "Production") {
            var dummy = $("<div class='form-group'><label class='col-sm-2 control-label'>Onscreen room :</label>" +
                "<div class='col-sm-5'>" +
                "<select class='form-control' id='room_selectorx' name='room_selectorx'>" +
                "<option value='ro01'>Onscreen room</option>" +
                "<option>None</option>" +
                "</select>" +
                "</div>" +
                "</div>" +
                "<div class='form-group'><label class='col-sm-2 control-label'>Studio room :</label>" +
                "<div class='col-sm-5'>" +
                "<select class='form-control' id='room_selector' name='room_selector'>" +
                "<option value='rs01'>Studio room S</option>" +
                "<option value='rs02'>Studio room M</option>" +
                "<option value='rs03'>Studio room L</option>" +
                "<option value='rs04'>Studio room XL</option>" +
                "<option value='rs05'>Studio room G</option>" +
                "</select>" +
                "</div>" +
                "<div class='col-sm-1'>" +
                "<button type='button' class='btn btn-default' id='add_room'>+</button>" +
                "</div>" +
                "</div>"
            );
            dummy.appendTo($('#room-group-form').empty()).hide().show('slow');
        }
        if (selected == "Equipment rental") {
            var dummy = $("<div class='form-group'><label class='col-sm-2 control-label'>Studio room :</label>" +
                "<div class='col-sm-5'>" +
                "<select class='form-control' disabled>" +
                "<option>None</option>" +
                "</select>" +
                "</div>" +
                "</div>"
            );
            $(".panel-group").find(".form-group").hide();
            dummy.appendTo($('#room-group-form').empty()).hide().show('slow');

        } else {
            $(".panel-group").find(".form-group").show();
        }
        if (selected == "Onscreen room") {
            var dummy = $("<div class='form-group'><label class='col-sm-2 control-label'>Onscreen room :</label>" +
                "<div class='col-sm-5'>" +
                "<select class='form-control' id='room_selectorx' name='room_selectorx'>" +
                "<option value='ro01'>Onscreen room</option>" +
                "</select>" +
                "</div>" +
                "</div>"
            );
            dummy.appendTo($('#room-group-form').empty()).hide().show('slow');
            html = $("<div class='form-group'>" +
                "<label class='col-sm-2 control-label'>Studio type :</label>" +
                "<div class='checkbox col-sm-2' style='margin-right: -100px;'>" +
                "<label> <input type='checkbox'> With Mac</label> </div> " +
                "<div class='checkbox col-sm-2'> " +
                "<label> " +
                "<input type='checkbox'> Without Mac</label> " +
                "</div> " +
                "</div>");
            html.appendTo($(".panel-group").find(".form-group").empty());
            $(".nav-tabs").hide();
            $(".tab-content").hide();
        } else {
            html = $("<label class='col-sm-2 control-label'>Studio type :</label>" +
                "<div class='checkbox col-sm-2' style='margin-right: 0'>" +
                "<label> <input type='checkbox'checked='true'> With lighting Prophoto</label> </div> " +
                "<div class='checkbox col-sm-2'> " +
                "<label> " +
                "<input type='checkbox'> With lighting Broncolor</label> " +
                "</div> " +
                "<div class='checkbox col-sm-2'> " +
                "<label> " +
                "<input type='checkbox'> No lighting </label> " +
                "</div>");
            html.appendTo($(".panel-group").find(".form-group").empty());
            $(".nav-tabs").show();
            $(".tab-content").show();
        }

    });
    $("#accordion").on("change", "input:checkbox", function() { // only one check box and be checked
        $(this).prop('checked', true);
        $('input[type="checkbox"]').not(this).prop('checked', false);
    });

    function reCheckRoomOption() {
        var selected = [];
        var new_selected = [];
        $("#room-group-form").find('.form-group').each(function(index, el) {
            $(el).find('option').each(function(index, els) {
                if (els.selected == true) {
                    new_selected.push($(els).val());
                }
            });
        });
        console.log(new_selected);
        $("#room-group-form").find('.form-control').each(function(index, el) {
            $(el).find('option').each(function(index, els) {
                if ($.inArray($(els).val(), new_selected) != -1) {
                    if ($(el).val() != $(els).val()) {
                        $(els).css('display', 'none');
                    }
                } else {
                    $(els).css('display', 'block');
                }
            });
        });
    }

});