# Project Title
MyServer App

## Project Description
The Book App is a Node.js/Express server application designed for handling various tasks related to user management, book storage, and more.

## Table of Contents (Optional)
Installation
Usage
Endpoints
Contributing
License

## Installation
Clone the repository: git clone https://github.com/your-username/MyServer.git
Install dependencies: npm install
Set up the database: npm run db:migrate
Start the server: npm start

## Usage
To use the server, make requests to the provided endpoints. Ensure proper authentication and follow the API documentation.

## Endpoints
# /user: User-related endpoints
POST /user/register: Get user by ID
POST /user/login: Create a new user
PUT /user/update/username: Update username
PUT /user/update/email: Update email
PUT /user/update/password: Update password
PATCH /user/upload/profile-picture: Upload profile picture
PATCH /user/remove/profile-picture: Remove profile picture
DELETE /user/delete: Delete user by ID

# /admin: Admin-related endpoints
POST /admin/register: Create a new admin
GET /admin/get/users: Get all users
GET /admin/get/:userId: Get a user
PUT /admin/update/role/userId: Update a user's role
DELETE /admin/delete/userId: Delete a user by ID

# /book: Book-related endpoints
POST /book/create: Create book
GET /book/get/all: Get All books
GET /book/get/books/:userId: Get all books by User
GET /book/get/:id: Get single book by ID
GET /book/get-tags: Get books by tags
PUT /book/update/:bookId: Update a book by ID
PATCH /book/patch/:bookId: Patch book property by ID
PATCH /book/upload/cover-picture/:bookId Upload cover picture by ID
PATCH /book/remove/cover-picture/:bookId Remove cover picture by ID
DELETE /book/delete/:bookId Delete a book by ID

# /chapter: Chapter-related endpoints
POST /chapter/create/:bookId: Create a new chapter
GET /chapter/get/:bookId: Get all chapters by book ID
PUT /chapter/update/:chapterId: Update chapter by ID
DELETE /chapter/delete/:chapterId: Delete chapter by ID

# /review: Review-related endpoints
POST /review/create/:bookId: Create a new book review by it's ID
GET /review/get/:bookId: Get all reviews for a book by it's ID
PUT /review/update/:reviewId: Update a review by ID
PATCH /review/patch/:reviewId: Patch a review by ID
DELETE /review/delete/:reviewId: Delete a review by ID

# /tag: Tag related endpoints
POST /tag/create: Create a new tag
GET /tag/get: Get all tags
PUT /tag/update/:tagId: Update a tag by ID
PATCH /tag/add/:bookId: Add tags to book by its ID
PATCH /tag/remove/:bookId: Remove tags from book by its ID
DELETE /tag/delete/:bookId: Delete a tag by ID

## Contributing
Fork the repository
Create a new branch: git checkout -b feature-new-feature
Make your changes and commit them: git commit -m 'Add new feature'
Push to the branch: git push origin feature-new-feature
Submit a pull request

## License
This project is licensed under the MIT License.