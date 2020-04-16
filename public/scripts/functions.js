let nextBook = $("#nextBook");
let prevBook = $("#prevBook");

$("button").click(function(){
    $.ajax({
        url: "/populateCards",
        type: "GET",
        dataType: "json",
        success: function(data){
            $.each(data, function(key, value) {
                
            });
        },
        error: function(e) {
            console.log("An error occurred during your request: " +  e.status + " " + e.statusText);
        }
    }
        
    )
});