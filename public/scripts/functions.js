$("#editBtn").on("click", function(){
    console.log("Editing!");
    let user = $(this).parent().parent().attr("id"); 
    let userReview =  $("#" + user + ' > #review'); 
    let originalReview = $("#" + user + "> #review").text();
    console.log("original Review = " + originalReview);
    userReview.html('<textarea class="form-control" class="whitespace" name="editedReview" id="editedReview" rows="5" required>'+ originalReview + '</textarea>');
    // $("#deleteBtn").hide();
    // $("#editBtn").hide();
    // $("#submitEditBtn").attr("hidden", false); 
    // $("#cancelEditBtn").attr("hidden", false);
    toggleButtons(false);
    console.log( $("#buttons > #cancelEditBtn").attr("id"));
    
    let didEditBefore = $("#" + user + "> #edit").length > 0? true: false;     
    console.log(didEditBefore);
    $("#cancelEditBtn").on("click", function() {
        // let user = $(this).parent().parent().attr("id");
        userReview.html('<div class="whitespace" id="review">' + originalReview + '</div>');
        toggleButtons(true);
        

    }); 
    
    $("#submitEditBtn").on("click", function() {
        let isbn = $(this).parent().parent().find("#isbn").val();
        let editedReview = $("#editedReview").val(); 
        
        $.ajax({
            method: "PUT",
            url: "/review/" + isbn, 
            dataType: "JSON",
            data: { "editedReview": editedReview, "username": user},
            success: function(result,status) {
                toggleButtons(true);
                userReview.html('<div class="whitespace" id="review">' + editedReview + '</div>');
                if (!didEditBefore) {
                   userReview.append('<span><i> (Edited)</i></span>'); 
                }
                
            }, 
            
            error: function(error,status) {
              
                 alert(error);
            }
            
        });//ajax

    })
    
}); 

$("#deleteBtn").on("click", function(){
    console.log("Deleting!");
    let user = $(this).parent().parent().attr("id"); 
    let isbn = $("#" + user + " > #isbn").val();
    $.ajax({
            method: "DELETE",
            url: "/review/delete", 
            dataType: "JSON",
            data: {"username": user, "isbn": isbn},
            success: function(result,status) {
                location.reload(true);
            }, 
            error: function(error,status) {
                 alert(error);
            }
            
        });//ajax
}); 

function toggleButtons(bool) {
    if (bool) {
        $("#deleteBtn").show();
        $("#editBtn").show();
        
    } else {
        $("#deleteBtn").hide();
        $("#editBtn").hide();
    }
    $("#submitEditBtn").attr("hidden", bool);  
    $("#cancelEditBtn").attr("hidden", bool); 
}


// $("#reviewForm").submit(function(event) {
//     event.preventDefault(); 
//     console.log($("#datetime").val()); 
//     $.ajax({
//         method: "POST",
//         url: "/addreview/" + $("#isbn").val(),
//         dataType: "JSON",
//         data: { 
//             "newReview": $("#newReview").val(), 
//             "username": $("#user").val(), 
//             "datetime": $("#datetime").val()
//         },
//         success: function(result,status) {
//             console.log(result);
//             console.log(result.username);
//              $("#reviews").append(`
//                 <div id="` + result.username + `" class="heading row">    
//                     <div class="col">` + 
//                         result.username + `
//                     </div>
//                     <div class="align col">` + 
//                         result.datetime + `
//                     </div>
//                 </div>
//                 <div>` + result.newReview + `</div>
//                 <hr>
//              `)
//         }, 
        
//         error: function(error,status) {
          
//              alert(error);
//         }
    
//     });//ajax
// }); 

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


