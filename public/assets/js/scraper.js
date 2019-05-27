
$(document).ready(function() {


  $('.scrape').on('click', function(e) {
    e.preventDefault();

    $('.modal').toggleClass('shown');

    $.ajax({
      url: "/scrape"
    }).done(function(res) {
     $('.modalArticles').empty();
      // hide modal spinner...

      // populate modal
      $.each(res, function(i, elem) {
        var title = $('<h3>');
        var link = $('<a>').attr('href', elem.link).text(elem.title);
        link.addClass('modalLink');
        title.append(link);
        var byline = $('<span>').text(elem.byline).addClass('byline');
        var listItem = $('<li>');
        listItem.append(title, byline);
        $('.modalArticles').append(listItem)
      })

      $('.modalWindow').toggleClass('shown')
      

      

    })

  })

  $('.modal').on('click', function(e) {
    e.stopPropagation();
    $(this).toggleClass('shown')
    $('.modalWindow').toggleClass('shown')
  })

})