var socket = io();
var connected = false;
var localUser = localStorage.getItem('username'), tempVal;
var realstatusOne, realstatusTwo, realstatusThree = false;
//time selector
var slider_one = document.getElementById("timeSelector_one");
var slider_two = document.getElementById("timeSelector_two");
var slider_three = document.getElementById("timeSelector_three"); 
var output_one = document.getElementById("timetoShow_one");
var output_two = document.getElementById("timetoShow_two");
var output_three = document.getElementById("timetoShow_three");

output_one.innerHTML = slider_one.value; // Display the default slider value
output_two.innerHTML = slider_two.value; 
output_three.innerHTML = slider_three.value; 
// Update the current slider value (each time you drag the slider handle)
slider_one.oninput = function () {
    output_one.innerHTML = this.value + ' mins';
}
slider_two.oninput = function () {
    output_two.innerHTML = this.value + ' mins';
}
slider_three.oninput = function () {
    output_three.innerHTML = this.value + ' mins';
}
//get current date:
var dateTime;
var getCurrent = function () {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    dateTime = date + ' ' + time;
}
var postItem = function (val) {
    var data = { name: val };
    $.ajax({
        type: 'POST',
        url: '/user',
        timeout: 2000,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //show content
            console.log('Success!' + data);
            $('#modalName').modal('hide');
        },
        error: function (jqXHR, textStatus, err) {
            //show error message
            console.log('text status ' + textStatus + ', err ' + err)
        }
    });
}
var postTime = function (val, user, machine) {
    let data = { time: val, user: user, machine: machine };
    $.ajax({
        type: 'POST',
        url: '/time'+machine,
        timeout: 2000,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //hide the time scroll and ok btn
            console.log('time sent!', data);
            $('#showTime_'+machine).hide();
            $('#cancel_'+machine).show();
            console.log('are u sending localuser?' + user);
        },
        error: function (err) {
            //show erro
            console.log('error:' + JSON.stringify(err));
        }
    });
}
var postCancel = function (val, machine) {
    let data = { status: val, machine: machine };
    $.ajax({
        type: 'POST',
        url: '/cancel_'+machine,
        timeout: 2000,
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //hide the time scroll and ok btn
            console.log('time sent!', data);
            $('#showTime_'+machine).show();
            $('#cancel_'+machine).hide();
        },
        error: function (err) {
            //show erro
            console.log('err ' + err);
        }
    });
}
// // add last user:
// var postLastUser = function (val) {
//     var data = { name: localUser, date: val };
//     $.ajax({
//         type: 'POST',
//         url: '/lastuser',
//         timeout: 2000,
//         data: JSON.stringify(data),
//         contentType: 'application/json; charset=utf-8',
//         success: function (data) {
//             //show content
//             console.log('Success!' + data);
//             //$('#modalName').modal('hide');
//         },
//         error: function (jqXHR, textStatus, err) {
//             //show error message
//             console.log('text status ' + textStatus + ', err ' + err)
//         }
//     });
// }

$(document).ready(function () {
    if (localUser == null || localUser == undefined) {
        $('#modalName').modal('show');
    } else {
        $('#showToast').toast('show');
        $('#insertuser').text(localUser);
    }
    console.log('localuser:' + localUser);
    $('#okBtn').on('click', function () {
        //check if they put name on it:
        tempVal = $('#usr').val();
        if (tempVal != '') {
            postItem(tempVal);
            localStorage.setItem('username', tempVal);
        } else {
            console.log('mother f* didnt put name');
        }
    });
    $('#gobtn_one').on('click', function () {
        console.log('1 ok GO!')
        let timeselector = $('#timeSelector_one').val();
        timeselector = timeselector * 60;
        localUser = localStorage.getItem('username');
        if (localUser != null && connected == true && localUser != undefined) {
            //we emit current user and status as false
            console.log('main validator is working');
            //socket.emit('currentUserclient', localUser, false);
            postTime(timeselector, localUser, 1);
        } else {
            $('#showAlert').show();
        }
    });
    $('#gobtn_two').on('click', function () {
        console.log('2 ok GO!')
        let timeselector = $('#timeSelector_two').val();
        timeselector = timeselector * 60;
        localUser = localStorage.getItem('username');
        if (localUser != null && connected == true && localUser != undefined) {
            //we emit current user and status as false
            console.log('main validator is working');
            //socket.emit('currentUserclient', localUser, false);
            postTime(timeselector, localUser, 2);
        } else {
            $('#showAlert').show();
        }
    });
    $('#gobtn_three').on('click', function () {
        console.log('3 ok GO!')
        let timeselector = $('#timeSelector_three').val();
        timeselector = timeselector * 60;
        localUser = localStorage.getItem('username');
        if (localUser != null && connected == true && localUser != undefined) {
            //we emit current user and status as false
            console.log('main validator is working');
            //socket.emit('currentUserclient', localUser, false);
            postTime(timeselector, localUser, 3);
        } else {
            $('#showAlert').show();
        }
    });
    $('#cancel_1').on('click', function () {
        postCancel(false, 1);
    });
    $('#cancel_2').on('click', function () {
        postCancel(false, 2);
    });
    $('#cancel_3').on('click', function () {
        postCancel(false, 3);
    });
    socket.on('connect', function () {
        console.log('you are connected');
        connected = true;
    });
    socket.on('timer1', function (data) {
        $('#counter_one').html(data.countdown);
    });
    socket.on('timer2', function (data) {
        $('#counter_two').html(data.countdown);
    });
    socket.on('timer3', function (data) {
        $('#counter_three').html(data.countdown);
    });
    socket.on('status1', function (data) {
        console.log('whats data.status: ' + data.status);
        if (data.status == false) {
            $('.toggle').eq(0).addClass('off');
            $('#showTime_1').hide();
            realstatusOne = false;
        } 
        if(data.status == true) {
            $('.toggle').eq(0).removeClass('off');
            $('#showTime_1').show();
            $('#cancel_1').hide();
            realstatusOne = true;
        }
    });
    socket.on('status2', function (data) {
        console.log('whats data.status: ' + data.status);
        if (data.status == false) {
            $('.toggle').eq(1).addClass('off');
            $('#showTime_2').hide();
            realstatusTwo = false;
        } 
        if(data.status == true) {
            $('.toggle').eq(1).removeClass('off');
            $('#showTime_2').show();
            $('#cancel_2').hide();
            realstatusTwo = true;
        }
    });
    socket.on('status3', function (data) {
        console.log('whats data.status: ' + data.status);
        if (data.status == false) {
            $('.toggle').eq(2).addClass('off');
            $('#showTime_3').hide();
            realstatusThree = false;
        } 
        if(data.status == true) {
            $('.toggle').eq(2).removeClass('off');
            $('#showTime_3').show();
            $('#cancel_3').hide();
            realstatusThree = true;
        }
    });
    //show or hide cancel btn for otherusers
    socket.on('currentUser1', function (data) {
        console.log('current user: ' + data.currentuser);
        $('#currentUser1').text(data.currentuser);
        if(localUser == data.currentuser && realstatusOne == false){
            $('#cancel_1').show();
            }
    });
    socket.on('currentUser2', function (data) {
        console.log('current user: ' + data.currentuser);
        $('#currentUser2').text(data.currentuser);
        if(localUser == data.currentuser && realstatusTwo == false){
            $('#cancel_2').show();
            }
    });
    socket.on('currentUser3', function (data) {
        console.log('current user: ' + data.currentuser);
        $('#currentUser3').text(data.currentuser);
        if(localUser == data.currentuser && realstatusThree == false){
            $('#cancel_3').show();
            }
    });
});