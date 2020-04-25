$("button").click(function(){
    $.ajax({
        url: "/populateCards",
        type: "GET",
        dataType: "json",
        data: {
            "card1" : $("#card-1").text()
        },
        success: function(data){
            console.log("Success. Printing key value pairs:");
            $.each(data, function(key, value) {
                console.log(key, value);
            });
        },
        error: function(e) {
            console.log("Error");
        }
    })
});