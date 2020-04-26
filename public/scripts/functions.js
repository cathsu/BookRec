$("#reviewForm").submit(function(event) {
    event.preventDefault(); 
    $.ajax({
        method: "POST",
        url: "/addreview/" + $("#isbn").val(),
        dataType: "JSON",
        data: { 
            "newReview": $("#newReview").val(), 
            "username": "user123"
        },
        success: function(result,status) {
          
             alert(result);
        }, 
        
        error: function(error,status) {
          
             alert(error);
        }
    
    });//ajax
}); 

let nextBook = $("#nextBook");
let prevBook = $("#prevBook");

$(".forwardCard").click(function(){
    console.log($("#card1").text());
    $.ajax({
        url: "/populateCards",
        type: "POST",
        dataType: "JSON",
        data: {
            "card1":$("#card1").text()
        },
        success: function(data){
            let res = data[0];
            $.each(res, function(key, value) {
                console.log(key, value);
            });
        },
        error: function(e) {
            console.log("An error occurred during your request: " +  e.status + " " + e.statusText);
        }
    }
        
    )
});

// $("#loginForm").submit(function() {
//     console.log("validating user and pass: ");
//     let login = $("#username");
//     let password = $("#password");
//     console.log(login, password);
// }); 