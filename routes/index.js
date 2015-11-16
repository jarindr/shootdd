var express = require('express');
var router = express.Router();
var faker = require('faker');
var mysql = require('mysql');
var connection = createConnection();
/* GET login  page. */
router.get('/', function(req, res, next) {
    res.render('index');
    console.log("root router connected");
});
//
//get add new booking page
router.get('/newQueue', function(req, res, next) {
    connection.query('SELECT COUNT(*) AS count FROM booking ', function(err, row, field) {
        var id = getQuotationID(row);
        res.render('newQueue', {
            data: id
        });
    });
});
router.post('/newQueue', function(req, res, next) {});
router.get('/dump_equipment_data', function(req, res, next) {
    var query = "SELECT *,COUNT(Description) AS count FROM equipment GROUP BY Description ORDER BY type";
    connection.query(query, function(err, rows, fields) {
        res.send(rows);
    });

});
router.post('/confirm_close_job', function(req, res, next) {
    var close_equip_data = [];
    var QID = req.session.QID;
    var OT = req.body.ot_form;
    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            if (key == "equip_item") {
                var equipString = req.body[key];
                for (var i = 0; i < equipString.length; i++) {
                    close_equip_data.push([QID, equipString[i]]);
                }
            }
        }
    }
    var data = {
        status: 'Closed',
        OT: OT
    }
    if (close_equip_data.length > 0) {
        connection.query('INSERT INTO booking_use_equipment(QID,EID) VALUE?', [close_equip_data], function(err, row, field) {
            if (err) {
                console.log(err);
            } else {
                connection.query('UPDATE booking SET? WHERE QID=?', [data, QID], function(err, row, field) { // main data all QID and stuff
                    if (err) {
                        console.log("can't insert booking with error code " + err);
                    } else {
                        console.log("edit booking complete");
                    }
                });
                res.redirect('confirm_close_job');
            }

        });
    } else {
        res.redirect('confirm_close_job');
    }


});
router.get('/confirm_close_job', function(req, res, next) {
    var QID = req.session.QID;
    res.render('confirm_close_job', {
        QID: QID
    });
});
router.get('/add_rent_equipment', function(req, res, next) {
    var query = "SELECT *,COUNT(Description) AS count FROM equipment GROUP BY Description";
    var temp = "";
    connection.query(query, function(err, rows, fields) {
        for (var i = 0; i < rows.length; i++) {
            if (i != 0) {
                temp = temp + rows[i].description + ",";
            }
        }
        res.render('add_rent_equipment', {
            data: temp
        });
    });
});
//get add show queues page
router.get('/queues', function(req, res, next) {
    var query = "SELECT QID,client,Job_description,photographer," +
        "DATE_FORMAT(shooting_date_start,'%Y-%m-%d') shooting_date_start," +
        "DATE_FORMAT(shooting_date_end,'%Y-%m-%d') shooting_date_end," +
        'time_start,time_end,status,assignment FROM booking';
    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log('cannot query the statement');
            throw err;
        }
        res.render('queues', {
            data: rows
        });
    });
});
router.get('/new_customer', function(req, res, next) {
    res.render('new_customer');
});
router.get('/confirm_create_queue', function(req, res, next) {
    res.render('confirm_create_queue');

});

router.get('/dump_equipment_data_unique', function(req, res, next) {
    var query = "SELECT * FROM equipment";
    connection.query(query, function(err, rows, fields) {
        res.send(rows);
    });
});
router.get('/close_job', function(req, res, next) {
    var QID = req.session.QID;
    router.get('/dump_equipment_qid', function(req, res, next) {
        var QID_dump = req.session.QID;
        var query = "SELECT name_equipment,amount FROM booking_use_n_equip WHERE booking_use_n_equip.QID=" + "'" + QID_dump + "'";
        connection.query(query, function(err, rows, fields) {
            res.send(rows);
        });
    });
    var query = "SELECT " +
        "booking.QID,booking.client," +
        "booking.Job_description," +
        "booking.photographer," +
        "DATE_FORMAT(shooting_date_start,'%d-%m-%Y %a') shooting_date_start," +
        "DATE_FORMAT(shooting_date_end,'%a %d-%m-%Y') shooting_date_end," +
        "booking.time_start,booking.time_end,booking.status,booking.assignment,room.room_name" +
        " FROM booking LEFT JOIN (booking_use_room INNER JOIN room ON booking_use_room.RID=room.RID)" +
        "ON booking_use_room.QID=booking.QID " +
        "WHERE booking.QID=" + "'" + QID + "'" +
        " ORDER BY booking.shooting_date_start";
    var query_ass = "SELECT assistance.assistance FROM assistance WHERE assistance.QID=" + "'" + QID + "'";
    connection.query(query, function(err, row, fields) {
        if (err) {
            console.log("can't select choosen queue with error " + err);
        } else {
            connection.query(query_ass, function(err, ass, fields) {
                res.render('close_job', {
                    selected: row,
                    ass: ass
                });
            });
        }

    });


});
router.get('/view_edit', function(req, res, next) {
    var QID = req.session.QID;
    router.get('/dump_equipment_qid', function(req, res, next) {
        var QID_dump = req.session.QID;
        var query = "SELECT name_equipment,amount FROM booking_use_n_equip WHERE booking_use_n_equip.QID=" + "'" + QID_dump + "'";
        connection.query(query, function(err, rows, fields) {
            res.send(rows);
        });
    });
    var query = "SELECT " +
        "booking.QID,booking.client," +
        "booking.Job_description," +
        "booking.photographer," +
        "DATE_FORMAT(shooting_date_start,'%d-%m-%Y %a') shooting_date_start," +
        "DATE_FORMAT(shooting_date_end,'%a %d-%m-%Y') shooting_date_end," +
        "booking.time_start,booking.time_end,booking.status,booking.assignment,room.room_name" +
        " FROM booking LEFT JOIN (booking_use_room INNER JOIN room ON booking_use_room.RID=room.RID)" +
        "ON booking_use_room.QID=booking.QID " +
        "WHERE booking.QID=" + "'" + QID + "'" +
        " ORDER BY booking.shooting_date_start";
    var query_ass = "SELECT assistance.assistance FROM assistance WHERE assistance.QID=" + "'" + QID + "'";
    connection.query(query, function(err, row, fields) {
        if (err) {
            console.log("can't select choosen queue with error " + err);
        } else {
            connection.query(query_ass, function(err, ass, fields) {
                res.render('view_edit', {
                    selected: row,
                    ass: ass
                });
            });
        }

    });


});
router.post('/view_edit', function(req, res, next) {
    req.session.QID = req.query.QID;
    res.redirect('view_edit');
});
router.get('/dump_qid_status', function(req, res, next) {
    connection.query("SELECT type FROM booking WHERE QID=?", [
        [req.session.QID]
    ], function(err, row, fields) {
        if (err) {
            console.log(err);
        }
        console.log(row);
        res.send(row);
    });
});
router.get('/view', function(req, res, next) {
    var QID = req.session.QID;
    router.get('/dump_equipment_qid', function(req, res, next) {
        var QID_dump = req.session.QID;
        var query = "SELECT name_equipment,amount FROM booking_use_n_equip WHERE booking_use_n_equip.QID=" + "'" + QID_dump + "'";
        connection.query(query, function(err, rows, fields) {
            res.send(rows);
        });
    });
    var query = "SELECT " +
        "booking.QID,booking.client," +
        "booking.Job_description," +
        "booking.photographer," +
        "DATE_FORMAT(shooting_date_start,'%d-%m-%Y %a') shooting_date_start," +
        "DATE_FORMAT(shooting_date_end,'%a %d-%m-%Y') shooting_date_end," +
        "booking.time_start,booking.time_end,booking.status,booking.assignment,room.room_name" +
        " FROM booking LEFT JOIN (booking_use_room INNER JOIN room ON booking_use_room.RID=room.RID)" +
        "ON booking_use_room.QID=booking.QID " +
        "WHERE booking.QID=" + "'" + QID + "'" +
        " ORDER BY booking.shooting_date_start";
    var query_ass = "SELECT assistance.assistance FROM assistance WHERE assistance.QID=" + "'" + QID + "'";
    connection.query(query, function(err, row, fields) {
        if (err) {
            console.log("can't select choosen queue with error " + err);
        } else {
            connection.query(query_ass, function(err, ass, fields) {
                res.render('view', {
                    selected: row,
                    ass: ass
                });
            });
        }

    });


});
router.get('/equipment_table', function(req, res, next) {
    console.log("equipment_list router connected");

    var catagories = req.query.catagories; // the catagories the selected
    var count = req.query.count; // boolean value that show count or not 
    if (count == 'false') { // if count == false means that we show the unique type. 
        connection.query('SELECT * FROM equipment WHERE type=' + '"' + catagories + '"', function(err, rows, fields) {
            if (err) {
                console.log('cannot query the statement');
                console.log(err);
                throw err;
            }
            res.render('equipment_table', {
                equip: rows
            });

        });
    }

});
router.get('/equipment_table_count', function(req, res, next) {
    console.log("equipment_table_count router connected");

    var catagories = req.query.catagories;
    var count = req.query.count;
    connection.query('SELECT *,COUNT(Description) AS count FROM equipment WHERE type=' + '"' + catagories + '"' + " GROUP BY Description", function(err, rows, fields) {
        if (err) {
            console.log('cannot query the statement');
            throw err;
        } else {
            res.render('equipment_table_count', {
                equip: rows
            });

        }
    });


});

//get equipment page
router.get('/equipment_list', function(req, res, next) {
    console.log("equipment_list router connected");
    res.render('equipment_list');

});
router.get('/queue_table', function(req, res, next) {
    var sort_type = req.query.data;
    var query;
    query = "SELECT " +
        "booking.QID,booking.client," +
        "booking.Job_description," +
        "booking.photographer," +
        "shooting_date_start," +
        "shooting_date_end," +
        "booking.time_start,booking.time_end,booking.status,booking.assignment,room.room_name,booking.status AS assistance" +
        " FROM booking LEFT JOIN (booking_use_room INNER JOIN room ON booking_use_room.RID=room.RID)" +
        "ON booking_use_room.QID=booking.QID " +
        "WHERE YEARWEEK(booking.shooting_date_start, 1) = YEARWEEK(CURDATE()+INTERVAL " + sort_type + " WEEK, 1) " +
        "ORDER BY booking.shooting_date_start";
    query_ass = "SELECT* FROM assistance";
    connection.query(query, function(err, rows, fields) {
        var rl = rows.length;
        if (err) {
            console.log('cannot query the statement');
            throw err;
        }
        for (var i = 0; i < rows.length; i++) {
            for (var j = 1; j + i < rows.length; j++) {
                if (rows[i].QID == rows[i + j].QID) {
                    rows[i].room_name = rows[i].room_name + "<br>" + rows[i + j].room_name;
                }
            }

        }

        for (var i = 0; i < rows.length; i++) {
            for (var j = 1; j + i < rows.length; j++) {
                if (rows[i].QID == rows[i + j].QID) {
                    rows.remove(i + j);
                    j = j - 1;
                }
            }

        }
        connection.query(query_ass, function(err, rowsa, field) {
            for (var i = 0; i < rows.length; i++) {
                rows[i].assistance = "";
                for (var j = 0; j < rowsa.length; j++) {
                    if (rows[i].QID == rowsa[j].QID) {
                        rows[i].assistance = rows[i].assistance + rowsa[j].assistance + "<br>";
                    }

                }
            }
            rl = rows.length;
            var notHave = [];
            var found = false;
            var weekArray = getWeeks(sort_type);
            for (var j = 0; j < weekArray.length; j++) {
                for (var i = 0; i < rl; i++) {
                    if (new Date(weekArray[j]).toDateString() == new Date(rows[i].shooting_date_start).toDateString()) {
                        console.log(weekArray[j]);
                        found = true;
                        break;
                    } else {
                        found = false;
                    }
                }
                if (!found) {
                    var date_start = weekArray[j];
                    var json = {
                        QID: '',
                        client: '',
                        Job_description: '',
                        photographer: '',
                        shooting_date_start: date_start,
                        shooting_date_end: '',
                        time_start: '',
                        time_end: '',
                        status: '',
                        assignment: '',
                        assistance: '',
                        room_name: ''
                    };
                    rows.push(json);
                }
            }
            rows.sort(function(a, b) {
                return new Date(a.shooting_date_start) - new Date(b.shooting_date_start)
            });
            formateDate(rows);
            res.render('queue_table', {
                data: rows
            });
        });

    });

});

function formateDate(rows) {
    var dateArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (var i = 0; i < rows.length; i++) {
        var firstday = rows[i].shooting_date_start;
        var date = firstday.getDate();
        var month = parseInt(firstday.getMonth()) + 1;
        var day = dateArray[firstday.getDay()];
        var year = firstday.getFullYear();
        var stringFullDate = day + " " + date + "-" + month + "-" + year;
        rows[i].shooting_date_start = stringFullDate;
    }

}

function getWeeks(sort_type) {
    var dateArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var arrayWeek = [];
    var today, todayNumber, previousWeek, week, mondayNumber, monday, sunday, sundayNumber;
    var x = 0;
    previousWeek = 1; //For every week you want to go back the past fill in a lower number. 
    today = new Date();
    todayNumber = today.getDay();
    var curr = new Date(); // get current date
    var getDayTemp;
    if (curr.getDay() == 0) {
        getDayTemp = 7;
    } else {
        getDayTemp = curr.getDay();
    }
    if (sort_type == 0) {
        var first = curr.getDate() - getDayTemp + 1; // First day is the day of the month - the day of the week
        var firstday = new Date(curr.setDate(first)).toDateString();
        for (var i = 0; i < 7; i++) {
            var firstday = new Date(curr.setDate(first));
            var date = firstday.getDate();
            var month = parseInt(firstday.getMonth()) + 1;
            var day = dateArray[firstday.getDay()];
            var year = firstday.getFullYear();
            var stringFullDate = day + " " + date + "-" + month + "-" + year;
            arrayWeek.push(firstday);
            first++;
        }
    } else {
        x = sort_type * 7;
        week = previousWeek * x;
        mondayNumber = 1 - getDayTemp + week
        for (var i = 0; i < 7; i++) {
            var firstday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayNumber);
            var date = firstday.getDate();
            var month = parseInt(firstday.getMonth()) + 1;
            var day = dateArray[firstday.getDay()];
            var year = firstday.getFullYear();
            var stringFullDate = day + " " + date + "-" + month + "-" + year;
            arrayWeek.push(firstday);
            mondayNumber++;
        }
    }
    return arrayWeek;

}
router.post('/queue_table', function(req, res, next) {
    var temp = req.body.data;
});

//post to dummy page on login_auth and redirect back
router.post('/login_auth', function(req, res, next) {
    req.session.user = req.body.username;
    if (req.session.user === 'jarindr') {
        res.redirect('equipment_list');
    } else {
        res.redirect('/');
    }
    console.log("root loggedIn connected");

});

function getQuotationID(row) {
    var date = new Date();
    var year = date.getFullYear().toString().substring(2);
    var month = date.getMonth() + 1;
    var QuotationID;

    month = month.toString();
    if (month.length == 1) {
        month = "0" + month;
    }
    var count = row[0].count.toString();
    if (count.length == 1) {
        count = "000" + count;
    }
    if (count.length == 2) {
        count = "00" + count;
    }
    if (count.length == 3) {
        count = "0" + count;
    }
    QuotationID = "Q" + year + month + count;
    return QuotationID;

}
router.post('/confirm_create_queue', function(req, res, next) {
    console.log("confirm_create_queue connected");
    console.log("POST HAVE BEEN CALLED");
    connection.query('SELECT COUNT(*) AS count FROM booking ', function(err, row, field) {
        var id = getQuotationID(row);
        var job = req.body.job_description_form;
        var data = {
            QID: id,
            client: req.body.client_form,
            job_description: job,
            photographer: req.body.Photographer_form,
            shooting_date_start: req.body.date_picker_dummy_start,
            shooting_date_end: req.body.date_picker_dummy_end,
            time_start: req.body.time_form,
            time_end: req.body.time_form,
            status: req.body.status_selector,
            assignment: req.body.assignment_selector,
            type: req.body.type

        };
        if (err) {
            res.redirect('error');
        }
        var nRoom = 0;
        var nAss = 0;
        var roomArray = [];
        var equipArray = [];
        var arrayNumberEquip = [];
        var equipData = [];
        var assData = [];
        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if (key == "equip_item") {
                    var equipString = req.body[key];
                    for (var i = 0; i < equipString.length; i++) {
                        var equipName = equipString[i].slice(0, equipString.lastIndexOf("&") - 1);
                        var equipNumber = equipString[i].slice(equipString.lastIndexOf("&"), equipString[i].length);
                        equipData.push([id, equipName, equipNumber]);
                    }
                }
                if (key.slice(0, 4) == "room") {
                    if (req.body[key] != "None") {
                        roomArray.push([id, req.body[key], 'hello']);
                    }
                }
                if (key == "assistant_form") {
                    var assistString = req.body[key];
                    if (typeof assistString == "string") {
                        assData.push([id, req.body[key], "shootdee"]);
                    } else {
                        for (var i = 0; i < assistString.length; i++) {
                            if (req.body[key][i].trim().length > 0) {
                                assData.push([id, req.body[key][i], "shootdee"]);
                            }
                        }
                    }

                }
            }
        }
        connection.query('INSERT INTO booking SET?', data, function(err, row, field) { // main data all QID and stuff
            if (err) {
                console.log("can't insert booking with error code " + err);
            } else {
                console.log("insert booking complete");
                connection.query('INSERT INTO assistance(QID,assistance,type) VALUE?', [assData], function(err, row, field) {
                    if (err) {
                        console.log("can't insert assistant with error code " + err);
                    } else {
                        console.log("insert assistant complete");
                        connection.query('INSERT INTO booking_use_n_equip(QID,name_equipment,amount) VALUE?', [equipData], function(err, row, field) {
                            if (err) {
                                console.log("can't insert booking_use_n_equip with error code " + err);
                            } else {
                                console.log("insert booking_use_n_equip complete.")
                                if (roomArray.length != 0) { // if equipment rental not choosen
                                    connection.query('INSERT INTO booking_use_room(QID,RID, lighting) VALUE?', [roomArray], function(err, row, field) {
                                        if (err) {
                                            console.log("can't insert room_booking with error code " + err);
                                        } else {
                                            console.log("insert booking_use_room complete.")
                                            console.log("inserted data complete");
                                            res.redirect('confirm_create_queue');
                                        }
                                    });
                                } else {
                                    res.redirect('confirm_create_queue');
                                }
                            }
                        });
                    }
                });
            }

        });

    });


});
router.post('/confirm_add_rent_equipment', function(req, res, next) {
    var str = req.body.supplier_form + req.body.description_form;
    var UID = str;
    var data = {
        supplier: req.body.supplier_form,
        description: req.body.description_form,
        price: req.body.price_form,
        quantity: req.body.quantity_form,
        SUID: UID
    }
    connection.query("INSERT INTO rented_equipment SET?", data, function(err, row, field) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('confirm_add_rent_equipment');
        }
    });
});
router.get('/confirm_add_rent_equipment', function(req, res, next) {
    res.render('confirm_add_rent_equipment');
});
router.get('/dump_rent_equipment', function(req, res, next) {
    connection.query("SELECT* FROM rented_equipment", function(err, row, field) {
        res.send(row);
    });

});
router.get('/confirm_edit_queue', function(req, res, next) {
    res.render('confirm_edit_queue');
});
router.post('/confirm_edit_queue', function(req, res, next) {
    console.log("confirm_create_queue connected");
    console.log("POST HAVE BEEN CALLED");
    connection.query('SELECT COUNT(*) AS count FROM booking ', function(err, row, field) {
        var id = req.body.quotation_number;
        console.log(id);
        var data = {
            client: req.body.client_form,
            job_description: req.body.job_description_form,
            photographer: req.body.Photographer_form,
            shooting_date_start: req.body.date_picker_dummy_start,
            shooting_date_end: req.body.date_picker_dummy_end,
            time_start: req.body.time_form,
            time_end: req.body.time_form,
            status: req.body.status_selector,
            assignment: req.body.assignment_selector,
            type: req.body.type
        };
        if (err) {
            res.redirect('error');
        }
        var nRoom = 0;
        var nAss = 0;
        var roomArray = [];
        var equipArray = [];
        var arrayNumberEquip = [];
        var equipData = [];
        var assData = [];
        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                if (key == "equip_item") {
                    var equipString = req.body[key];
                    for (var i = 0; i < equipString.length; i++) {
                        var equipName = equipString[i].slice(0, equipString.lastIndexOf("&") - 1);
                        var equipNumber = equipString[i].slice(equipString.lastIndexOf("&"), equipString[i].length);
                        equipData.push([id, equipName, equipNumber]);
                    }
                }
                if (key.slice(0, 4) == "room") {
                    if (req.body[key] != "None") {
                        roomArray.push([id, req.body[key], 'hello']);
                    }
                }
                if (key == "assistant_form") {
                    var assistString = req.body[key];
                    if (typeof assistString == "string") {
                        assData.push([id, req.body[key], "shootdee"]);
                    } else {
                        for (var i = 0; i < assistString.length; i++) {
                            if (req.body[key][i].trim().length > 0) {
                                assData.push([id, req.body[key][i], "shootdee"]);
                            }
                        }
                    }

                }
            }
        }
        connection.query('UPDATE booking SET? WHERE QID=?', [data, id], function(err, row, field) { // main data all QID and stuff
            if (err) {
                console.log("can't insert booking with error code " + err);
            } else {
                console.log("edit booking complete");
            }
        });
        connection.query('DELETE FROM assistance WHERE QID=?', [id], function(err, row, field) {
            connection.query('INSERT INTO assistance(QID,assistance,type) VALUE?', [assData], function(err, row, field) {
                if (err) {
                    console.log("can't insert assistant with error code " + err);
                } else {
                    console.log("insert assistant complete");
                }
            });
        });
        connection.query('DELETE FROM booking_use_n_equip WHERE QID=?', [id], function(err, row, field) {
            connection.query('INSERT INTO booking_use_n_equip(QID,name_equipment,amount) VALUE?', [equipData], function(err, row, field) {
                if (err) {
                    console.log("can't insert booking_use_n_equip with error code " + err);
                } else {
                    console.log("insert booking_use_n_equip complete.")

                }

            });
        });

        connection.query('DELETE FROM booking_use_room WHERE QID=?', [id], function(err, row, field) {
            if (roomArray.length != 0) { // if equipment rental not choosen
                connection.query('INSERT INTO booking_use_room(QID,RID, lighting) VALUE?', [roomArray], function(err, row, field) {
                    if (err) {
                        console.log("can't insert room_booking with error code " + err);
                    } else {
                        console.log("insert booking_use_room complete.")
                        res.redirect('confirm_edit_queue');
                    }
                });
            } else {
                res.redirect('error');
            }
        });

    });

});


router.post('/queues', function(req, res, next) {
    console.log("get form");
    res.redirect('queues');
});
//get error page
router.get('/error', function(req, res, next) {
    res.render('error');

});


// useful function

//function to check authorization.
function checkAuth(req, res, next) {
    console.log(req.session.user);
    if (req.session.user === 'jarindr') {
        next();
    } else {
        res.redirect('/');
    }
}

function createConnection() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'shootdee',
    });
    connection.connect(function(err) {
        if (err) {
            console.log("failed to connect mySQL");
        } else {
            console.log("connected to my SQL");
        }
    });
    return connection;
}


// this is all the functions that used in here
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function arraysEqual(a1, a2) {
    return JSON.stringify(a1) == JSON.stringify(a2);
}
Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
};

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
String.prototype.shuffle = function() {

    var that = this.split("");
    var len = that.length,
        t, i
    while (len) {
        i = Math.random() * len-- | 0;
        t = that[len], that[len] = that[i], that[i] = t;
    }
    return that.join("");
};
//export the routers
module.exports = router;