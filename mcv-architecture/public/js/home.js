// Wait until the page has fully loaded before running the script.
document.addEventListener('DOMContentLoaded', function ()
{
    const searchInput = document.getElementById('search');

    // If the search field exists on this page,
    // add some small UI behavior to improve usability.
    if (searchInput)
    {
        // Change the placeholder text when the field is focused.
        searchInput.addEventListener('focus', function ()
        {
            searchInput.setAttribute('placeholder', 'Type a movie title...');
        });

        // Restore the original placeholder when focus leaves the field.
        searchInput.addEventListener('blur', function ()
        {
            searchInput.setAttribute('placeholder', 'Enter movie title');
        });
    }
});