var scrapedArticles;

$(document).ready(function() {
  $('.scrape').on('click', function(e) {
    e.preventDefault();

    $('.modal.articles').toggleClass('shown');

    $.ajax({
      url: "/scrape"
    }).done(function(res) {
      $('.modalArticles').empty();

      scrapedArticles = res;

      // populate modal
      $.each(res, function(i, elem) {
        var title = $('<h3>');
        var link = $('<a>').attr('href', elem.link).text(elem.title);
        link.addClass('modalLink');
        title.append(link);
        var byline = $('<span>').text(elem.byline).addClass('byline');
        var listItem = $('<li>');
        var button = $('<button>').attr('id', i);
        button.addClass('addArticle').text('Add');
        //button.attr('onclick', 'addArticle(' + i + ')');
        button.attr('data-start', i);
        var articleContainer = $('<div>').addClass('articleContainer');
        var buttonContainer = $('<div>').addClass('buttonContainer');
        articleContainer.append(title, byline);
        buttonContainer.append(button);
        listItem.append(articleContainer, buttonContainer);
        $('.modalArticles').append(listItem);
      })

      $('.modal.articles').find('.modalWindow').toggleClass('shown')
      
      setupClicks()

    })

  })

  $('.modal').on('click', function(e) {
    $(this).toggleClass('shown')
    $(this).find('.modalWindow').toggleClass('shown');
    location.reload()
  })

  $('.modalWindow').on('click', function(e) {
    e.stopPropagation()
  })


  function setupClicks() {
    $('.addArticle').off();
    $('.removeArticle').off();
    $('.addNote').off();
    $('#noteSubmit').off();
    $('.viewNote').off();

    $('.addArticle').on('click', function() {
      var that = $(this)
      var id = $(this).data('start');
      var data = scrapedArticles[id];
      $.ajax({
        type: "POST",
        url: '/articles',
        data: data
      }).done(function(res, id) {
        that.removeClass('addArticle')
        .addClass('removeArticle')
        .attr('id', res._id)
        .text('Remove')
        setupClicks();
      })
     
    })

    $('.removeArticle').on('click', function() {
      var that = $(this)
      $.ajax({
        type: "DELETE",
        url: '/articles/' + $(this).attr('id'),
      }).done(function(res) {
        that.removeClass('removeArticle')
        .addClass('addArticle')
        .attr('id', that.data('start'))
        .text('Add')
        setupClicks();

        if (that.hasClass('main')) {
          location.reload()
        }
      })
    })

    $('.addNote').on('click', function() {
      $('#noteSubmit').attr('data-id', $(this).data('id'))
      $('.modal.note').toggleClass('shown');
      $('.modal.note').find('.modalWindow').toggleClass('shown')
    })
  
    $('#noteSubmit').on('click', function(e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: '/articles/' + $(this).data('id') + '/note',
        data: {
          body: $('#text').val().trim()
        }
      })
      .done(function(data) {
        setupClicks();
        location.reload();
      })
      .catch(function(err) {
        console.log(err)
      })
    })

    $('.viewNote').on('click', function() {
      console.log($(this).data('note'))
      $.ajax({
        method: "GET",
        url: '/note/' + $(this).data('note')
      }).done(function(data) {
        // poplulate modal
        console.log(data)
      })
    })

  }


  setupClicks();



  

})






// function addArticle(a) {
//   $.ajax({
//     type: "POST",
//     url: '/articles',
//     data: scrapedArticles[a]
//   }).done(function(res) {
//     $('#' + a).removeClass('addArticle')
//     .addClass('removeArticle')
//     .attr('id', res._id)
//     .attr('onclick', 'removeArticle("' + res._id +'")')
//     .text('Remove')
//   })

// }

// function removeArticle(id) {
//   $.ajax({
//     type: "DELETE",
//     url: '/articles/' + id,
//   }).done(function(res) {
//     console.log(res)
//     $('#' + id).removeClass('removeArticle')
//     .addClass('addArticle')
//     .attr('id', res._id)
//     .attr('onclick', 'addArticle("' + res._id +'")')
//     .text('add')
//   })
// }
