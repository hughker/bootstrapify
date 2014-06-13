/*
 * Shopify - jQuery Ajax add to cart.
 */
 
(function($) {
  
  var AjaxCart = function($ele, settings){
    this.$form = $ele;
    this.settings = settings;
    this.formSubmit = this.$form.find('input[name="add"]');
    this.addEventHandlers();
  };
  
  AjaxCart.prototype.addEventHandlers = function(){
    var self = this;
    this.$form.on('submit', function(e){
      e.preventDefault();
      self.sendToCart();
    });
  };
  
  AjaxCart.prototype.sendToCart = function(){
    this.updateSubmit('Adding...', true);
    this.postToCart();
  };
  
  AjaxCart.prototype.postToCart = function(){
    var self = this;
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: this.settings.cartURL,
      data: this.$form.serialize()
    })
    .done(function(product){
      self.sendToCartSuccess(product);
    })
    .fail(function(err, status){
      self.sendToCartError(err, status);
    });
  };
  
  AjaxCart.prototype.sendToCartSuccess = function(product){
    console.log(product);
    var message = product.title+' successfully added. <a href="/cart">View cart</a>';
    this.displayMessage(message, 'success');
    this.updateSubmit(this.settings.defaultSubmitValue, false);
  };
  
  AjaxCart.prototype.sendToCartError = function(err, status){
    console.log(err, status);
    try {
      var response = jQuery.parseJSON(err.responseText);
      this.displayMessage('ERROR: '+response, 'danger');
    } catch(e) {
      this.displayMessage('ERROR: There was an error adding your item to the cart.', 'danger');
    }
    this.updateSubmit(this.settings.defaultSubmitValue, false);
  };
  
  AjaxCart.prototype.updateSubmit = function(message, disable){
    this.formSubmit.val(message);
    if(disable){
      this.formSubmit.prop("disabled", true);
    } else {
      this.formSubmit.prop("disabled", false);
    }
  };
  
  AjaxCart.prototype.displayMessage = function(message, messageType){
    var messageMarkup = this.settings.messageMarkup(message, messageType);
    this.formSubmit.after(messageMarkup);
    var self = this;
    setTimeout(function(){
      self.removeMessage();
    }, 6000);
  };
  
  AjaxCart.prototype.removeMessage = function(){
    this.$form.find('.ajax-cart-message').hide(186, function(){
      this.remove();
    });
  };
  
  $.fn.ajaxCart = function(opts){
    var settings = $.extend({}, $.fn.ajaxCart.defaults, opts);
    return this.each(function(){
      var $ele = $(this);
      $ele.data('_ajaxCart', new AjaxCart($ele, settings));
    });
  };
  
  $.fn.ajaxCart.defaults = {
    cartURL: '/cart/add.js',
    defaultSubmitValue: 'Add to cart',
    messageMarkup: function(message, messageType){
      return '<span class="ajax-cart-message help-block text-'+messageType+'">'+message+'</span>';
    }
  };

}(jQuery));


$(function(){
  $('form[action="/cart/add"]').ajaxCart();
});