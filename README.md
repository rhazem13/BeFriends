# BeFriends

BeFriends is a social networking application that allows users to make new friends, connect with others, and engage in various activities. It provides features similar to Facebook, such as the ability to follow people, send messages, and view user profiles.

## Features

- User Registration: Users can create a new account by providing their information.
- User Authentication: Secure user authentication using JWT (JSON Web Tokens).
- User Profiles: Users can create and customize their profiles, add profile pictures, and provide personal information.
- Friend Requests: Users can send and accept friend requests to connect with others.
- News Feed: Users can view a personalized news feed, showing updates from their friends.
- Messaging: Users can send messages to their friends and engage in private conversations.
- Notifications: Users receive notifications for friend requests, messages, and other relevant activities.
- Drag and Drop Photo Upload: Users can easily upload photos by dragging and dropping them, integrated with a cloud platform.
- Filtering, Sorting, and Paging: Data can be filtered, sorted, and displayed in paginated form for better user experience.
- Authorization: Authorization and access control for different user roles and permissions.
- Repository Pattern: Data access layer implemented using the repository pattern for separation of concerns.
- Entity Framework Core: Object-Relational Mapping (ORM) tool for database access and persistence.
- AutoMapper: Object-to-object mapping library for simplifying data mapping between layers.
- 3rd Party Component Integration: Integration of third-party components into the Angular application for enhanced functionality.
- Private Messaging System: Implementation of a private messaging system for direct communication between users.
- Real-Time Notifications: Real-time notifications and presence using SignalR for instant updates and notifications.
- Error Handling: Proper error handling and error management for the API and the single-page application (SPA).
- Routing and Route Security: Adding routing to the Angular application and securing routes.
- Bootstrap: Building a great-looking UI using Bootstrap for responsive and visually appealing user interfaces.

## Technology Stack

### Backend

- .NET: The application is built using the .NET framework.
- C#: The primary programming language used for backend development.
- ASP.NET Web API: RESTful API endpoints for client-server communication.
- Entity Framework Core: Object-Relational Mapping (ORM) tool for database access.
- JWT: JSON Web Tokens for secure authentication and authorization.
- SignalR: Real-time communication library for enabling instant messaging and notifications.

### Frontend

- Angular: The frontend is developed using the Angular framework.
- TypeScript: The primary programming language used for frontend development.
- Reactive Forms: Angular's reactive forms approach for building dynamic and interactive forms.
- Bootstrap: CSS framework for building responsive and visually appealing user interfaces.

## Installation and Setup

### Backend

1. Clone the repository: `git clone https://github.com/rhazem13/BeFriends.git`
2. Navigate to the backend folder: `cd API`
3. Install dependencies: `dotnet restore`
4. Update the database connection string in the `appsettings.json` file.
5. Apply database migrations: `dotnet ef database update`
6. Run the backend server: `dotnet run`

### Frontend

1. Navigate to the frontend folder: `cd client`
2. Install dependencies: `npm install`
3. Run the frontend server: `ng serve`

## Usage

1. Access the application through the provided URL.
2. Create a new account or log in with your existing credentials.
3. Explore the application features, such as searching for friends, sending friend requests, messaging, and updating your profile.
4. Interact with the news feed, view notifications,
5. Customize your profile, upload photos, and manage your privacy settings.
6. Enjoy connecting with new friends and engaging with the BeFriends community.

## MIT License


Copyright (c) 2023 Hazem Ragab Mohammed Raafat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



© 2023 Hazem Ragab
