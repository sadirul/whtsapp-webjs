/**
 * Common functions for all pages
 */

/**
 * Load common layout components
 */
function loadCommonLayout(activePage) {
    // Load sidebar
    $.get('/layouts/sidebar.html', function(data) {
        const sidebar = $(data);
        
        // Set active nav item based on page
        if (activePage === 'dashboard') {
            sidebar.find('#navDashboard').addClass('active');
        } else if (activePage === 'settings') {
            sidebar.find('#navSettings').addClass('active');
        }
        
        // Insert sidebar before main content
        $('.dashboard').prepend(sidebar);
    });
    
    // Load header - insert in main-content
    $.get('/layouts/header.html', function(data) {
        $('.main-content').prepend(data);
        
        // Load user data after header is inserted
        loadUserData();
    });
}

/**
 * Load user data and update UI
 */
function loadUserData() {
    $.ajax({
        url: '/api/auth/current-user',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                $('#userGreeting').text(`Welcome, ${response.user.name}!`);
                $('#userEmail').text(response.user.email);
            }
        },
        error: function() {
            window.location.href = '/';
        }
    });
}

/**
 * Logout user
 */
function handleLogout() {
    Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/api/auth/logout',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({}),
                success: function(response) {
                    if (response.success) {
                        window.location.href = '/';
                    }
                },
                error: function() {
                    window.location.href = '/';
                }
            });
        }
    });
}

/**
 * Show alert notification - using SweetAlert
 */
function showAlert(message, type = 'info') {
    let icon = 'info';
    let title = 'Information';
    
    if (type === 'success') {
        icon = 'success';
        title = 'Success';
    } else if (type === 'danger' || type === 'error') {
        icon = 'error';
        title = 'Error';
    } else if (type === 'warning') {
        icon = 'warning';
        title = 'Warning';
    }
    
    Swal.fire({
        title: title,
        text: message,
        icon: icon,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
}
