jQuery(document).ready(function(){

	//initualize variables
	var formModal = $('.cd-user-modal'),
		formLogin = formModal.find('#cd-login'),
		formSignup = formModal.find('#cd-signup'),
		formForgotPassword = formModal.find('#cd-reset-password'),
		formModalTab = $('.cd-switcher'),
		tabLogin = formModalTab.children('li').eq(0).children('a'),
		tabSignup = formModalTab.children('li').eq(1).children('a'),
		forgotPasswordLink = formLogin.find('.cd-form-bottom-message a'),
		backToLoginLink = formForgotPassword.find('.cd-form-bottom-message a'),
		mainNav = $('.main-nav'),
	  	config = {
	      apiKey: "AIzaSyDdkve5V7CP9ZmKlc5TzLR6ZQSic-FIgNg",
	      authDomain: "inf551-985c0.firebaseapp.com",
	      databaseURL: "https://inf551-985c0.firebaseio.com",
	      projectId: "inf551-985c0",
	      storageBucket: "inf551-985c0.appspot.com",
	      messagingSenderId: "511714336500"
	    };

	firebase.initializeApp(config);




	//open modal
	mainNav.on('click', function(event){
		$(event.target).is(mainNav) && mainNav.children('ul').toggleClass('is-visible');
	});	
	//close modal
	formModal.on('click', function(event){
		if( $(event.target).is(formModal) || $(event.target).is('.cd-close-form') ) {
			formModal.removeClass('is-visible');
		}
	});
	//close modal when clicking the esc keyboard button
	$(document).keyup(function(event){
    	if(event.which=='27'){
    		formModal.removeClass('is-visible');
	    }
    });
	//open sign-up form
	mainNav.on('click', '.cd-signup', signup_selected);
	//open login-form form
	mainNav.on('click', '.cd-signin', login_selected);
	mainNav.on('click', '.cd-logout', function(event){
      	firebase.auth().signOut();

		console.log('try to log out');
        firebase.auth().onAuthStateChanged(function(firebaseUser){
			if (firebaseUser){
				console.log(firebaseUser+'not logged out');
			}else {
				console.log('logged out');
			    document.getElementsByClassName('cd-signin')[0].style.visibility = 'visible';
			    document.getElementsByClassName('cd-signup')[0].style.visibility = 'visible';
			    $(".cd-logout").removeClass('is-visible');
			    $(".cd-user").removeClass('is-visible');
			}
		});
	});
	//go to personal Info page
	mainNav.on('click', '.cd-user', function(event){
		firebase.auth().onAuthStateChanged(function(firebaseUser){
			if (firebaseUser){
				window.location = "personal.html";
			}
			else {
				console.log('not logged in');
			}
      	});
	});

	//go back to home page
	$("#cd-logo").on('click', function(event){
		firebase.auth().onAuthStateChanged(function(firebaseUser){
			if (firebaseUser){
				window.location = "Home.html";
			}
			else {
				console.log('unable to return');
			}
      	});
	});

	//show forgot-password form
	forgotPasswordLink.on('click', function(event){
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	backToLoginLink.on('click', function(event){
		event.preventDefault();
		login_selected();
	});

	//switch from a tab to another
	formModalTab.on('click', function(event) {
		event.preventDefault();
		( $(event.target).is( tabLogin ) ) ? login_selected() : signup_selected();
	});

	function login_selected(){
		mainNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formLogin.addClass('is-selected');
		formSignup.removeClass('is-selected');
		formForgotPassword.removeClass('is-selected');
		tabLogin.addClass('selected');
		tabSignup.removeClass('selected');
	}

	function signup_selected(){
		mainNav.children('ul').removeClass('is-visible');
		formModal.addClass('is-visible');
		formLogin.removeClass('is-selected');
		formSignup.addClass('is-selected');
		formForgotPassword.removeClass('is-selected');
		tabLogin.removeClass('selected');
		tabSignup.addClass('selected');
	}

	function forgot_password_selected(){
		formLogin.removeClass('is-selected');
		formSignup.removeClass('is-selected');
		formForgotPassword.addClass('is-selected');
	}


	//hide or show password
	$('.hide-password').on('click', function(){
		var togglePass= $(this),
			passwordField = togglePass.prev('input');

		( 'password' == passwordField.attr('type') ) ? passwordField.attr('type', 'text') : passwordField.attr('type', 'password');
		( 'Hide' == togglePass.text() ) ? togglePass.text('Show') : togglePass.text('Hide');
		//focus and move cursor to the end of input field
		passwordField.putCursorAtEnd();
	});


	/*
	communicate with DB
	*/
	var user;
	//login
	formLogin.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		email = document.getElementById("loginEmail").value;
		pass = document.getElementById("loginPass").value;
		auth = firebase.auth();
	    //Sign in

        auth.signInWithEmailAndPassword(email, pass).catch(function(error) {
        	var errorMessage = error.message;
        	formLogin.find('input[type="email"]').next('span').toggleClass('is-visible').text(errorMessage);
	       	
        });
        auth.onAuthStateChanged(function(firebaseUser){
			if (firebaseUser){
				console.log(firebaseUser.uid+" signed in");
		        formModal.removeClass('is-visible');
			    document.getElementsByClassName('cd-signin')[0].style.visibility = 'hidden';
			    document.getElementsByClassName('cd-signup')[0].style.visibility = 'hidden';
		        $(".cd-logout").addClass('is-visible');
		        $(".cd-user").addClass('is-visible');
		        user = firebase.auth().currentUser;
			}else {
				console.log(firebaseUser+'not logged in');
			}
		});
	});


	//sign up
	formSignup.find('input[type="submit"]').on('click', function(event){
		event.preventDefault();
		email = document.getElementById("signupEmail").value;
		pass = document.getElementById("signupPass").value;
		auth = firebase.auth();

        auth.createUserWithEmailAndPassword(email, pass).catch(function(error) {        	
        	var errorMessage = error.message;
        	formSignup.find('input[type="email"]').next('span').toggleClass('is-visible').text(errorMessage);
	    });
        auth.onAuthStateChanged(function(firebaseUser) {
			if (firebaseUser){
				console.log(firebaseUser.uid+" signed up");
				formModal.removeClass('is-visible');
		        $(".cd-logout").addClass('is-visible');
		        $(".cd-user").addClass('is-visible');
			    document.getElementsByClassName('cd-signin')[0].style.visibility = 'hidden';
			    document.getElementsByClassName('cd-signup')[0].style.visibility = 'hidden';
				user = firebase.auth().currentUser;
			}else {
				console.log(firebaseUser+'not logged in');
			}
		});
	});

	//if a user already signed up
	firebase.auth().onAuthStateChanged(function(firebaseUser) {
	    if (firebaseUser) {
	      // User is signed in.
			console.log(firebaseUser.uid+ " signed in");
			formModal.removeClass('is-visible');
	        $(".cd-logout").addClass('is-visible');
	        $(".cd-user").addClass('is-visible');	        
		    document.getElementsByClassName('cd-signin')[0].style.visibility = 'hidden';
		    document.getElementsByClassName('cd-signup')[0].style.visibility = 'hidden';			
	    } else {
	      	console.log('Nobody logged in!');	      	
			formModal.removeClass('is-visible');
	        $(".cd-logout").removeClass('is-visible');
	        $(".cd-user").removeClass('is-visible');	        
		    document.getElementsByClassName('cd-signin')[0].style.visibility = 'visible';
		    document.getElementsByClassName('cd-signup')[0].style.visibility = 'visible';		
	    }
  	});

	//IE9 placeholder fallback
	//credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
	if(!Modernizr.input.placeholder){
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
		  	}
		}).blur(function() {
		 	var input = $(this);
		  	if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.val(input.attr('placeholder'));
		  	}
		}).blur();
		$('[placeholder]').parents('form').submit(function() {
		  	$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
			 		input.val('');
				}
		  	})
		});
	}

});

//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
	return this.each(function() {
    	// If this function exists...
    	if (this.setSelectionRange) {
      		// ... then use it (Doesn't work in IE)
      		// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
      		var len = $(this).val().length * 2;
      		this.focus();
      		this.setSelectionRange(len, len);
    	} else {
    		// ... otherwise replace the contents with itself
    		// (Doesn't work in Google Chrome)
      		$(this).val($(this).val());
    	}
	});
};


