$("#editBtn").on("click", function(){
    console.log("Editing!");
    let user = $(this).parent().parent().attr("id"); 
    let originalReview = $("#" + user + "> #review").text();
    console.log(originalReview);
    $("#" + user + ' > #review').html(`
        <textarea class="form-control" name="editedReview" id="editedReview" rows="5"> `+ originalReview + `</textarea>
    `);
    $("#" + user).find("#deleteBtn").hide();
    
    
}); 
$("#reviewForm").submit(function(event) {
    event.preventDefault(); 
    console.log($("#datetime").val()); 
    $.ajax({
        method: "POST",
        url: "/addreview/" + $("#isbn").val(),
        dataType: "JSON",
        data: { 
            "newReview": $("#newReview").val(), 
            "username": "user123", 
            "datetime": $("#datetime").val()
        },
        success: function(result,status) {
            console.log(result);
            console.log(result.username);
             $("#reviews").append(`
                <div id="` + result.username + `" class="heading row">    
                    <div class="col">` + 
                        result.username + `
                    </div>
                    <div class="align col">` + 
                        result.datetime + `
                    </div>
                </div>
                <div>` + result.newReview + `</div>
                <hr>
             `)
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