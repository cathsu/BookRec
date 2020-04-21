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