$("#editBtn").on("click", function(){
    console.log("Editing!");
    let user = $(this).parent().parent().attr("id"); 
    let userReview =  $("#" + user + ' > #review'); 
    let editedReviewArea = $("#" + user + ' > #editedReviewArea');
    let originalReview = $("#" + user + "> #review").text();
    userReview.text("");
    console.log("original Review = " + originalReview);
    editedReviewArea.html('<textarea class="form-control" class="whitespace" name="editedReview" id="editedReview" rows="5" required>'+ originalReview + '</textarea>');
    toggleButtons(false);
    console.log( $("#buttons > #cancelEditBtn").attr("id"));
    
    let didEditBefore = $("#" + user + "> #edit").text().trim().length > 0? true: false;     
    console.log(didEditBefore);
    $("#cancelEditBtn").on("click", function() {
        // let user = $(this).parent().parent().attr("id");
        userReview.text(originalReview);
        editedReviewArea.text("");
        // userReview.html('<div class="whitespace" id="review">' + originalReview + '</div>');
        $(".errorMsg").empty();
        toggleButtons(true);
        

    }); 
    
    $("#submitEditBtn").on("click", function() {
        let isbn = $(this).parent().parent().find("#isbn").val();
        let editedReview = $("#editedReview").val(); 
        let errorMsg = $("#" + user + "> .errorMsg"); 
        console.log(editedReview);

       
        if (!editedReview.length) { //&& !$("#noReview").length) {
            console.log(1);
            $(".errorMsg").empty();
            errorMsg.html('Please write down something!'); 
            // return;
        }
        

        else if (editedReview === originalReview) { // && !$('#sameReview').length) {
            console.log(3);
            $(".errorMsg").empty();
            errorMsg.html('Please write down something new!');
        }

        
        else {                        

            console.log(5);
            console.log("edit = " + editedReview);
            console.log("orignal = " + originalReview); 
            console.log(editedReview == originalReview);
            $.ajax({
                method: "PUT",
                url: "/review/" + isbn, 
                dataType: "JSON",
                data: { "editedReview": editedReview, "username": user},
                success: function(result,status) {
                    $(".errorMsg").empty();
                    toggleButtons(true);
                    editedReviewArea.text("");
                    userReview.text(editedReview);
                    
                    // set original review to editedreview
                    originalReview = editedReview;
                    console.log("didEditBefore = " + didEditBefore);
                    console.log($("#" + user + "> #edit").text());
                    if (!didEditBefore) {
                        $("#" + user + "> #edit").text("(Edited)"); 
                    }

                    
                }, 
                
                error: function(error,status) {
                  
                     alert(error);
                }
                
            });//ajax
        }
    })
    
}); 


// keep track of remaining number of characters available in review
$("#newReview").on("keyup", function () {
    hasExceededCharLimit("#newReview", "#charsLeft"); 
}); 

function hasExceededCharLimit(review, msg) {
    const MAX_CHARS = 10; 
    let currentLength = $(review).val().length; 
    console.log(currentLength); 
    let charsLeft = MAX_CHARS-currentLength; 
    if (charsLeft == 0) {
        $(msg).text("You've reached the limit!");
        return false; 
    } else if (charsLeft < 0) {
        let charsOver = currentLength - MAX_CHARS; 
        $(msg).text("You've gone " + charsOver + " characters over the limit!");
        return true;
    } else {
        $(msg).text("You have " + charsLeft + " characters left!");
        return false;
    }
    
    
}


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


$("#forward").on("click", () => {
    $.ajax({
        url: "/forwardCards",
        type: "POST",
        dataType: "JSON",
        data: {
            "card1":$(".card1 > .card-body > .card-title").text()
        },
        success: function(data, status){
            console.log(data);
            $(".card1").attr("id", data[0].ISBN);
            $(".card1 > .card-img-top").attr("src", data[0].img);
            $(".card1 > .card-body > .card-title").text(data[0].title);
            $(".card1 > .card-body > a").attr("href", "/results/"+data[0].ISBN);
            $(".card1 > .card-body > .card-text").text(data[0].description);
            
            $(".card2").attr("id", data[1].ISBN);
            $(".card2 > .card-img-top").attr("src", data[1].img);
            $(".card2 > .card-body > .card-title").text(data[1].title);
            $(".card2 > .card-body > a").attr("href", "/results/"+data[1].ISBN);
            $(".card2 > .card-body > .card-text").text(data[1].description);

            $(".card3").attr("id", data[2].ISBN);
            $(".card3 > .card-img-top").attr("src", data[2].img);
            $(".card3 > .card-body > .card-title").text(data[2].title);
            $(".card3 > .card-body > a").attr("href", "/results/"+data[2].ISBN);
            $(".card3 > .card-body > .card-text").text(data[2].description);
        },
        error: function(e) {
            console.log("An error occurred during your request: " +  e.status + " " + e.statusText);
        }
    })
});

$("#back").on("click", () => {
    $.ajax({
        url: "/backCards",
        type: "POST",
        dataType: "JSON",
        data: {
            "card1":$(".card1 > .card-body > .card-title").text()
        },
        success: function(data, status){
            console.log(data);
            $(".card1").attr("id", data[0].ISBN);
            $(".card1 > .card-img-top").attr("src", data[0].img);
            $(".card1 > .card-body > .card-title").text(data[0].title);
            $(".card1 > .card-body > a").attr("href", "/results/"+data[0].ISBN);
            $(".card1 > .card-body > .card-text").text(data[0].description);

            $(".card2").attr("id", data[1].ISBN);
            $(".card2 > .card-img-top").attr("src", data[1].img);
            $(".card2 > .card-body > .card-title").text(data[1].title);
            $(".card2 > .card-body > a").attr("href", "/results/"+data[1].ISBN);
            $(".card2 > .card-body > .card-text").text(data[1].description);

            $(".card3").attr("id", data[2].ISBN);
            $(".card3 > .card-img-top").attr("src", data[2].img);
            $(".card3 > .card-body > .card-title").text(data[2].title);
            $(".card3 > .card-body > a").attr("href", "/results/"+data[2].ISBN);
            $(".card3 > .card-body > .card-text").text(data[2].description);

        },
        error: function(e) {
            console.log("An error occurred during your request: " +  e.status + " " + e.statusText);
        }
    })
});


$(document).ready(function() { 
    $(".card1").hover(function() { 
        $(this).addClass("active-card"); 
        $(".card2").addClass("inactive-card");
        $(".card3").addClass("inactive-card");
    }, function() { 
        $(this).removeClass("active-card");
        $(".card2").removeClass("inactive-card");
        $(".card3").removeClass("inactive-card");
    }); 
}); 

$(document).ready(function() { 
    $(".card2").hover(function() { 
        $(this).addClass("active-card"); 
        $(".card1").addClass("inactive-card");
        $(".card3").addClass("inactive-card");
    }, function() { 
        $(this).removeClass("active-card");
        $(".card1").removeClass("inactive-card");
        $(".card3").removeClass("inactive-card");
    }); 
}); 

$(document).ready(function() { 
    $(".card3").hover(function() { 
        $(this).addClass("active-card"); 
        $(".card1").addClass("inactive-card");
        $(".card2").addClass("inactive-card");
    }, function() { 
        $(this).removeClass("active-card");
        $(".card1").removeClass("inactive-card");
        $(".card2").removeClass("inactive-card");
    }); 
}); 
