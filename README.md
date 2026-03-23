# CS440 Movie Database MVC Version

This project is refactored using the REST architectural style with the Django Framework.

This version runs locally with the following technology stack
- Django
- Javascript
- SQLlite3
- Django Templates
- HTML
- CSS

No external services or databases are required as everything is packaged within the Django framework. I choose this 
due to my (Elizabeth Booth) familiarity with the framework in full stack applications. The built-in database CLI 
makes it easy to transfer the database from Suprabase to SQLite3 integrated within python.

# Requirements

You must have these installed
- Python
- Django
- SQLite3

You can check with 
`python -m django --version`

# Setup Instructions

Clone the repository
`git clone https://github.com/heb229/CS440-Project.git`

Then navigate to the branch 
`git checkout refactor-django`

Create the python virtual enviornment
`python -m venv venv`

CD into the folder django_refactor (make sure to do this after the venv is created)
`cd django_refactor`

# Running the server

Run the server with
`python manage.py runserver`

# Opening the website

Click on the link that runs locally on your computer when executing the above statement.

# To access database

You can view any stored information
`python manage.py shell`


