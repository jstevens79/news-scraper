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

  $('.closeModal').on('click', function(e) {
    $(this).parent().parent().toggleClass('shown');
    $(this).parent().toggleClass('shown');
    location.reload();
  })


  function setupClicks() {
    $('.addArticle').off();
    $('.removeArticle').off();
    $('.addNote').off();
    $('.noteSubmit').off();
    $('.viewNote').off();
    $('.editNote').off();
    $('.deleteNote').off();
    $('.noteUpdate').off();

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

    $('.editNote').on('click', function() {
      $.ajax({
        method: "GET",
        url: '/note/' + $(this).attr('id')
      }).done(function(data) {
        populateNoteModal({type: 'edit', data: data})
      })
    })

    $('.deleteNote').on('click', function() {
      var that = $(this)
      $.ajax({
        type: "DELETE",
        url: '/note/' + $(this).attr('id'),
      }).done(function(res) {
        location.reload()
        setupClicks();
      })
    })
    
    $('.noteSubmit').on('click', function(e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: '/articles/' + $(this).data('id') + '/note',
        data: {
          title: $('#noteTitle').val().trim(),
          body: $('#noteBody').val().trim()
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
      $.ajax({
        method: "GET",
        url: '/note/' + $(this).data('note')
      }).done(function(data) {
        populateNoteModal({type: 'view', data: data})
      })
    })

    $('.addNote').on('click', function() {
      $('.noteSubmit').attr('data-id', $(this).data('id'));
      populateNoteModal({type: 'add'})
    })

    $('.noteUpdate').on('click', function(e) {
      e.preventDefault();
      $.ajax({
        method: "PUT",
        url: '/note/' + $(this).data('id'),
        data: {
          title: $('#noteTitle').val().trim(),
          body: $('#noteBody').val().trim()
        }
      })
      .done(function() {
        location.reload()
      })
    })

    function populateNoteModal(obj) {
      if (obj.type === 'view') {
        $('.modal.note').find('form').hide();
        var title = $('<h1>').text(obj.data.title);
        var body = $('<p>').text(obj.data.body);
        var buttons = $('<div>').addClass('noteButtons');
        var editButton = $('<button>').addClass('editNote')
          .attr('id', obj.data._id)
          .text('Edit note');
        var deleteButton = $('<button>').addClass('deleteNote')
          .attr('id', obj.data._id)
          .text('Delete note');
        buttons.append(editButton, deleteButton)
        $('.modal.note').find('.modalContent').append(title, body, buttons);
        $('.modal.note').toggleClass('shown');
        $('.modal.note').find('.modalWindow').toggleClass('shown');
        setupClicks()
      } else if (obj.type === 'add') {
        $('.modal.note').find('h1').remove();
        $('.modal.note').find('p').remove();
        $('.noteButtons').remove();
        $('.modal.note').find('form').show();
        $('#noteSubmit')
          .removeClass('noteUpdate')
          .addClass('noteSubmit')
          .text('Add Note')
        $('.modal.note').toggleClass('shown');
        $('.modal.note').find('.modalWindow').toggleClass('shown');
        setupClicks()
      } else {
        $('.noteButtons').remove();
        $('.modal.note').find('h1').remove();
        $('.modal.note').find('p').remove();
        $('#noteTitle').val(obj.data.title);
        $('#noteBody').val(obj.data.body);
        $('#noteSubmit')
          .attr('data-id', obj.data._id)
          .removeClass('noteSubmit')
          .addClass('noteUpdate')
          .text('Update Note')
        $('.modal.note').find('form').show();
        setupClicks();
      }
      
    }

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
