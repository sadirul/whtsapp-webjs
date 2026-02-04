let pollingInterval;
let qrPollingInterval; // Separate interval for QR polling
const POLLING_INTERVAL = 3000; // 3 seconds
let lastQRCode = null; // Store last QR code to avoid unnecessary updates
let isQRPolling = false; // Track if QR polling is active
let currentApiKey = null; // Store user's API key for default headers

/**
 * Document ready
 */
$(document).ready(function() {
    // Load common layout (sidebar & header)
    loadCommonLayout('dashboard');
    
    // Check if user is authenticated
    checkAuth();
});

/**
 * Check authentication and load user data
 */
function checkAuth() {
    $.ajax({
        url: '/api/auth/current-user',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                loadUserData(response.user);
            }
        },
        error: function() {
            // Not authenticated, redirect to login
            window.location.href = '/';
        }
    });
}

/**
 * Load user data and update UI
 */
function loadUserData(user) {
    $('#userGreeting').text(`Welcome, ${user.name}!`);
    $('#userEmail').text(user.email);
    
    // Load API key
    loadAPIKey();
    
    // Check WhatsApp status
    checkWhatsAppStatus();
    
    // Start polling for WhatsApp updates
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(checkWhatsAppStatus, POLLING_INTERVAL);
}

/**
 * Load API key
 */
function loadAPIKey() {
    $.ajax({
        url: '/api/auth/current-user',
        type: 'GET',
        async: false, // Make synchronous to ensure API key is loaded before use
        success: function(response) {
            if (response.success) {
                const apiKey = response.user.api_key;
                console.log('API Key loaded:', apiKey);
                currentApiKey = apiKey; // Store globally for default headers
                $('#apiKey').val(apiKey);
                $('#apiKey').attr('value', apiKey); // Ensure value is set
            }
        },
        error: function(err) {
            console.error('Failed to load API key:', err);
        }
    });
}

/**
 * Check WhatsApp status
 */
function checkWhatsAppStatus() {
    $.ajax({
        url: '/whatsapp/status',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                updateWhatsAppUI(response);
            }
        },
        error: function(xhr) {
            if (xhr.status === 401) {
                // Session expired
                window.location.href = '/';
            }
        }
    });
}

/**
 * Update WhatsApp UI based on status
 */
function updateWhatsAppUI(response) {
    // Don't update UI if QR polling is active
    if (isQRPolling) {
        return;
    }
    
    const connected = response.connected;
    const statusBadge = $('#connectionStatus');
    
    if (connected && response.clientInfo) {
        // Connected state
        statusBadge.html(`
            <span class="status-dot connected"></span>
            <span class="status-text connected">Connected</span>
        `);
        
        $('#clientName').text(response.clientInfo.pushname || 'N/A');
        $('#clientPhone').text(response.clientInfo.phone || 'N/A');
        
        $('#initContainer').hide();
        $('#qrContainer').hide();
        $('#connectedContainer').show();
        $('#sendMessageSection').show();
        $('#sendMediaSection').show();
        $('#sendUrlSection').show();
    } else {
        // Not connected state
        statusBadge.html(`
            <span class="status-dot"></span>
            <span class="status-text">Disconnected</span>
        `);
        
        $('#connectedContainer').hide();
        $('#sendMessageSection').hide();
        $('#sendMediaSection').hide();
        $('#sendUrlSection').hide();
        $('#qrContainer').hide();
        $('#initContainer').show();
    }
}

/**
 * Initialize WhatsApp connection
 */
function handleInitWhatsApp() {
    const $btn = $('.btn-success');
    const $spinner = $btn.find('.spinner');
    const $text = $btn.find('#initBtnText');
    
    // Reset last QR code when initializing
    lastQRCode = null;
    
    // Stop regular status polling while QR polling is active
    if (pollingInterval) clearInterval(pollingInterval);
    isQRPolling = true;
    
    $btn.prop('disabled', true);
    $spinner.show();
    $text.text('Initializing...');
    
    $.ajax({
        url: '/whatsapp/init',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function(response) {
            if (response.success) {
                $('#initContainer').hide();
                $('#connectedContainer').hide();
                $('#qrContainer').show();
                $('#qrSpinner').show();
                $('#qrCode').attr('src', ''); // Clear previous QR
                
                // Wait a bit before starting poll to let client initialize
                setTimeout(() => {
                    pollQRCode();
                }, 1000);
            }
        },
        error: function(xhr) {
            const response = xhr.responseJSON;
            showAlert(response.message || 'Failed to initialize WhatsApp', 'danger');
            isQRPolling = false;
            
            // Resume regular polling
            pollingInterval = setInterval(checkWhatsAppStatus, POLLING_INTERVAL);
            
            // Reset button
            $btn.prop('disabled', false);
            $spinner.hide();
            $text.text('Connect WhatsApp');
        }
    });
}

/**
 * Poll for QR code
 */
function pollQRCode() {
    const pollTimeout = 60000; // 60 seconds timeout
    const startTime = Date.now();
    
    qrPollingInterval = setInterval(() => {
        if (Date.now() - startTime > pollTimeout) {
            clearInterval(qrPollingInterval);
            isQRPolling = false;
            showAlert('QR code timeout. Please try again.', 'danger');
            $('#qrContainer').hide();
            $('#initContainer').show();
            
            // Resume regular status polling
            pollingInterval = setInterval(checkWhatsAppStatus, POLLING_INTERVAL);
            return;
        }
        
        $.ajax({
            url: '/whatsapp/qr',
            type: 'GET',
            success: function(response) {
                if (response.success) {
                    if (response.connected) {
                        // Successfully connected
                        clearInterval(qrPollingInterval);
                        isQRPolling = false;
                        $('#qrContainer').hide();
                        $('#qrSpinner').hide();
                        lastQRCode = null;
                        showAlert('WhatsApp connected successfully!', 'success');
                        
                        // Resume regular status polling and check status
                        pollingInterval = setInterval(checkWhatsAppStatus, POLLING_INTERVAL);
                        checkWhatsAppStatus();
                    } else if (response.qrCode) {
                        // Only update if QR code changed
                        if (lastQRCode !== response.qrCode) {
                            lastQRCode = response.qrCode;
                            $('#qrCode').attr('src', response.qrCode);
                            $('#qrSpinner').hide();
                            console.log('QR code updated');
                        }
                    }
                }
            },
            error: function() {
                // Continue polling
            }
        });
    }, 2500); // Poll every 2.5 seconds
}

/**
 * Send WhatsApp message
 */
function handleSendMessage(event) {
    event.preventDefault();
    
    const to = $('#messagePhone').val();
    const message = $('#messageText').val();
    const $btn = $('form').find('button[type="submit"]');
    const $spinner = $btn.find('.spinner');
    const $text = $btn.find('#sendBtnText');
    
    // Validate API key is loaded
    if (!currentApiKey) {
        console.error('API key not loaded yet');
        $('#messageError').text('API key not loaded. Please refresh the page.').show();
        return;
    }
    
    $btn.prop('disabled', true);
    $spinner.show();
    $text.text('Sending...');
    
    $.ajax({
        url: '/api/send-message',
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'x-api-key': currentApiKey // Add API key automatically
        },
        data: JSON.stringify({ to, message }),
        success: function(response) {
            if (response.success) {
                $('#messageSuccess').show().fadeOut(3000);
                $('form')[0].reset();
                
                // Reset button
                $btn.prop('disabled', false);
                $spinner.hide();
                $text.text('Send Message');
            }
        },
        error: function(xhr) {
            const response = xhr.responseJSON;
            $('#messageError').text(response.message || 'Failed to send message').show();
            
            // Reset button
            $btn.prop('disabled', false);
            $spinner.hide();
            $text.text('Send Message');
        }
    });
}

/**
 * Send media file via upload
 */
function handleSendMedia(event) {
    event.preventDefault();
    
    const to = $('#mediaPhone').val();
    const fileInput = document.getElementById('mediaFile');
    const caption = $('#mediaCaption').val();
    const $btn = $('#sendMediaSection').find('button[type="submit"]');
    const $spinner = $btn.find('.spinner');
    const $text = $btn.find('#sendMediaBtnText');
    
    // Validate API key is loaded
    if (!currentApiKey) {
        console.error('API key not loaded yet');
        $('#mediaError').text('API key not loaded. Please refresh the page.').show();
        return;
    }
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showAlert('Please select a file', 'danger');
        return;
    }
    
    const file = fileInput.files[0];
    
    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
        showAlert('File size must be less than 16MB', 'danger');
        return;
    }
    
    const formData = new FormData();
    formData.append('to', to);
    formData.append('file', file);
    formData.append('caption', caption);
    formData.append('filename', file.name);
    
    $btn.prop('disabled', true);
    $spinner.show();
    $text.text('Uploading...');
    
    $.ajax({
        url: '/api/send-media',
        type: 'POST',
        headers: {
            'x-api-key': currentApiKey // Add API key automatically
        },
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            if (response.success) {
                $('#mediaSuccess').show().fadeOut(3000);
                document.getElementById('mediaForm') && document.getElementById('mediaForm').reset();
                $('#mediaFile').val('');
                $('#mediaCaption').val('');
                $('#mediaPhone').val('');
                
                // Reset button
                $btn.prop('disabled', false);
                $spinner.hide();
                $text.text('Send Media');
            }
        },
        error: function(xhr) {
            const response = xhr.responseJSON;
            $('#mediaError').text(response.message || 'Failed to send media').show();
            
            // Reset button
            $btn.prop('disabled', false);
            $spinner.hide();
            $text.text('Send Media');
        }
    });
}

/**
 * Send media via URL
 */
function handleSendUrl(event) {
    event.preventDefault();
    
    const to = $('#urlPhone').val();
    const url = $('#mediaUrl').val();
    const caption = $('#urlCaption').val();
    const $btn = $('#sendUrlSection').find('button[type="submit"]');
    const $spinner = $btn.find('.spinner');
    const $text = $btn.find('#sendUrlBtnText');
    
    // Validate API key is loaded
    if (!currentApiKey) {
        console.error('API key not loaded yet');
        $('#urlError').text('API key not loaded. Please refresh the page.').show();
        return;
    }
    
    $btn.prop('disabled', true);
    $spinner.show();
    $text.text('Sending...');
    
    $.ajax({
        url: '/api/send-media-url',
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'x-api-key': currentApiKey // Add API key automatically
        },
        data: JSON.stringify({ to, url, caption }),
        success: function(response) {
            if (response.success) {
                $('#urlSuccess').show().fadeOut(3000);
                $('#urlPhone').val('');
                $('#mediaUrl').val('');
                $('#urlCaption').val('');
                
                // Reset button
                $btn.prop('disabled', false);
                $spinner.hide();
                $text.text('Send Media from URL');
            }
        },
        error: function(xhr) {
            const response = xhr.responseJSON;
            $('#urlError').text(response.message || 'Failed to send media').show();
            
            // Reset button
            $btn.prop('disabled', false);
            $spinner.hide();
            $text.text('Send Media from URL');
        }
    });
}

/**
 * Logout WhatsApp
 */
function handleWhatsAppLogout() {
    Swal.fire({
        title: 'Disconnect WhatsApp',
        text: 'Are you sure you want to disconnect WhatsApp?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, disconnect!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/whatsapp/logout',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({}),
                success: function(response) {
                    if (response.success) {
                        showAlert('WhatsApp disconnected', 'success');
                        checkWhatsAppStatus();
                    }
                },
                error: function(xhr) {
                    const response = xhr.responseJSON;
                    showAlert(response.message || 'Failed to disconnect WhatsApp', 'danger');
                }
            });
        }
    });
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

