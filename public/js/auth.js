/**
 * Toggle between login and register forms
 */
function toggleForms() {
    $('#loginForm').toggleClass('active');
    $('#registerForm').toggleClass('active');
    
    // Clear errors
    $('#loginError').hide();
    $('#registerError').hide();
    $('#registerSuccess').hide();
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    const $btn = $('#loginBtn');
    const $spinner = $btn.find('.spinner');
    const $text = $btn.find('.btn-text');
    
    // Disable button and show spinner
    $btn.prop('disabled', true);
    $spinner.show();
    $text.hide();
    
    $.ajax({
        url: '/api/auth/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function(response) {
            if (response.success) {
                // Redirect to dashboard
                window.location.href = '/dashboard';
            }
        },
        error: function(xhr) {
            const response = xhr.responseJSON;
            $('#loginError').text(response.message || 'Login failed').show();
            
            // Reset button
            $btn.prop('disabled', false);
            $spinner.hide();
            $text.show();
        }
    });
}

/**
 * Handle register form submission
 */
function handleRegister(event) {
    event.preventDefault();
    
    const name = $('#registerName').val();
    const email = $('#registerEmail').val();
    const password = $('#registerPassword').val();
    const confirmPassword = $('#registerConfirmPassword').val();
    const $btn = $('#registerBtn');
    const $spinner = $btn.find('.spinner');
    const $text = $btn.find('.btn-text');
    
    // Disable button and show spinner
    $btn.prop('disabled', true);
    $spinner.show();
    $text.hide();
    
    $.ajax({
        url: '/api/auth/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, email, password, confirmPassword }),
        success: function(response) {
            if (response.success) {
                $('#registerSuccess').text(response.message).show();
                
                // Reset form and switch to login
                $('form')[1].reset();
                setTimeout(() => {
                    toggleForms();
                }, 1500);
            }
        },
        error: function(xhr) {
            const response = xhr.responseJSON;
            $('#registerError').text(response.message || 'Registration failed').show();
            
            // Reset button
            $btn.prop('disabled', false);
            $spinner.hide();
            $text.show();
        }
    });
}
