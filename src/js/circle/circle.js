$( document ).ready(function() {

    $('textarea').autogrow({onInitialize: true});
    
    //Cloner for infinite input lists
    $(".circle--clone--list").on("click", ".circle--clone--add", function(){
        let parent = $(this).parent("li");
        let copy = parent.clone();
        parent.after(copy);
        copy.find("input, textarea, select").val("");
        copy.find("*:first-child").focus();
    });
    
    $(".circle--clone--list").on("click", "li:not(:only-child) .circle--clone--remove", function(){
        let parent = $(this).parent("li");
        parent.remove();
    });
    
    // Adds class to selected item
    $(".circle--pill--list a").click(function() {
        $(".circle--pill--list a").removeClass("selected");
        $(this).addClass("selected");
    });
    
    // Adds class to parent div of select menu
    $(".circle--select select").focus(function(){
        $(this).parent().addClass("focus");
    }).blur(function(){
        $(this).parent().removeClass("focus");
    });
    
    // Clickable table row
    $(".clickable-row").click(function() {
        let link = $(this).data("href");
        let target = $(this).data("target");
        
        if ($(this).attr("data-target")) {
            window.open(link, target);
        }
        else {
            window.open(link, "_self");
        }
    });
    
    // Custom File Inputs
    let input = $(".circle--input--file");
    let text = input.data("text");
    let state = input.data("state");
    input.wrap(function() {
        return "<a class='button " + state + "'>" + text + "</div>";
    });
    
});