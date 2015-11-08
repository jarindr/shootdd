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
        "booking.time_start,booking.time_end,booking.status,booking.assignment,assistance.assistance,room.room_name" +
        " FROM (booking LEFT JOIN assistance " +
        "ON booking.QID=assistance.QID)" +
        " LEFT JOIN (booking_use_room INNER JOIN room ON booking_use_room.RID=room.RID)" +
        "ON booking_use_room.QID=booking.QID " +
        "WHERE booking.QID=" + "'" + QID + "'" +
        " ORDER BY booking.shooting_date_start";
    var query_equip = "SELECT name_equipment,amount FROM booking_use_n_equip WHERE booking_use_n_equip.QID=" + "'" + QID + "'";
    connection.query(query, function(err, row, fields) {
        if (err) {
            console.log("can't select choosen queue with error " + err);
        } else {
            console.log(row);
            res.render('close_job', {
                selected: row
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
        "booking.time_start,booking.time_end,booking.status,booking.assignment,assistance.assistance,room.room_name" +
        " FROM (booking LEFT JOIN assistance " +
        "ON booking.QID=assistance.QID)" +
        " LEFT JOIN (booking_use_room INNER JOIN room ON booking_use_room.RID=room.RID)" +
        "ON booking_use_room.QID=booking.QID " +
        "WHERE booking.QID=" + "'" + QID + "'" +
        " ORDER BY booking.shooting_date_start";
    var query_equip = "SELECT name_equipment,amount FROM booking_use_n_equip WHERE booking_use_n_equip.QID=" + "'" + QID + "'";
    connection.query(query, function(err, row, fields) {
        if (err) {
            console.log("can't select choosen queue with error " + err);
        } else {

            console.log(row);
            res.render('view_edit', {
                selected: row
            });


        }

    });


});
router.post('/view_edit', function(req, res, next) {
    req.session.QID = req.query.QID;
    res.redirect('view_edit');
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
        "booking.time_start,booking.time_end,booking.status,booking.assignment,assistance.assistance,room.room_name" +
        " FROM (booking LEFT JOIN assistance " +
        "ON booking.QID=assistance.QID)" +
        " LEFT JOIN (booking_use_room INNER JOIN room ON booking_use_room.RID=room.RID)" +
        "ON booking_use_room.QID=booking.QID " +
        "WHERE booking.QID=" + "'" + QID + "'" +
        " ORDER BY booking.shooting_date_start";
    connection.query(query, function(err, row, fields) {
        if (err) {
            console.log("can't select choosen queue with error " + err);
        } else {

            res.render('view', {
                selected: row
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
        "DATE_FORMAT(shooting_date_start,'%a %d-%m-%Y') shooting_date_start," +
        "DATE_FORMAT(shooting_date_end,'%a %d-%m-%Y') shooting_date_end," +
        "booking.time_start,booking.time_end,booking.status,booking.assignment,assistance.assistance,room.room_name" +
        " FROM (booking LEFT JOIN assistance " +
        "ON booking.QID=assistance.QID)" +
        " LEFT JOIN (booking_use_room INNER JOIN room ON booking_use_room.RID=room.RID)" +
        "ON booking_use_room.QID=booking.QID " +
        "WHERE YEARWEEK(booking.shooting_date_start, 1) = YEARWEEK(CURDATE()+INTERVAL " + sort_type + " WEEK, 1) " +
        "ORDER BY booking.shooting_date_start"
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
        rl = rows.length;
        var datea = new Date();
        var dateArray = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var notHave = [];
        var found = false;
        for (var j = 0; j < dateArray.length; j++) {
            for (var i = 0; i < rl; i++) {
                var day = rows[i].shooting_date_start.split('-');
                var realDay = day[0].slice(0, 3);
                if (dateArray[j] == realDay) {
                    found = true;
                    break;
                } else {
                    found = false;
                }
            }
            if (!found) {
                var date_start = dateArray[j];
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
        res.render('queue_table', {
            data: rows
        });
    });

});
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
            assignment: req.body.assignment_selector

        };
        if (err) {
            res.redirect('error');
        }
        var ast = {
            assistance: req.body.assistant_form1,
            QID: id,
            type: "shootdee"
        }
        var nRoom = 0;
        var nAss = 0;
        var roomArray = [];
        var equipArray = [];
        var arrayNumberEquip = [];
        var equipData = [];
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
                        nRoom++;
                        roomArray.push([id, req.body[key], 'hello']);
                    }
                }
                if (key.slice(0, 9) == "assistant") {
                    nAss++;
                }
            }
        }
        connection.query('INSERT INTO booking SET?', data, function(err, row, field) { // main data all QID and stuff
            if (err) {
                console.log("can't insert booking with error code " + err);
            } else {
                console.log("insert booking complete");
                connection.query('INSERT INTO assistance SET?', ast, function(err, row, field) {
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

//export the routers
module.exports = router;