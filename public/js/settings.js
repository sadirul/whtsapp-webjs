let currentApiKey = null; // Store user's API key for default headers

/**
 * Document ready
 */
$(document).ready(function() {
    console.log('Settings page loaded');
    
    // Load common layout (sidebar & header)
    loadCommonLayout('settings');
    
    // Load API key
    loadAPIKey();
});

/**
 * Check authentication and load user data
 */
function checkAuth() {
    console.log('Checking authentication...');
    $.ajax({
        url: '/api/auth/current-user',
        type: 'GET',
        success: function(response) {
            console.log('Auth check response:', response);
            if (response.success) {
                // User is authenticated
            }
        },
        error: function(err) {
            console.error('Auth check error:', err);
            // Not authenticated, redirect to login
            window.location.href = '/';
        }
    });
}

/**
 * Load API key
 */
function loadAPIKey() {
    console.log('Loading API key...');
    $.ajax({
        url: '/api/auth/current-user',
        type: 'GET',
        success: function(response) {
            console.log('Full response:', response);
            if (response.success) {
                // Try multiple paths to get API key (handles different response formats)
                let apiKey = response.user?.api_key || 
                             response.user?.apiKey || 
                             response.api_key || 
                             response.apiKey;
                
                console.log('API Key extracted:', apiKey);
                
                if (apiKey) {
                    currentApiKey = apiKey; // Store globally for default headers
                    
                    // Set the value multiple ways to ensure it works
                    if ($('#apiKey').length) {
                        $('#apiKey').val(apiKey);
                        $('#apiKey').attr('value', apiKey);
                        console.log('API Key set in input element');
                    } else {
                        console.warn('API Key input element not found');
                    }
                    
                    console.log('API Key set:', currentApiKey);
                } else {
                    console.error('API key not found in response. Response structure:', response);
                }
            }
        },
        error: function(err) {
            console.error('Failed to load API key:', err);
            console.error('Error response:', err.responseJSON);
        }
    });
}

/**
 * Toggle API Key visibility
 */
function toggleAPIKeyVisibility() {
    const $apiKeyInput = $('#apiKey');
    const $toggleBtn = $('button:contains("Show")');
    
    if ($apiKeyInput.attr('type') === 'password') {
        $apiKeyInput.attr('type', 'text');
        $toggleBtn.text('Hide');
    } else {
        $apiKeyInput.attr('type', 'password');
        $toggleBtn.text('Show');
    }
}

/**
 * Copy API Key to clipboard
 */
function copyAPIKey() {
    const apiKey = $('#apiKey').val();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(apiKey).then(() => {
            $('#copyNotification').show().fadeOut(2000);
        });
    } else {
        // Fallback for older browsers
        const $temp = $('<input>');
        $('body').append($temp);
        $temp.val(apiKey).select();
        document.execCommand('copy');
        $temp.remove();
        $('#copyNotification').show().fadeOut(2000);
    }
}

/**
 * Copy cURL command with actual API key
 */
function copyCurl(endpoint) {
    let curlCode = '';
    
    // Get the original curl code and replace placeholder with actual API key
    const curlElement = document.getElementById(`curl-${endpoint}`);
    if (curlElement) {
        curlCode = curlElement.textContent;
        // Replace placeholder with actual API key
        curlCode = curlCode.replace('YOUR_API_KEY', currentApiKey);
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(curlCode).then(() => {
            showAlert('cURL command copied to clipboard with your API key!', 'success');
        }).catch(() => {
            fallbackCopyCurl(curlCode);
        });
    } else {
        fallbackCopyCurl(curlCode);
    }
}

/**
 * Fallback copy for older browsers
 */
function fallbackCopyCurl(text) {
    const $temp = $('<textarea>');
    $('body').append($temp);
    $temp.val(text).select();
    document.execCommand('copy');
    $temp.remove();
    showAlert('cURL command copied to clipboard with your API key!', 'success');
}
