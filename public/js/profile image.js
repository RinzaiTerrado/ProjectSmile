// Function to handle file selection
/*

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const profilePicture = document.getElementById('profile-picture');
        profilePicture.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// Add event listener to the file input
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', handleFileSelect);

// Trigger file input click on button click
const editButton = document.getElementById('edit-button');
editButton.addEventListener('click', function() {
    fileInput.click();
});
*/