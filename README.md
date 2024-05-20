# Pokemon Team Builder project

### What's missing?

- No missing features, all the requirements are implemented.

### Knows bugs and issues

- No known bugs or issues in the application itself.
- In docker, occasionally, during docker build, an error is thrown where some checksums don't match. This is a known issue with latest docker versions, and it's not related to the application itself. Just prune the builder cache and rebuild the application with --no-cache flag.

## How to run the application

Note: I usually use pnpm as a package manager, but you can use npm or yarn if you prefer.
Note: Developed using node v20.13.1, tested up to node 22
To set the right node version, just use `nvm use` or (`nvm install` and then `nvm use`) in the root folder.

### Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the db. You can choose between using start-database.sh, which will start a docker container with the database, and also set the .env file with the correct database URL, or you can run the database locally (or in the cloud) and set the .env file manually. (env.example is provided)
4. Run `pnpm dp:push` to apply the database schema
5. Run the application: `pnpm dev`
6. Open the browser and go to `http://localhost:3000`

Note: The application use docker, to set up both the database and the application.

### Production

1. Clone the repository
2. Prune eventual conflicting dependencies: `docker builder prune` (if needed)
3. Build the application: `docker-compose build` (If needed, you can use the `--no-cache` flag)
4. Run the application: `docker-compose up`
5. Open the browser and go to `http://localhost:3000`

## Description

This project is a Pokemon Team Builder application that allows users to create and manage, their Pokemon teams. It provides a user-friendly interface for adding and removing random Pokemon, as well as viewing detailed information about each Pokemon. The application leverages the Pokemon API to fetch data about Pokemon species and abilities, ensuring that users have access to up-to-date information.

## Choices and decisions

### Starting template

I used t3 stack template as a starting point for this project. It provides a solid foundation for building full-stack applications with Next.js, Prisma, and PostgreSQL. [T3 stack](https://create.t3.gg/)

### Data fetching

I'm using a combination of Next.js server actions and React Query's queries and mutations to handle data fetching and state management efficiently. This approach leverages the strengths of both technologies to ensure optimal performance and seamless user experiences.

### Database choice

I chose to use a PostgreSQL database for this project because it is a robust and reliable relational database that offers excellent performance and scalability. Also, it's fully compatible with Prisma, which simplifies database interactions and ensures data integrity.
I also decided to save the data coming from the Pokemon API to the database, to avoid unnecessary requests to the API. Once some time has passed, Data will be automatically updated on first request.

### Type filtering

I choosed to use an "OR" filter for the types, so the user can filter pokemon team by one or more types. It's easily switchable to an "AND" filter, but I think it's more user-friendly to have the "OR" filter.

### Why there's no team/list route?

I decided, for navigation simplicity, to move the "list" visualization to them "team" route. It feels better to have the pages in the hyerarchy of the routes, and it's easier to navigate between them. (Using breadcrumbs, for example)

### Main Packages Used

- **Next.js**: I chose Next.js because it is an excellent framework for React, offering features that improve both development efficiency and application performance. It excels in server-side rendering and static site generation, which enhances SEO and provides a seamless deployment experience.

- **React Query**: React Query is my go-to library for managing data fetching and caching. It simplifies asynchronous operations and ensures efficient state management, making it a powerful tool for handling server state in React applications.

- **Framer Motion**: Framer Motion is my preferred library for creating animations. It offers a simple and intuitive API for designing complex animations and interactions, which significantly enhances the user experience.

- **Tailwind CSS**: Tailwind CSS is a utility-first CSS framework that provides a highly efficient way to style applications. Its utility classes allow for rapid development and consistent design, making it easy to create responsive and visually appealing interfaces.

- **ShadcnUI**: ShadcnUI is a comprehensive library of UI components that streamline the development process. Its ready-to-use components adhere to best practices and design principles, facilitating the creation of professional and polished user interfaces.

- **TanStack Table**: TanStack Table is an excellent library for building powerful and flexible tables in React. It offers extensive features for data presentation and interaction, ensuring that tables are both functional and aesthetically pleasing.

- **Zod**: Zod is a robust library for schema validation and state management. It ensures that the application state adheres to predefined schemas, which helps in maintaining data integrity and reducing runtime errors.

- **React Hook Form**: React Hook Form is a lightweight library for managing form state in React applications. It simplifies form validation and submission, making it easy to create dynamic and interactive forms.

- **Prisma**: Prisma is an ORM that simplifies database interactions in Node.js applications. It provides a type-safe API for querying databases, which enhances developer productivity and ensures data integrity.

<!-- author -->

## Author

Lorenzo 'Lolelu' Cherubin
