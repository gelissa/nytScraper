// grab articles as JSON
$.getJSON("/articles", function(data){
    // for each one
    for (var i = 0; i < data.length; i++){
        // display the info on the page
        $(".articles").append("<p data-id='" + data[i]._id + "'>" + "<h2>" + data[i].title + "</h2>" + "<br />" + "<a href='https://nytimes.com" + data[i].link + "'> Link to article </a>" + "</p>");
    }
});


$(document).on("click", "h2", function(){
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function(data){
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "'id='savenote'>Save Note</button>");
    
            if (data.note){
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function(){
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
    .then(function(data){
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(".clear").on("click", function(){
    $.ajax({
        url:"/clear",
        method:"DELETE"
    })
    .then(function(data){
        console.log("delete");
        location.reload()
    })
})

